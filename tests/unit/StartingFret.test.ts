import { Fretboard } from '../../src/fretboard/Fretboard';

describe('Configurable Starting Fret', () => {
  describe('Option Defaults and Validation', () => {
    it('should default startFret to 1 when omitted', () => {
      const fretboard = new Fretboard();
      expect(fretboard.startFret).toBe(1);
      expect(fretboard.getOptions().startFret).toBe(1);
    });

    it('should treat startFret: 0 as startFret: 1', () => {
      const fretboard = new Fretboard({ startFret: 0 });
      expect(fretboard.startFret).toBe(1);
      expect(fretboard.getOptions().startFret).toBe(1);
    });

    it('should accept valid startFret values within range 0..24', () => {
      const fb5 = new Fretboard({ startFret: 5 });
      expect(fb5.startFret).toBe(5);

      const fb24 = new Fretboard({ startFret: 24 });
      expect(fb24.startFret).toBe(24);
    });

    it('should throw RangeError for startFret out of bounds', () => {
      expect(() => new Fretboard({ startFret: -1 })).toThrow(RangeError);
      expect(() => new Fretboard({ startFret: 25 })).toThrow(RangeError);
    });

    it('should throw TypeError for non-integer startFret', () => {
      expect(() => new Fretboard({ startFret: 2.5 })).toThrow(TypeError);
    });
  });

  describe('Inlay Filtering and Absolute Numbering', () => {
    it('should filter inlays to visible range and display absolute fret numbers', () => {
      // startFret: 5, fretCount: 4 -> visible frets: 5, 6, 7, 8
      // Standard inlays in range [5, 8]: 5, 7
      const fretboard = new Fretboard({ startFret: 5, fretCount: 4 });
      const svg = fretboard.render();
      const inlays = svg.querySelectorAll('.fretzee-inlay');

      expect(inlays.length).toBe(2);
      const labels = Array.from(inlays).map(el => el.textContent);
      expect(labels).toContain('5');
      expect(labels).toContain('7');
    });

    it('should display octave inlay 12 when startFret: 12', () => {
      // startFret: 12, fretCount: 4 -> visible frets: 12..15
      const fretboard = new Fretboard({ startFret: 12, fretCount: 4 });
      const svg = fretboard.render();
      const inlays = svg.querySelectorAll('.fretzee-inlay');

      expect(inlays.length).toBe(2); // 12, 15
      const labels = Array.from(inlays).map(el => el.textContent);
      expect(labels).toEqual(['12', '15']);
    });

    it('should render no inlays if none fall within displayed fret range', () => {
      // startFret: 1, fretCount: 4 with custom inlayPositions: [5, 7] -> no inlays in range [1, 4]
      const fretboard = new Fretboard({ startFret: 1, fretCount: 4, inlayPositions: [5, 7] });
      const svg = fretboard.render();
      const inlays = svg.querySelectorAll('.fretzee-inlay');

      expect(inlays.length).toBe(0);
    });

    it('should display double dots for octave frets in visible range', () => {
      const fretboard = new Fretboard({ startFret: 10, fretCount: 4 }); // 10..13 includes 12
      const svg = fretboard.render();
      const doubleDots = svg.querySelectorAll('.fretzee-inlay-dot-12');

      expect(doubleDots.length).toBe(2);
    });
  });

  describe('Fingering Positioning & Range Filtering', () => {
    it('should map absolute fret position to relative visual position', () => {
      // startFret: 5, fretCount: 4 (frets 5..8)
      // Fingering at fret 5 -> 1st visual fret
      const fretboard = new Fretboard({
        startFret: 5,
        fretCount: 4,
        fingerings: [{ string: 1, fret: 5, text: 'A' }]
      });
      const svg = fretboard.render();
      const fingering = svg.querySelector('.fretzee-fingering-s1-f5');

      expect(fingering).not.toBeNull();
    });

    it('should omit fingerings outside the visible fret range', () => {
      const fretboard = new Fretboard({
        startFret: 5,
        fretCount: 4, // frets 5..8
        fingerings: [
          { string: 1, fret: 2 }, // outside (below)
          { string: 1, fret: 5 }, // inside
          { string: 1, fret: 9 }  // outside (above)
        ]
      });
      const svg = fretboard.render();
      const fingerings = svg.querySelectorAll('.fretzee-fingering');

      expect(fingerings.length).toBe(1);
    });

    it('should render open (fret 0) and muted (fret -1) string fingerings even when startFret > 1', () => {
      const fretboard = new Fretboard({
        startFret: 5,
        fretCount: 4,
        fingerings: [
          { string: 1, fret: 0, text: 'O' },
          { string: 6, fret: -1, text: 'X' }
        ]
      });
      const svg = fretboard.render();
      const fingerings = svg.querySelectorAll('.fretzee-fingering');

      expect(fingerings.length).toBe(2);
    });
  });

  describe('String Overlap on First Fret', () => {
    it('should overlap string past 1st fret when startFret > 1 in horizontal mode', () => {
      const fretboard = new Fretboard({ startFret: 5, fretCount: 4, orientation: 'horizontal' });
      const svg = fretboard.render();
      const firstString = svg.querySelector('.fretzee-string-0');

      expect(firstString).not.toBeNull();
      expect(Number(firstString?.getAttribute('x1'))).toBeLessThan(0);
    });

    it('should overlap string past 1st fret when startFret > 1 in vertical mode', () => {
      const fretboard = new Fretboard({ startFret: 5, fretCount: 4, orientation: 'vertical' });
      const svg = fretboard.render();
      const firstString = svg.querySelector('.fretzee-string-0');

      expect(firstString).not.toBeNull();
      expect(Number(firstString?.getAttribute('y1'))).toBeLessThan(0);
    });

    it('should NOT overlap string past 1st fret when startFret is 1 (starts at nut)', () => {
      const fretboard = new Fretboard({ startFret: 1, fretCount: 4, orientation: 'horizontal' });
      const svg = fretboard.render();
      const firstString = svg.querySelector('.fretzee-string-0');

      expect(firstString).not.toBeNull();
      expect(Number(firstString?.getAttribute('x1'))).toBe(0);
    });

    it('should NOT render start fret text indicator element', () => {
      const fretboard = new Fretboard({ startFret: 5, fretCount: 4 });
      const svg = fretboard.render();
      const indicator = svg.querySelector('.fretzee-start-fret');

      expect(indicator).toBeNull();
    });
  });

  describe('Backward Compatibility', () => {
    it('should render identically when startFret is omitted vs startFret: 1 vs startFret: 0', () => {
      const fbDefault = new Fretboard({ fretCount: 12, stringCount: 6 });
      const fb1 = new Fretboard({ startFret: 1, fretCount: 12, stringCount: 6 });
      const fb0 = new Fretboard({ startFret: 0, fretCount: 12, stringCount: 6 });

      const svgDefault = fbDefault.render().outerHTML;
      const svg1 = fb1.render().outerHTML;
      const svg0 = fb0.render().outerHTML;

      expect(svg1).toBe(svgDefault);
      expect(svg0).toBe(svgDefault);
    });
  });
});
