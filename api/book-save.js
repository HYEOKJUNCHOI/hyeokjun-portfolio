// 책 저장 — PIN 서버 검증 후 Firestore 'shelf' 에 기록.
// firebase-admin = 서버 권한이라 규칙(write:false) 우회.
// 환경변수: FIREBASE_SERVICE_ACCOUNT(JSON 통째), BOOK_PIN
import admin from 'firebase-admin';

function getDb() {
  if (!admin.apps.length) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  }
  return admin.firestore();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const body = req.body || {};
  if (String(body.pin || '') !== String(process.env.BOOK_PIN || '6266')) {
    return res.status(401).json({ error: 'bad_pin' });
  }

  const isbn = String(body.isbn || '').replace(/\D/g, '');
  if (body.action === 'delete') {
    if (isbn.length !== 13) {
      return res.status(400).json({ error: 'invalid_input' });
    }

    try {
      await getDb().collection('shelf').doc(isbn).delete();
      return res.status(200).json({ ok: true, deleted: isbn });
    } catch (e) {
      return res.status(500).json({ error: 'delete_failed', detail: String(e.message || e) });
    }
  }

  const title = String(body.title || '').trim();
  if (isbn.length !== 13 || !title) {
    return res.status(400).json({ error: 'invalid_input' });
  }

  const doc = {
    isbn13: isbn,
    title,
    author: String(body.author || '').trim(),
    publisher: String(body.publisher || '').trim(),
    cover: String(body.cover || '').trim(),
    category: String(body.category || '').trim(),
    addedAt: new Date().toISOString(),
  };

  try {
    await getDb().collection('shelf').doc(isbn).set(doc);
    return res.status(200).json({ ok: true, book: doc });
  } catch (e) {
    return res.status(500).json({ error: 'save_failed', detail: String(e.message || e) });
  }
}
