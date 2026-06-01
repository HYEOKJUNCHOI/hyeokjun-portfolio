// AI 프록시 — OpenAI 키를 서버 env에만 두고 클라이언트 요청을 중계
// 환경변수: OPENAI_API_KEY (VITE_ 없이 — 번들에 노출 안 됨)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'no_key', message: 'AI 기능이 설정되지 않았습니다.' });

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'proxy_error', message: String(e.message || e) });
  }
}
