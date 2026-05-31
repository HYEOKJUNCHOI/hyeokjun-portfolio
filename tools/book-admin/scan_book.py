# -*- coding: utf-8 -*-
"""
책장 관리 도구 (로컬 전용)
- 컴퓨터 카메라로 ISBN 바코드 스캔 (또는 수동 입력)
- 알라딘에서 제목·표지·분류 조회
- 표지가 틀리면(옛 판본 등) 다른 판본에서 고르거나 직접 URL 교체
- Firebase Firestore 'shelf' 컬렉션에 저장 (firebase-admin = 서버 권한, 규칙 우회)

준비물 (같은 폴더):
  1) config.json        ← config.example.json 복사 후 알라딘 키 채우기
  2) serviceAccount.json ← Firebase 콘솔 > 프로젝트설정 > 서비스 계정 > 새 비공개 키

실행:  python scan_book.py
"""

import json
import os
import sys
import re
from datetime import datetime, timezone

import requests

HERE = os.path.dirname(os.path.abspath(__file__))


# ──────────────────────────────────────────────────────────
# 설정 로드
# ──────────────────────────────────────────────────────────
def load_config():
    path = os.path.join(HERE, "config.json")
    if not os.path.exists(path):
        sys.exit("❌ config.json 이 없습니다. config.example.json 을 복사해 채우세요.")
    with open(path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    if not cfg.get("aladin_ttb_key") or "여기에" in cfg["aladin_ttb_key"]:
        sys.exit("❌ config.json 의 aladin_ttb_key 를 채우세요.")
    return cfg


# ──────────────────────────────────────────────────────────
# Firestore (firebase-admin)
# ──────────────────────────────────────────────────────────
def init_firestore(cfg):
    import firebase_admin
    from firebase_admin import credentials, firestore

    sa_path = os.path.join(HERE, cfg.get("service_account_path", "serviceAccount.json"))
    if not os.path.exists(sa_path):
        sys.exit(f"❌ 서비스 계정 키가 없습니다: {sa_path}\n"
                 "   Firebase 콘솔 > ⚙ 프로젝트 설정 > 서비스 계정 > '새 비공개 키 생성' 으로 받아 두세요.")
    cred = credentials.Certificate(sa_path)
    firebase_admin.initialize_app(cred)
    return firestore.client()


# ──────────────────────────────────────────────────────────
# 알라딘 조회
# ──────────────────────────────────────────────────────────
def _strip_jsonp(raw: str) -> str:
    s = raw.strip()
    a, b = s.find("{"), s.rfind("}")
    return s[a:b + 1] if a >= 0 and b > a else s


def upgrade_cover(url: str) -> str:
    """알라딘 표지를 항상 cover500(고화질)으로. coversum/cover/coverNNN → cover500"""
    if not url:
        return url
    return re.sub(r"/cover(?:sum|\d+)?/", "/cover500/", url)


def aladin_lookup_by_isbn(isbn13: str, ttbkey: str):
    """ISBN13 정확 조회 (ItemLookUp). 분류 leaf 까지."""
    url = "https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx"
    params = {
        "ttbkey": ttbkey, "itemIdType": "ISBN13", "ItemId": isbn13,
        "output": "js", "Version": "20131101", "Cover": "Big",
    }
    r = requests.get(url, params=params, timeout=10)
    data = json.loads(_strip_jsonp(r.text))
    items = data.get("item") or []
    if not items:
        return None
    return _normalize(items[0])


def aladin_search_by_title(query: str, ttbkey: str, limit=5):
    """제목 검색 (다른 판본 표지 고르기용)."""
    url = "https://www.aladin.co.kr/ttb/api/ItemSearch.aspx"
    params = {
        "ttbkey": ttbkey, "Query": query, "QueryType": "Title",
        "MaxResults": limit, "SearchTarget": "Book", "output": "js",
        "Version": "20131101", "Cover": "Big",
    }
    r = requests.get(url, params=params, timeout=10)
    data = json.loads(_strip_jsonp(r.text))
    return [_normalize(it) for it in (data.get("item") or [])]


def _normalize(item: dict) -> dict:
    cat = (item.get("categoryName") or "").split(">")
    return {
        "isbn13": str(item.get("isbn13") or ""),
        "title": re.sub(r"\s*-\s*.*$", "", str(item.get("title") or "")).strip(),
        "author": str(item.get("author") or "").strip(),
        "publisher": str(item.get("publisher") or "").strip(),
        "cover": upgrade_cover(str(item.get("cover") or "")),
        "pubDate": str(item.get("pubDate") or ""),
        "category": cat[-1].strip() if cat and cat[-1].strip() else "",
    }


# ──────────────────────────────────────────────────────────
# 카메라 ISBN 스캔
# ──────────────────────────────────────────────────────────
def scan_isbn_camera():
    try:
        import cv2
        from pyzbar.pyzbar import decode
    except ImportError:
        print("⚠ opencv-python / pyzbar 미설치 → 수동 입력으로.")
        return None

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("⚠ 카메라를 열 수 없습니다 → 수동 입력으로.")
        return None

    print("📷 ISBN 바코드를 카메라에 비춰주세요. (창에서 q = 취소)")
    isbn = None
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        for bc in decode(frame):
            code = bc.data.decode("utf-8")
            if code.isdigit() and len(code) == 13 and code.startswith(("978", "979")):
                isbn = code
                break
        cv2.putText(frame, "ISBN barcode... (q to cancel)", (12, 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 120), 2)
        cv2.imshow("Book Scan", frame)
        if isbn:
            break
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()
    return isbn


# ──────────────────────────────────────────────────────────
# 표지 확정 (자동 → 필요 시 교체)
# ──────────────────────────────────────────────────────────
def resolve_cover(book, ttbkey):
    print(f"\n  표지(기본): {book['cover'] or '(없음)'}")
    while True:
        ans = input("  표지 이대로? [Enter=확정 / s=다른 판본 검색 / u=URL 직접입력]: ").strip().lower()
        if ans == "":
            return book["cover"]
        if ans == "u":
            url = input("  표지 이미지 URL 붙여넣기: ").strip()
            if url:
                return upgrade_cover(url)
        elif ans == "s":
            results = aladin_search_by_title(book["title"], ttbkey)
            if not results:
                print("  검색 결과 없음.")
                continue
            for i, r in enumerate(results):
                print(f"   [{i}] {r['title']} / {r['author']} / {r['pubDate']}\n       {r['cover']}")
            pick = input("  번호 선택 (취소=Enter): ").strip()
            if pick.isdigit() and int(pick) < len(results):
                return results[int(pick)]["cover"]


# ──────────────────────────────────────────────────────────
# 메인 루프
# ──────────────────────────────────────────────────────────
def main():
    cfg = load_config()
    ttbkey = cfg["aladin_ttb_key"]
    db = init_firestore(cfg)
    col = cfg.get("collection", "shelf")
    print(f"✅ Firestore 연결됨 → 컬렉션 '{col}'\n")

    while True:
        mode = input("\n[c] 카메라 스캔  [m] ISBN 직접입력  [q] 종료 > ").strip().lower()
        if mode == "q":
            break

        isbn = None
        if mode == "c":
            isbn = scan_isbn_camera()
        if mode == "m" or (mode == "c" and not isbn):
            isbn = re.sub(r"\D", "", input("  ISBN13 13자리: ").strip())
        if not isbn or len(isbn) != 13:
            print("  ⚠ ISBN13 13자리가 아닙니다.")
            continue

        book = aladin_lookup_by_isbn(isbn, ttbkey)
        if not book:
            print(f"  ⚠ 알라딘에서 {isbn} 못 찾음.")
            continue

        print(f"\n  📖 {book['title']}")
        print(f"     저자: {book['author']} / 출판사: {book['publisher']} / {book['pubDate']}")
        print(f"     분류: {book['category'] or '(없음)'}")

        book["cover"] = resolve_cover(book, ttbkey)

        cat = input(f"  분류 [{book['category']}] (Enter=유지, 새로 입력 가능): ").strip()
        if cat:
            book["category"] = cat

        doc = {
            "isbn13": book["isbn13"] or isbn,
            "title": book["title"],
            "author": book["author"],
            "publisher": book["publisher"],
            "cover": book["cover"],
            "category": book["category"],
            "addedAt": datetime.now(timezone.utc).isoformat(),
        }
        db.collection(col).document(doc["isbn13"]).set(doc)
        print(f"  💾 저장 완료 → {col}/{doc['isbn13']}")

    print("\n👋 종료")


if __name__ == "__main__":
    main()
