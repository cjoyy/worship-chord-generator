const NOTES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

export default function TransposeControl({ currentKey, onKeyChange, originalKey }) {
  return (
    <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <label style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
        🎵 Key:
      </label>
      <select value={currentKey} onChange={(e) => onKeyChange(e.target.value)}>
        {NOTES_SHARP.map((note) => (
          <option key={note} value={note}>
            {note} {note === originalKey ? '(orig)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
