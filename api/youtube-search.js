// Endpoint: GET /api/youtube-search?q=song+name
// Cari YouTube link untuk lagu tertentu

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

  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    console.log(`[youtube] Searching for: ${q}`);
    
    // YouTube search (using query string in URL)
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    
    const response = await axios.get(searchUrl, {
      headers: { 
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      console.warn(`[youtube] YouTube returned status ${response.status}`);
      return res.json({
        query: q,
        youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        method: 'search_url',
        message: 'Direct YouTube search URL'
      });
    }

    // Try to extract featured video from HTML
    const html = response.data;
    
    // Look for video IDs in the page
    const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      console.log(`[youtube] Found video: ${videoId}`);
      return res.json({
        query: q,
        youtube_url: videoUrl,
        video_id: videoId,
        method: 'direct_video',
        message: 'Direct YouTube video link'
      });
    }

    // Fallback: return YouTube search URL
    console.log(`[youtube] No direct video found, returning search URL`);
    res.json({
      query: q,
      youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
      method: 'search_url',
      message: 'YouTube search results page'
    });

  } catch (err) {
    console.error(`[youtube] Error:`, err.message);
    
    // Always return a YouTube search URL as fallback
    res.json({
      query: q,
      youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
      method: 'fallback',
      message: 'Fallback YouTube search URL'
    });
  }
}
