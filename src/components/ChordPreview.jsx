import { useState } from 'react';
import { getSemitones, transposeLine, transposeChord } from '../lib/transpose';
import TransposeControl from './TransposeControl';

const NOTES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

export default function ChordPreview({ song }) {
  const [transposeAmount, setTransposeAmount] = useState(0);
  const [selectedKey, setSelectedKey] = useState(song.parsed.key || 'C');

  const handleKeyChange = (newKey) => {
    setSelectedKey(newKey);
    const original = song.parsed.key || 'C';
    const semitones = getSemitones(original, newKey);
    setTransposeAmount(semitones);
  };

  const getSectionColor = (sectionName) => {
    const colors = {
      intro: '#0F3460',
      verse: '#1B5E20',
      'pre-chorus': '#0D7377',
      chorus: '#14A085',
      bridge: '#4A1942',
      interlude: '#1B4F72',
      outro: '#0F3460',
    };
    const key = Object.keys(colors).find(k => sectionName.toLowerCase().includes(k));
    return key ? colors[key] : '#0F3460';
  };

  return (
    <div className="song-card-body">
      <TransposeControl
        currentKey={selectedKey}
        onKeyChange={handleKeyChange}
        originalKey={song.parsed.key || 'C'}
      />

      <div className="chord-preview">
        {song.parsed.sections.map((section, secIdx) => (
          <div key={secIdx}>
            <div className="section-label" style={{ backgroundColor: getSectionColor(section.name) }}>
              {section.name} {section.note ? `${section.note}` : ''}
            </div>
            {section.lines.map((line, lineIdx) => {
              let transposed = line.content;
              if (line.type === 'chord' && transposeAmount !== 0) {
                transposed = transposeLine(line.content, transposeAmount);
              }

              if (line.type === 'bar') {
                return (
                  <div key={lineIdx} className="bar-line">
                    {transposed}
                  </div>
                );
              } else if (line.type === 'chord') {
                return (
                  <div key={lineIdx} className="chord-line">
                    {transposed}
                  </div>
                );
              } else {
                return (
                  <div key={lineIdx} className="lyric-line">
                    {transposed}
                  </div>
                );
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
