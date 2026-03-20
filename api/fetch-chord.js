// Endpoint: GET /api/fetch-chord?url=https://...
// Fetch & parse konten chord dari URL yang dipilih user

const axios = require('axios');
const cheerio = require('cheerio');
const { getArrangelySession } = require('./_arrangely-session');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { url, source } = req.query;
  if (!url) return res.status(400).json({ error: 'Parameter url wajib diisi' });

  try {
    let headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
    
    // Kalau dari Arrangely, pakai session cookie
    if (source === 'arrangely') {
      const session = await getArrangelySession();
      headers['Cookie'] = session;
    }

    const pageRes = await axios.get(url, { headers });
    const $ = cheerio.load(pageRes.data);

    let rawText = '';

    // Arrangely biasanya punya element khusus untuk chord sheet
    // Inspect HTML arrangely.io untuk tahu selector yang tepat
    if (source === 'arrangely') {
      rawText = $('.chord-sheet, .arrangement-content, pre, [data-chord-sheet]').first().text();
    } else if (source === 'chordtela') {
      rawText = $('.chord-area, .kord, pre').first().text();
    } else {
      rawText = $('pre, .js-tab-content, [data-content="tab"]').first().text();
    }

    // Fallback: ambil semua text dari <pre>
    if (!rawText) rawText = $('pre').first().text();

    res.json({ url, rawText: rawText.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
