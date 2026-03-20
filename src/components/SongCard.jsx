import { useState } from 'react';
import ChordPreview from './ChordPreview';

export default function SongCard({ song, onSelect, onClearCache }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      loading: '🔄',
      found: '✅',
      fetching: '⬇️',
      ready: '✨',
      error: '❌',
      cached: '💾',
      not_found: '❓',
    };
    return colors[status] || '❓';
  };

  const getSourceBadgeClass = (source) => {
    const classes = {
      arrangely: 'badge badge-arrangely',
      chordtela: 'badge badge-chordtela',
      'ultimate-guitar': 'badge badge-ug',
    };
    return classes[source] || 'badge';
  };

  return (
    <div className="song-card">
      <div
        className="song-card-header"
        onClick={() => !song.parsed && setExpanded(!expanded)}
      >
        <div>
          <strong>{song.query}</strong>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            {getStatusColor(song.status)} {song.status}
          </div>
        </div>
        {song.error && <span style={{ color: 'var(--accent2)' }}>⚠️ {song.error}</span>}
      </div>

      {song.parsed && <ChordPreview song={song} />}

      {expanded && !song.parsed && song.results.length > 0 && (
        <div className="song-card-body">
          <div className="arrangement-list">
            {song.results.map((arr, i) => (
              <div key={i} className="arrangement-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                    {arr.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {arr.artist && <span>{arr.artist}</span>}
                    {arr.key && <span> • {arr.key}</span>}
                    {arr.tempo && <span> • {arr.tempo}</span>}
                  </div>
                  <span className={getSourceBadgeClass(arr.source)}>
                    {arr.source.toUpperCase()}
                  </span>
                </div>
                <button
                  className="btn btn-select"
                  onClick={() => onSelect(arr)}
                >
                  Pilih
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {expanded && !song.parsed && song.results.length === 0 && (
        <div className="song-card-body">
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
            Tidak ditemukan arrangement untuk lagu ini
          </p>
        </div>
      )}

      {song.parsed && (
        <div className="song-card-body" style={{ textAlign: 'center', paddingBottom: '12px' }}>
          <button
            className="btn btn-sm"
            onClick={onClearCache}
            style={{ marginBottom: '0' }}
          >
            🔄 Ganti Arrangement
          </button>
        </div>
      )}
    </div>
  );
}
