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
    const newSongs = songList.map(q => ({ query: q, results: [], selected: null, parsed: null, status: 'loading' }));
    setSongs(newSongs);

    // Cari semua lagu paralel
    await Promise.all(newSongs.map(async (song, i) => {
      try {
        // Cek cache dulu
        const cacheKey = `chord_cache_${song.query.toLowerCase().trim()}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const data = JSON.parse(cached);
          setSongs(prev => prev.map((s, idx) => idx === i 
            ? { ...s, results: data.results, parsed: data.parsed, status: data.parsed ? 'ready' : 'cached' }
            : s
          ));
          return;
        }

        const res = await fetch(`/api/search?q=${encodeURIComponent(song.query)}`);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        setSongs(prev => prev.map((s, idx) => idx === i 
          ? { ...s, results: data.results || [], status: data.results && data.results.length ? 'found' : 'not_found' }
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
      
      // Simpan ke cache
      const cacheKey = `chord_cache_${songs[songIdx].query.toLowerCase().trim()}`;
      localStorage.setItem(cacheKey, JSON.stringify({ results: songs[songIdx].results, parsed }));

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
