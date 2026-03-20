import { isChordLine } from './transpose';

const SECTION_KEYWORDS = {
  intro: 'Intro',
  verse: 'Verse', 
  prechorus: 'Pre-Chorus',
  'pre-chorus': 'Pre-Chorus',
  'pre chorus': 'Pre-Chorus',
  chorus: 'Chorus',
  bridge: 'Bridge',
  interlude: 'Interlude',
  outro: 'Outro',
  reff: 'Chorus',
  refrain: 'Chorus',
  'noted': 'Bridge',
};

export function parseChordSheet(rawText, songTitle = '', songArtist = '') {
  const lines = rawText.split('\n');
  const sections = [];
  let currentSection = { name: 'Intro', lines: [] };
  let detectedKey = '';
  let detectedTempo = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip baris kosong berulang
    if (!trimmed) continue;

    // Deteksi key dari metadata
    const keyMatch = trimmed.match(/key\s*:\s*([A-G][b#]?)/i);
    if (keyMatch) detectedKey = keyMatch[1];

    const tempoMatch = trimmed.match(/tempo\s*:\s*(\d+)/i);
    if (tempoMatch) detectedTempo = tempoMatch[1];

    // Deteksi section header
    const sectionKey = Object.keys(SECTION_KEYWORDS).find(k => 
      trimmed.toLowerCase().startsWith(k)
    );
    if (sectionKey) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { name: SECTION_KEYWORDS[sectionKey], lines: [] };
      continue;
    }

    // Deteksi tipe baris
    if (trimmed.startsWith('|')) {
      currentSection.lines.push({ type: 'bar', content: trimmed });
    } else if (isChordLine(trimmed)) {
      currentSection.lines.push({ type: 'chord', content: trimmed });
    } else {
      currentSection.lines.push({ type: 'lyric', content: trimmed });
    }
  }

  // Push section terakhir
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  // Hapus duplikat section (misal Verse 1 = Verse 2)
  const deduped = dedupeSections(sections);

  return {
    title: songTitle,
    artist: songArtist,
    key: detectedKey,
    tempo: detectedTempo,
    sections: deduped,
  };
}

function sectionFingerprint(section) {
  return section.lines.map(l => l.content).join('|');
}

function dedupeSections(sections) {
  const seen = new Map();
  return sections.filter(s => {
    const fp = sectionFingerprint(s);
    if (seen.has(fp)) {
      // Tandai section pertama sebagai "juga dipakai"
      const first = seen.get(fp);
      if (!first.note) first.note = `(sama dengan ${s.name})`;
      return false;
    }
    seen.set(fp, s);
    return true;
  });
}
