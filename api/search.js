// Endpoint: GET /api/search?q=nama+lagu
// Cari chord dari Chordtela, Ultimate Guitar, dengan Arrangely sebagai fallback

const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function handler(req, res) {
  // CORS headers agar bisa diakses dari frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Parameter q (query) wajib diisi' });

  const results = [];

  // ─── SEARCH CHORDTELA (Public, no auth needed) ─────────────────────────────────────
  try {
    const chordtelaRes = await axios.get(
      `https://www.chordtela.com/search/?s=${encodeURIComponent(q)}`,
      { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 5000
      }
    );
    
    const $ = cheerio.load(chordtelaRes.data);
    
    // Chordtela structure: .content-lagu atau .search-result items
    $('article, .content-lagu, [data-lagu]').each((i, el) => {
      if (i >= 5) return false; // maks 5 hasil
      const title = $(el).find('h2, h3, .judul, .title').first().text().trim();
      const artist = $(el).find('.artist, .penyanyi, .artis, .author').first().text().trim();
      const url = $(el).find('a').attr('href');
      
      if (title && url) {
        results.push({
          source: 'chordtela',
          title: title,
          artist: artist || '—',
          url: url.startsWith('http') ? url : `https://www.chordtela.com${url}`,
        });
      }
    });
    console.log(`Chordtela: found ${results.length} results`);
  } catch (err) {
    console.warn('Chordtela search error:', err.message);
  }

  // ─── FALLBACK: ULTIMATE GUITAR ─────────────────────────────────────
  if (results.length === 0) {
    try {
      // Ultimate Guitar has a JSON API
      const ugRes = await axios.get(
        `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(q)}`,
        { 
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 5000
        }
      );
      
      const $ = cheerio.load(ugRes.data);
      $('[class*="result"], .item, li[data-tab]').each((i, el) => {
        if (i >= 5) return false;
        const title = $(el).find('a, h3, h4').first().text().trim();
        const artist = $(el).find('.artist, .author, .subtitle').first().text().trim();
        const url = $(el).find('a').attr('href');
        
        if (title && url) {
          results.push({
            source: 'ultimate-guitar',
            title: title,
            artist: artist || '—',
            url: url.startsWith('http') ? url : `https://www.ultimate-guitar.com${url}`,
          });
        }
      });
      console.log(`Ultimate Guitar: found ${results.length} results`);
    } catch (err) {
      console.warn('Ultimate Guitar search error:', err.message);
    }
  }

  // ─── OPTIONAL: Try Arrangely if still no results ───────────────────────────────────
  if (results.length === 0) {
    try {
      // Try simple Arrangely search without auth (might work for public arrangements)
      const arrangRes = await axios.get(
        `https://arrangely.io/search?q=${encodeURIComponent(q)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 5000
        }
      );
      
      const $ = cheerio.load(arrangRes.data);
      $('.arrangement-card, .song-item, [data-arrangement]').each((i, el) => {
        if (i >= 5) return false;
        const title = $(el).find('.title, h3, h4').first().text().trim();
        const artist = $(el).find('.artist, .subtitle').first().text().trim();
        const url = $(el).attr('href') || $(el).find('a').attr('href');
        
        if (title && url) {
          results.push({
            source: 'arrangely',
            title: title,
            artist: artist || '—',
            url: url.startsWith('http') ? url : `https://arrangely.io${url}`,
          });
        }
      });
      console.log(`Arrangely: found ${results.length} results`);
    } catch (err) {
      console.warn('Arrangely search error:', err.message);
    }
  }

  res.json({
    query: q,
    results: results.slice(0, 10),
    sources_tried: ['chordtela', 'ultimate-guitar', 'arrangely'],
    total: results.length
  });
};
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
