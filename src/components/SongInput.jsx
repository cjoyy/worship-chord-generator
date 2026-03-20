import { useState } from 'react';

export default function SongInput({ onSearch, loading }) {
  const [songList, setSongList] = useState('');

  const handleSearch = () => {
    const songs = songList
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    if (songs.length === 0) {
      alert('Masukkan minimal satu nama lagu');
      return;
    }

    onSearch(songs);
  };

  return (
    <div className="song-input">
      <label htmlFor="songlist">📝 Daftar Lagu</label>
      <textarea
        id="songlist"
        placeholder="Masukkan nama lagu, satu baris per lagu:&#10;&#10;Hallelujah&#10;Amazing Grace&#10;Blessed Assurance"
        value={songList}
        onChange={(e) => setSongList(e.target.value)}
        rows={8}
        disabled={loading}
      />
      <button
        className="btn btn-primary"
        onClick={handleSearch}
        disabled={loading || songList.trim().length === 0}
      >
        {loading ? '🔄 Mencari...' : '🔍 Cari Semua Lagu'}
      </button>
    </div>
  );
}
