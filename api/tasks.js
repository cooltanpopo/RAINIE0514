// Vercel 後台代理 - 轉接到已驗證可用的 jsonblob.com 儲存空間
const BLOB_ID = '019e297d-75a3-7e92-bd6b-d4033615ae71';
const API_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    if (req.method === 'GET') {
      const r = await fetch(API_URL, {
        headers: { 'Accept': 'application/json' }
      });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(r.status).json({ error: errText });
      }
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const r = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(r.status).json({ error: errText });
      }
      const data = await r.json();
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
