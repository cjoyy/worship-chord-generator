// Client-side localStorage cache helper

const CACHE_PREFIX = 'chord_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 hari

export function getCachedChord(songQuery) {
  const key = CACHE_PREFIX + songQuery.toLowerCase().trim();
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const data = JSON.parse(cached);
    // Cek apakah cache expired
    if (data.expiry && Date.now() > data.expiry) {
      clearCachedChord(songQuery);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheChord(songQuery, results, parsed = null) {
  const key = CACHE_PREFIX + songQuery.toLowerCase().trim();
  const data = {
    results,
    parsed,
    expiry: Date.now() + CACHE_EXPIRY,
    cachedAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearCachedChord(songQuery) {
  const key = CACHE_PREFIX + songQuery.toLowerCase().trim();
  localStorage.removeItem(key);
}

export function clearAllCache() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}
