// 알라딘 ISBN 조회 (쓰기 없음, PIN 불필요 — 책 메타는 공개 정보).
// 표지는 항상 cover500(고화질), 분류는 leaf 한 단계만 반환.
// 환경변수: ALADIN_TTB_KEY

function stripJsonp(raw) {
  const s = String(raw).trim();
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  return a >= 0 && b > a ? s.slice(a, b + 1) : s;
}

function upgradeCover(url) {
  if (!url) return '';
  return String(url).replace(/\/cover(?:sum|\d+)?\//, '/cover500/');
}

function normalize(item, isbn) {
  const cat = String(item.categoryName || '').split('>');
  return {
    isbn13: String(item.isbn13 || isbn),
    title: String(item.title || '').replace(/\s*-\s*.*$/, '').trim(),
    author: String(item.author || '').trim(),
    publisher: String(item.publisher || '').trim(),
    cover: upgradeCover(item.cover),
    pubDate: String(item.pubDate || ''),
    category: cat.length ? cat[cat.length - 1].trim() : '',
  };
}

export default async function handler(req, res) {
  const isbn = String(req.query.isbn || '').replace(/\D/g, '');
  if (isbn.length !== 13) {
    return res.status(400).json({ error: 'isbn13_required' });
  }
  const key = process.env.ALADIN_TTB_KEY;
  if (!key) return res.status(500).json({ error: 'no_aladin_key' });

  const url =
    'https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx' +
    `?ttbkey=${encodeURIComponent(key)}&itemIdType=ISBN13&ItemId=${isbn}` +
    '&output=js&Version=20131101&Cover=Big';

  try {
    const r = await fetch(url, { cache: 'no-store' });
    const data = JSON.parse(stripJsonp(await r.text()));
    const item = (data.item || [])[0];
    if (!item) return res.status(404).json({ error: 'not_found' });
    return res.status(200).json(normalize(item, isbn));
  } catch (e) {
    return res.status(502).json({ error: 'lookup_failed', detail: String(e.message || e) });
  }
}
