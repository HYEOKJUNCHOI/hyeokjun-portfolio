# 책장 관리 도구 (로컬)

컴퓨터 카메라로 ISBN 스캔 → 알라딘 조회 → 표지 확정/교체 → Firestore `shelf` 저장.
포트폴리오 Library 가 이 `shelf` 컬렉션을 읽어 책장에 보여줍니다. (읽기 연동은 별도)

## 1회 셋업

```bash
cd tools/book-admin
python -m venv .venv && .venv\Scripts\activate   # (선택) 가상환경
pip install -r requirements.txt
```

### 자격증명 2개 (git 에 안 올라감)
1. **serviceAccount.json**
   Firebase 콘솔 → ⚙ 프로젝트 설정 → **서비스 계정** → **새 비공개 키 생성** → 받은 JSON 을
   이 폴더에 `serviceAccount.json` 으로 저장.
2. **config.json**
   `config.example.json` 을 `config.json` 으로 복사 → `aladin_ttb_key` 채우기.
   (알라딘 TTBKey: https://www.aladin.co.kr/ttb/wblog_manage.aspx 에서 발급)

## 실행

```bash
python scan_book.py
```

- `c` 카메라 스캔 / `m` ISBN 직접입력 / `q` 종료
- 표지: Enter=확정 / `s`=다른 판본에서 고르기 / `u`=URL 직접 붙여넣기 (옛 판본 표지 교체용)
- 표지는 자동으로 알라딘 `cover500`(고화질)로 저장됨

## 동작
- `firebase-admin` = 서버 권한이라 Firestore 규칙(`write:false`)을 우회해 직접 씀.
- 문서 ID = ISBN13 (같은 책 다시 스캔하면 덮어쓰기).
