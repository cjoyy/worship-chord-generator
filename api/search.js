// Endpoint: GET /api/search?q=nama+lagu
// Cari chord dari Arrangely dulu, fallback ke Chordtela

const axios = require('axios');
const cheerio = require('cheerio');
const { getArrangelySession } = require('./_arrangely-session');

module.exports = async function handler(req, res) {
  // CORS headers agar bisa diakses dari frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Parameter q (query) wajib diisi' });

  const results = [];

  // ─── CARI DI ARRANGELY ───────────────────────────────────────
  try {
    const session = await getArrangelySession();
    const searchRes = await axios.get(`https://arrangely.io/search?q=${encodeURIComponent(q)}`, {
      headers: {
        'Cookie': session,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(searchRes.data);
    
    // Sesuaikan selector ini dengan struktur HTML Arrangely sebenarnya
    // Inspect element di arrangely.io/search untuk tahu class yang benar
    $('.arrangement-card, .song-item, [data-arrangement]').each((i, el) => {
      if (i >= 5) return false; // maks 5 hasil
      results.push({
        source: 'arrangely',
        title: $(el).find('.title, h3, h4').first().text().trim(),
        artist: $(el).find('.artist, .subtitle').first().text().trim(),
        key: $(el).find('.key, [data-key]').first().text().trim(),
        tempo: $(el).find('.tempo, [data-tempo]').first().text().trim(),
        url: 'https://arrangely.io' + ($(el).find('a').attr('href') || $(el).attr('href') || ''),
        arranger: $(el).find('.arranger, .author').first().text().trim(),
      });
    });
  } catch (err) {
    console.warn('Arrangely search gagal:', err.message);
    // Lanjut ke fallback, jangan crash
  }

  // ─── FALLBACK: CHORDTELA ─────────────────────────────────────
  if (results.length === 0) {
    try {
      const chordtelaRes = await axios.get(
        `https://www.chordtela.com/search/?s=${encodeURIComponent(q)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const $ = cheerio.load(chordtelaRes.data);
      
      $('.entry-title a, .post-title a, h2 a').each((i, el) => {
        if (i >= 5) return false;
        results.push({
          source: 'chordtela',
          title: $(el).text().trim(),
          artist: '',
          key: '',
          tempo: '',
          url: $(el).attr('href'),
          arranger: 'Chordtela',
        });
      });
    } catch (err) {
      console.warn('Chordtela search gagal:', err.message);
    }
  }

  // ─── FALLBACK: ULTIMATE GUITAR ───────────────────────────────
  if (results.length === 0) {
    try {
      const ugRes = await axios.get(
        `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(q)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const $ = cheerio.load(ugRes.data);
      
      $('[data-content]').each((i, el) => {
        if (i >= 5) return false;
        try {
          const data = JSON.parse($(el).attr('data-content'));
          const tabs = data?.store?.page?.data?.results || [];
          tabs.filter(t => t.type === 'Chords').slice(0, 5).forEach(t => {
            results.push({
              source: 'ultimate-guitar',
              title: t.song_name,
              artist: t.artist_name,
              key: t.tonality_name || '',
              tempo: '',
              url: t.tab_url,
              arranger: t.username,
            });
          });
        } catch {}
      });
    } catch (err) {
      console.warn('Ultimate Guitar search gagal:', err.message);
    }
  }

  res.json({ query: q, results });
};
