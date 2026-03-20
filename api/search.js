// Endpoint: GET /api/search?q=nama+lagu
// Cari chord dari sumber publik (tanpa auth, dengan error handling yang robust)

import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

const API_TIMEOUT = 8000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const results = [];
  const query = encodeURIComponent(q.trim());

  console.log(`[search] Query: ${q}`);

  // ─── SEARCH CHORDTELA ─────────────────────────────────────
  try {
    console.log('[search] Trying Chordtela...');
    const response = await axios.get(
      `https://www.chordtela.com/search/?s=${query}`,
      { 
        headers: { 'User-Agent': USER_AGENT },
        timeout: API_TIMEOUT,
        validateStatus: () => true // Accept all status codes
      }
    );

    if (response.status === 200) {
      const $ = cheerioLoad(response.data);
      
      // Try different selectors
      $('a[href*="/chord/"]').each((i, el) => {
        if (results.length >= 5) return false;
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        
        if (title && href && title.length > 2) {
          results.push({
            source: 'chordtela',
            title: title,
            artist: '—',
            url: href.startsWith('http') ? href : `https://www.chordtela.com${href}`,
          });
        }
      });
      
      console.log(`[search] Chordtela: found ${results.length} results`);
    } else {
      console.log(`[search] Chordtela returned status ${response.status}`);
    }
  } catch (err) {
    console.warn(`[search] Chordtela error: ${err.message}`);
  }

  // ─── FALLBACK: ULTIMATE GUITAR ─────────────────────────────────────
  if (results.length === 0) {
    try {
      console.log('[search] Trying Ultimate Guitar...');
      const response = await axios.get(
        `https://www.ultimate-guitar.com/search.php?search_type=title&value=${query}`,
        { 
          headers: { 'User-Agent': USER_AGENT },
          timeout: API_TIMEOUT,
          validateStatus: () => true
        }
      );

      if (response.status === 200) {
        const $ = cheerioLoad(response.data);
        
        $('a[href*="/tab/"]').each((i, el) => {
          if (results.length >= 5) return false;
          const title = $(el).attr('title') || $(el).text().trim();
          const href = $(el).attr('href');
          
          if (title && href && title.length > 2) {
            results.push({
              source: 'ultimate-guitar',
              title: title,
              artist: '—',
              url: href.startsWith('http') ? href : `https://www.ultimate-guitar.com${href}`,
            });
          }
        });
        
        console.log(`[search] Ultimate Guitar: found ${results.length} results`);
      } else {
        console.log(`[search] Ultimate Guitar returned status ${response.status}`);
      }
    } catch (err) {
      console.warn(`[search] Ultimate Guitar error: ${err.message}`);
    }
  }

  // ─── DEFAULT RESPONSE ───────────────────────────────────────
  res.json({
    query: q,
    results: results.slice(0, 10),
    total: results.length,
    message: results.length === 0 ? 'No results found. Try searching on chordtela.com or ultimate-guitar.com directly.' : 'Success'
  });
};
