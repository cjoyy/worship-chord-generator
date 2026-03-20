export default function ExportButton({ songs, disabled, onExport }) {
  return (
    <div className="export-section">
      <label style={{ fontSize: '12px', marginBottom: '6px' }}>
        📊 Export ({songs.length} lagu siap)
      </label>
      <button
        className="btn btn-export"
        disabled={disabled}
        onClick={onExport}
      >
        ⬇️ Export ke Excel
      </button>
    </div>
  );
}
