// PIN 서버 검증 — 클라이언트에 PIN 안 박고, 게이트 통과만 알려줌.
// 환경변수: BOOK_PIN
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const pin = String((req.body || {}).pin || '');
  const real = String(process.env.BOOK_PIN || '');
  if (real && pin === real) return res.status(200).json({ ok: true });
  return res.status(401).json({ error: 'bad_pin' });
}
