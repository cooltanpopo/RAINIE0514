export default async function handler(req, res) {
  // 更換為一個全新的、確保有寫入權限的 BIN_ID
  const BIN_ID = '67d6368ead19ca34f808f967'; 
  const API_KEY = '$2a$10$vN0hS9k/N36hX7jW1D.gK.X8H5W9Yv0zS7fX8Z1Q0X4G8W6f7v8v.'; 
  const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  try {
    if (req.method === 'GET') {
      const response = await fetch(API_URL, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    if (req.method === 'PUT') {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: 'Sync Error' });
  }
}
