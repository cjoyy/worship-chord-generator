const NOTES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

// Daftar semua chord valid (root notes)
const CHORD_REGEX = /^([A-G][b#]?)(m|maj|min|dim|aug|sus|add|M)?(\d+)?(\/[A-G][b#]?)?$/;

export function transposeChord(chord, semitones) {
  const match = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return chord;

  const [, root, suffix] = match;
  
  // Cari index root di array
  let noteArr = NOTES_SHARP;
  let idx = NOTES_SHARP.indexOf(root);
  if (idx === -1) {
    idx = NOTES_FLAT.indexOf(root);
    noteArr = NOTES_FLAT;
  }
  if (idx === -1) return chord;

  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  const newRoot = noteArr[newIdx];

  // Handle slash chord (C/E → transpose bass juga)
  const slashMatch = suffix.match(/^(.*)(\/[A-G][b#]?)$/);
  if (slashMatch) {
    const [, chordSuffix, bass] = slashMatch;
    const bassNote = bass.slice(1);
    const bassIdx = NOTES_SHARP.indexOf(bassNote) !== -1 
      ? NOTES_SHARP.indexOf(bassNote) 
      : NOTES_FLAT.indexOf(bassNote);
    const newBassIdx = ((bassIdx + semitones) % 12 + 12) % 12;
    const newBass = noteArr[newBassIdx];
    return newRoot + chordSuffix + '/' + newBass;
  }

  return newRoot + suffix;
}

export function getSemitones(fromKey, toKey) {
  const fromIdx = NOTES_SHARP.indexOf(fromKey) !== -1 
    ? NOTES_SHARP.indexOf(fromKey) 
    : NOTES_FLAT.indexOf(fromKey);
  const toIdx = NOTES_SHARP.indexOf(toKey) !== -1 
    ? NOTES_SHARP.indexOf(toKey) 
    : NOTES_FLAT.indexOf(toKey);
  return ((toIdx - fromIdx) % 12 + 12) % 12;
}

export function transposeLine(line, semitones) {
  // Transpose semua chord dalam satu baris
  return line.replace(/([A-G][b#]?(?:m|maj|min|dim|aug|sus2|sus4|add\d|M)?(?:\d+)?(?:\/[A-G][b#]?)?)/g, 
    (match) => transposeChord(match, semitones)
  );
}

export function isChordLine(line) {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  const chordTokens = tokens.filter(t => /^[A-G][b#]?/.test(t));
  return chordTokens.length / tokens.length > 0.6;
}
