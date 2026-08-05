import { Fingering } from '../../src/fretboard/Fingering';
import { DEFAULT_FINGERING_COLOR, DEFAULT_FINGERING_TEXT_COLOR } from '../../src/fretboard/constants';

describe('Fingering Entity', () => {
  it('should initialize with default color and textColor when omitted', () => {
    const fingering = new Fingering({ string: 1, fret: 2, text: '1' });
    expect(fingering.string).toBe(1);
    expect(fingering.fret).toBe(2);
    expect(fingering.text).toBe('1');
    expect(fingering.color).toBe(DEFAULT_FINGERING_COLOR);
    expect(fingering.textColor).toBe(DEFAULT_FINGERING_TEXT_COLOR);
  });

  it('should preserve custom text, color, and textColor', () => {
    const fingering = new Fingering({
      string: 3,
      fret: 4,
      text: 'G',
      color: '#ff0000',
      textColor: '#000000'
    });
    expect(fingering.string).toBe(3);
    expect(fingering.fret).toBe(4);
    expect(fingering.text).toBe('G');
    expect(fingering.color).toBe('#ff0000');
    expect(fingering.textColor).toBe('#000000');
  });

  it('should fall back to defaults when empty strings are provided for colors', () => {
    const fingering = new Fingering({
      string: 2,
      fret: 0,
      color: '   ',
      textColor: ''
    });
    expect(fingering.color).toBe(DEFAULT_FINGERING_COLOR);
    expect(fingering.textColor).toBe(DEFAULT_FINGERING_TEXT_COLOR);
  });

  it('should generate correct CSS class string', () => {
    const fingering = new Fingering({ string: 2, fret: 3 });
    expect(fingering.getCssClass()).toContain('fretly-fingering-s2-f3');
  });
});
