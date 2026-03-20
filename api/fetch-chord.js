// Endpoint: GET /api/fetch-chord?url=https://...
// Fetch & parse chord content dari URL tanpa auth requirement

import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, source } = req.query;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Valid "url" parameter is required' });
  }

  try {
    console.log(`[fetch-chord] Fetching: ${url} (source: ${source})`);

    const pageRes = await axios.get(url, { 
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
      validateStatus: (status) => status < 500 // Don't throw on 4xx
    });

    if (pageRes.status !== 200) {
      return res.status(pageRes.status).json({ 
        error: `Failed to fetch URL (status: ${pageRes.status})`,
        url: url
      });
    }

    const $ = cheerioLoad(pageRes.data);
    let rawText = '';

    // Try source-specific selectors first
    if (source === 'chordtela') {
      rawText = $('.chord-area, .kord, pre, code').first().text();
    } else if (source === 'ultimate-guitar') {
      rawText = $('pre, .js-tab-content, [data-content="tab"], .t_b').first().text();
    }

    // Fallback: try common chord sheet selectors
    if (!rawText) {
      rawText = $('pre, code, .chord-sheet, .arrangement-content, [data-chord-sheet]').first().text();
    }

    // Last resort: get all text from main content areas
    if (!rawText) {
      const main = $('main, article, .content, body').first().text();
      rawText = main.length > 50 ? main : '';
    }

    if (!rawText || rawText.trim().length < 20) {
      return res.status(200).json({ 
        url: url, 
        rawText: '',
        message: 'No chord content found on this page. Try copying the text directly.'
      });
    }

    res.json({ 
      url: url, 
      rawText: rawText.trim(),
      length: rawText.length
    });

  } catch (err) {
    console.error(`[fetch-chord] Error fetching ${url}:`, err.message);
    res.status(500).json({ 
      error: 'Failed to fetch URL',
      details: err.message,
      url: url
    });
  }
};
