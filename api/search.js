// Endpoint: GET /api/search?q=nama+lagu
// Cari chord dari Chordtela, Ultimate Guitar (public sources tanpa auth)

import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Parameter q (query) wajib diisi' });
  }

  const results = [];

  // ─── SEARCH CHORDTELA ─────────────────────────────────────
  try {
    const chordtelaRes = await axios.get(
      `https://www.chordtela.com/search/?s=${encodeURIComponent(q)}`,
      { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 5000
      }
    );
    
    const $ = cheerioLoad(chordtelaRes.data);
    
    // Chordtela: look for song links
    $('a[href*="/chord/"]').each((i, el) => {
      if (results.length >= 5) return false;
      const title = $(el).text().trim();
      const href = $(el).attr('href');
      
      if (title && href) {
        results.push({
          source: 'chordtela',
          title: title,
          artist: '—',
          url: href.startsWith('http') ? href : `https://www.chordtela.com${href}`,
        });
      }
    });
    
    console.log(`[search] Chordtela: found ${results.length} results`);
  } catch (err) {
    console.warn('[search] Chordtela error:', err.message);
  }

  // ─── FALLBACK: ULTIMATE GUITAR ─────────────────────────────────────
  if (results.length === 0) {
    try {
      const ugRes = await axios.get(
        `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(q)}`,
        { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 5000
        }
      );
      
      const $ = cheerioLoad(ugRes.data);
      
      // Ultimate Guitar: look for tab links
      $('a[href*="/tab/"]').each((i, el) => {
        if (results.length >= 5) return false;
        const title = $(el).attr('title') || $(el).text().trim();
        const href = $(el).attr('href');
        
        if (title && href) {
          results.push({
            source: 'ultimate-guitar',
            title: title,
            artist: '—',
            url: href.startsWith('http') ? href : `https://www.ultimate-guitar.com${href}`,
          });
        }
      });
      
      console.log(`[search] Ultimate Guitar: found ${results.length} results`);
    } catch (err) {
      console.warn('[search] Ultimate Guitar error:', err.message);
    }
  }

  // ─── RESPONSE ───────────────────────────────────────
  res.json({
    query: q,
    results: results.slice(0, 10),
    total: results.length
  });
};
