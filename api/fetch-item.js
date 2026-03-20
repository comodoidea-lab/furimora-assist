export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url parameter required' });
  
  try {
    const mercariMatch = url.match(/https?:\/\/(jp\.)?mercari\.com\/item\/(m[^/?#\s]+)/);
    if (!mercariMatch) return res.status(400).json({ error: 'Invalid Mercari URL' });
    const itemId = mercariMatch[2];
    
    const response = await fetch(`https://jp.mercari.com/item/${itemId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)' }
    });
    const html = await response.text();
    
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ldMatch) {
      try {
        const ld = JSON.parse(ldMatch[1]);
        return res.json({
          name: ld.name || '',
          price: ld.offers?.price || '',
          image: Array.isArray(ld.image) ? ld.image[0] : (ld.image || ''),
          url: `https://jp.mercari.com/item/${itemId}`,
          itemId
        });
      } catch(e) {}
    }
    
    return res.status(500).json({ error: 'Could not parse item' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}