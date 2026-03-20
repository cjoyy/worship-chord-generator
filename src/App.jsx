import { useState } from 'react';
import SongInput from './components/SongInput';
import SongCard from './components/SongCard';
import ExportButton from './components/ExportButton';
import { parseChordSheet } from './lib/parser';
import { generateExcel } from './lib/excelGenerator';
import './index.css';

export default function App() {
  const [songs, setSongs] = useState([]); // [{ query, results, selected, parsed }]
  const [loading, setLoading] = useState(false);

  async function handleSearch(songList) {
    setLoading(true);
    const newSongs = songList.map(q => ({ query: q, results: [], selected: null, parsed: null, youtubeUrl: null, status: 'loading' }));
    setSongs(newSongs);

    // Cari semua lagu paralel (chord + YouTube)
    await Promise.all(newSongs.map(async (song, i) => {
      try {
        // Cek cache dulu
        const cacheKey = `chord_cache_${song.query.toLowerCase().trim()}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const data = JSON.parse(cached);
          setSongs(prev => prev.map((s, idx) => idx === i 
            ? { ...s, results: data.results, parsed: data.parsed, youtubeUrl: data.youtubeUrl, status: data.parsed ? 'ready' : 'cached' }
            : s
          ));
          return;
        }

        // Fetch chord dan YouTube secara parallel
        const [chordRes, youtubeRes] = await Promise.all([
          fetch(`/api/search?q=${encodeURIComponent(song.query)}`),
          fetch(`/api/youtube-search?q=${encodeURIComponent(song.query)}`)
        ]);
        
        if (!chordRes.ok) {
          throw new Error(`Chord API error: ${chordRes.status} ${chordRes.statusText}`);
        }
        
        const chordData = await chordRes.json();
        let youtubeUrl = null;
        
        // Parse YouTube response (tidak gagal meski YouTube error)
        try {
          if (youtubeRes.ok) {
            const youtubeData = await youtubeRes.json();
            youtubeUrl = youtubeData.youtube_url;
          }
        } catch (e) {
          console.warn('YouTube fetch error:', e);
        }
        
        setSongs(prev => prev.map((s, idx) => idx === i 
          ? { ...s, results: chordData.results || [], youtubeUrl, status: chordData.results && chordData.results.length ? 'found' : 'not_found' }
          : s
        ));
      } catch (err) {
        setSongs(prev => prev.map((s, idx) => idx === i 
          ? { ...s, status: 'error', error: err.message }
          : s
        ));
      }
    }));

    setLoading(false);
  }

  async function handleSelectArrangement(songIdx, arrangement) {
    // Fetch konten chord dari URL yang dipilih
    setSongs(prev => prev.map((s, i) => i === songIdx ? { ...s, status: 'fetching' } : s));
    
    try {
      const res = await fetch(`/api/fetch-chord?url=${encodeURIComponent(arrangement.url)}&source=${arrangement.source}`);
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      const parsed = parseChordSheet(data.rawText, songs[songIdx].query, arrangement.artist);
      
      // Simpan ke cache (termasuk YouTube URL)
      const cacheKey = `chord_cache_${songs[songIdx].query.toLowerCase().trim()}`;
      localStorage.setItem(cacheKey, JSON.stringify({ 
        results: songs[songIdx].results, 
        parsed,
        youtubeUrl: songs[songIdx].youtubeUrl
      }));

      setSongs(prev => prev.map((s, i) => i === songIdx 
        ? { ...s, selected: arrangement, parsed, status: 'ready' }
        : s
      ));
    } catch (err) {
      setSongs(prev => prev.map((s, i) => i === songIdx 
        ? { ...s, status: 'error', error: err.message }
        : s
      ));
    }
  }

  const readySongs = songs.filter(s => s.parsed);

  return (
    <div className="app">
      <header className="app-header">
        <h1>⛪ Worship Chord Generator</h1>
        <p>Cari · Pilih · Export Excel</p>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <SongInput onSearch={handleSearch} loading={loading} />
          <ExportButton 
            songs={readySongs}
            disabled={readySongs.length === 0}
            onExport={() => generateExcel(readySongs)}
          />
        </aside>
        <main className="results">
          {songs.map((song, i) => (
            <SongCard
              key={i}
              song={song}
              onSelect={(arr) => handleSelectArrangement(i, arr)}
              onClearCache={() => {
                localStorage.removeItem(`chord_cache_${song.query.toLowerCase().trim()}`);
                setSongs(prev => prev.map((s, idx) => idx === i ? { ...s, parsed: null, status: 'found' } : s));
              }}
            />
          ))}
          {songs.length === 0 && (
            <div className="empty-state">
              <p>Masukkan daftar lagu di panel kiri, lalu klik "Cari Semua Lagu"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
