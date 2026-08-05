import { Fretboard } from '../../src/fretboard/Fretboard';

describe('Fretboard Inlay Rendering', () => {
  it('should render grey dot inlays by default (showInlays: true)', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 12,
      orientation: 'horizontal'
    });
    const svg = fretboard.render();
    const dots = svg.querySelectorAll('.fretly-inlay-dot');

    expect(dots.length).toBeGreaterThan(0);
    // Frets 3, 5, 7, 9 get 1 dot each, fret 12 gets 2 dots -> total 6 dot circles
    expect(dots.length).toBe(6);
  });

  it('should omit inlay dots when showInlays is false', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 12,
      showInlays: false
    });
    const svg = fretboard.render();
    const dots = svg.querySelectorAll('.fretly-inlay-dot');
    const inlaysGroup = svg.querySelector('.fretly-inlays');

    expect(dots.length).toBe(0);
    expect(inlaysGroup).toBeNull();
  });

  it('should render inlay dots correctly in vertical orientation', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 12,
      orientation: 'vertical',
      showInlays: true
    });
    const svg = fretboard.render();
    const dots = svg.querySelectorAll('.fretly-inlay-dot');

    expect(dots.length).toBe(6);
  });

  it('should render double dots at octave frets (fret 12)', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 12,
      orientation: 'horizontal'
    });
    const svg = fretboard.render();
    const fret12Dots = svg.querySelectorAll('.fretly-inlay-dot-12');

    expect(fret12Dots.length).toBe(2);
  });
});
