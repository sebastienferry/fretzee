import { Fretboard } from '../../src/fretboard/Fretboard';
import { Fingering } from '../../src/fretboard/Fingering';

describe('Muted Open Strings (fret: -1)', () => {
  it('defaults text to X and textColor to black when fret is -1', () => {
    const fingering = new Fingering({ string: 6, fret: -1 });
    expect(fingering.fret).toBe(-1);
    expect(fingering.text).toBe('X');
    expect(fingering.textColor).toBe('#000000');
  });

  it('allows custom text when fret is -1', () => {
    const fingering = new Fingering({ string: 6, fret: -1, text: 'x' });
    expect(fingering.text).toBe('x');
  });

  it('renders standalone black X text without background circle element', () => {
    const fretboard = new Fretboard({
      fingerings: [
        { string: 6, fret: -1 },
        { string: 5, fret: 3, text: '3' }
      ],
      orientation: 'horizontal'
    });

    const svg = fretboard.render();
    const mutedGroup = svg.querySelector('.fretzee-fingering-s6-f-1');
    expect(mutedGroup).not.toBeNull();
    expect(mutedGroup?.querySelector('circle')).toBeNull();

    const mutedText = mutedGroup?.querySelector('text');
    expect(mutedText).not.toBeNull();
    expect(mutedText?.textContent).toBe('X');
    expect(mutedText?.getAttribute('fill')).toBe('#000000');
  });

  it('renders muted open string markers in vertical orientation', () => {
    const fretboard = new Fretboard({
      fingerings: [
        { string: 6, fret: -1 },
        { string: 1, fret: -1 }
      ],
      orientation: 'vertical'
    });

    const svg = fretboard.render();
    const mutedMarkers = svg.querySelectorAll('.fretzee-open-marker');
    expect(mutedMarkers.length).toBe(2);
  });
});
