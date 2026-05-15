export default async function handler(req, res) {
  const API_URL = 'https://api.restful-api.dev/objects/ff8081819d82fab6019e255b355d3981';

  // 加上這三行，強制要求 Vercel 每次都要抓取最新資料，絕對不准快取
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    if (req.method === 'GET') {
      // 告訴 fetch 也不准用快取
      const response = await fetch(API_URL, { cache: 'no-store' });
      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    if (req.method === 'PUT' || req.method === 'POST') {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        cache: 'no-store'
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
