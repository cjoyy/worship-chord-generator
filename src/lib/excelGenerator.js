// Generate file Excel dengan dark theme menggunakan ExcelJS
// Import ExcelJS via CDN di index.html, tersedia sebagai window.ExcelJS

const COLORS = {
  bg:        '1A1A2E',
  header:    '16213E',
  intro:     '0F3460',
  verse:     '1B5E20',
  prechorus: '0D7377',
  chorus:    '14A085',
  bridge:    '4A1942',
  interlude: '1B4F72',
  outro:     '0F3460',
  chord:     '533483',
  chordText: 'FFD700',
  lyricText: 'FFFFFF',
  barText:   '00E5FF',
  titleText: 'FFD700',
  metaText:  '00E5FF',
};

const SECTION_COLORS = {
  'Intro':      COLORS.intro,
  'Verse':      COLORS.verse,
  'Pre-Chorus': COLORS.prechorus,
  'Chorus':     COLORS.chorus,
  'Bridge':     COLORS.bridge,
  'Interlude':  COLORS.interlude,
  'Outro':      COLORS.outro,
};

function getSectionColor(sectionName) {
  const key = Object.keys(SECTION_COLORS).find(k => 
    sectionName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? SECTION_COLORS[key] : COLORS.intro;
}

export async function generateExcel(songs) {
  const ExcelJS = window.ExcelJS;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Worship Chord Generator';

  for (const song of songs) {
    // Nama sheet: max 31 karakter (batasan Excel)
    const sheetName = (song.parsed.title || song.query).slice(0, 31);
    const ws = workbook.addWorksheet(sheetName, {
      properties: { tabColor: { argb: 'FFE94560' } }
    });

    ws.getColumn('A').width = 18;
    ws.getColumn('B').width = 60;

    let row = 1;

    // ── JUDUL ─────────────────────────────────────────
    const titleRow = ws.getRow(row);
    ws.mergeCells(`A${row}:B${row}`);
    titleRow.getCell(1).value = song.parsed.title || song.query;
    titleRow.getCell(1).font = { name: 'Consolas', bold: true, color: { argb: 'FF' + COLORS.titleText }, size: 18 };
    titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.header } };
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 36;
    row++;

    // ── META ──────────────────────────────────────────
    const metaRow = ws.getRow(row);
    ws.mergeCells(`A${row}:B${row}`);
    const key = song.parsed.key || '-';
    const tempo = song.parsed.tempo ? `${song.parsed.tempo} BPM` : '-';
    metaRow.getCell(1).value = `${song.parsed.artist || ''}  |  Key: ${key}  •  Tempo: ${tempo}  •  4/4`;
    metaRow.getCell(1).font = { name: 'Consolas', color: { argb: 'FF' + COLORS.metaText }, size: 10 };
    metaRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.header } };
    metaRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    metaRow.height = 20;
    row++;

    // spacer
    ws.getRow(row).height = 8;
    ws.getRow(row).getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.bg } };
    row++;

    // ── SECTIONS ──────────────────────────────────────
    for (const section of song.parsed.sections) {
      const sectionColor = getSectionColor(section.name);
      const label = section.note 
        ? `  ▌ ${section.name}  ${section.note}`
        : `  ▌ ${section.name}`;

      // Label section
      const secRow = ws.getRow(row);
      ws.mergeCells(`A${row}:B${row}`);
      secRow.getCell(1).value = label;
      secRow.getCell(1).font = { name: 'Consolas', bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
      secRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + sectionColor } };
      secRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      secRow.height = 20;
      row++;

      // Baris-baris dalam section
      for (const line of section.lines) {
        const lineRow = ws.getRow(row);

        if (line.type === 'bar') {
          ws.mergeCells(`A${row}:B${row}`);
          lineRow.getCell(1).value = `  ${line.content}`;
          lineRow.getCell(1).font = { name: 'Consolas', bold: true, color: { argb: 'FF' + COLORS.barText }, size: 11 };
          lineRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.intro } };
        } else if (line.type === 'chord') {
          lineRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.bg } };
          lineRow.getCell(2).value = line.content;
          lineRow.getCell(2).font = { name: 'Consolas', bold: true, color: { argb: 'FF' + COLORS.chordText }, size: 11 };
          lineRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.chord } };
        } else {
          lineRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.bg } };
          lineRow.getCell(2).value = line.content;
          lineRow.getCell(2).font = { name: 'Consolas', color: { argb: 'FF' + COLORS.lyricText }, size: 11 };
          lineRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.bg } };
        }

        lineRow.alignment = { horizontal: 'left', vertical: 'middle' };
        lineRow.height = 20;
        row++;
      }

      // Spacer antar section
      ws.getRow(row).height = 6;
      row++;
    }

    ws.views = [{ state: 'frozen', ySplit: 3 }];
  }

  // Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const today = new Date().toISOString().slice(0, 10);
  a.download = `chord-sheet-${today}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
