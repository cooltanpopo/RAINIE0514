export default async function handler(req, res) {
  const API_URL = 'https://api.restful-api.dev/objects/ff8081819d82fab6019e255b355d3981';

  try {
    if (req.method === 'GET') {
      const response = await fetch(API_URL);
      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    if (req.method === 'PUT' || req.method === 'POST') {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
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
