import { Fretboard } from '../../src/fretboard/Fretboard';
import { CSS_CLASSES } from '../../src/fretboard/constants';

describe('Diagram Title', () => {
  describe('US1: Centered title rendering', () => {
    it('renders a title as an SVG text element with class fretzee-title', () => {
      const fretboard = new Fretboard({ title: 'Am Chord' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl).not.toBeNull();
      expect(titleEl?.tagName.toLowerCase()).toBe('text');
      expect(titleEl?.textContent).toBe('Am Chord');
    });

    it('does not render a title element when title is undefined', () => {
      const fretboard = new Fretboard();
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl).toBeNull();
    });

    it('does not render a title element when title is empty string', () => {
      const fretboard = new Fretboard({ title: '' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl).toBeNull();
    });

    it('centers title by default using text-anchor: middle', () => {
      const fretboard = new Fretboard({ title: 'C Major Scale' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl?.getAttribute('text-anchor')).toBe('middle');
    });

    it('works in horizontal orientation', () => {
      const fretboard = new Fretboard({ title: 'Horizontal Title', orientation: 'horizontal' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent).toBe('Horizontal Title');
    });

    it('works in vertical orientation', () => {
      const fretboard = new Fretboard({ title: 'Vertical Title', orientation: 'vertical' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent).toBe('Vertical Title');
    });
  });

  describe('US2: Left-aligned title', () => {
    it('left-aligned title has text-anchor: start', () => {
      const fretboard = new Fretboard({ title: 'Scale', titleAlignment: 'left' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl?.getAttribute('text-anchor')).toBe('start');
    });

    it('left-aligned title x position is at fretboard left edge (0)', () => {
      const fretboard = new Fretboard({ title: 'Scale', titleAlignment: 'left' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl?.getAttribute('x')).toBe('0');
    });

    it('explicitly centered title matches default behavior', () => {
      const fretboard = new Fretboard({ title: 'Scale', titleAlignment: 'center' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);

      expect(titleEl?.getAttribute('text-anchor')).toBe('middle');
    });
  });

  describe('Title Offset with Top String Fingerings', () => {
    it('stably positions title y position consistently with top string clearance in horizontal mode', () => {
      const fretboardNormal = new Fretboard({
        title: 'Normal Title',
        orientation: 'horizontal',
        fingerings: [{ string: 2, fret: 1 }]
      });
      const svgNormal = fretboardNormal.render();
      const titleNormal = svgNormal.querySelector(`.${CSS_CLASSES.title}`);
      const yNormal = parseFloat(titleNormal?.getAttribute('y') || '0');

      const fretboardTop = new Fretboard({
        title: 'Top String Title',
        orientation: 'horizontal',
        fingerings: [{ string: 1, fret: 1 }]
      });
      const svgTop = fretboardTop.render();
      const titleTop = svgTop.querySelector(`.${CSS_CLASSES.title}`);
      const yTop = parseFloat(titleTop?.getAttribute('y') || '0');

      expect(yTop).toBe(yNormal);
    });

    it('stably positions title y position with reserved clearance in vertical mode', () => {
      const fretboardNormal = new Fretboard({
        title: 'Vertical Normal',
        orientation: 'vertical',
        fingerings: [{ string: 1, fret: 1 }]
      });
      const svgNormal = fretboardNormal.render();
      const titleNormal = svgNormal.querySelector(`.${CSS_CLASSES.title}`);
      const yNormal = parseFloat(titleNormal?.getAttribute('y') || '0');

      const fretboardOpen = new Fretboard({
        title: 'Vertical Open',
        orientation: 'vertical',
        fingerings: [{ string: 1, fret: 0 }]
      });
      const svgOpen = fretboardOpen.render();
      const titleOpen = svgOpen.querySelector(`.${CSS_CLASSES.title}`);
      const yOpen = parseFloat(titleOpen?.getAttribute('y') || '0');

      expect(yOpen).toBe(yNormal);
    });
  });

  describe('Subtitle rendering', () => {
    it('renders a subtitle as an SVG text element with class fretzee-subtitle', () => {
      const fretboard = new Fretboard({ title: 'Am Chord', subtitle: 'Open Position' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);
      const subtitleEl = svg.querySelector(`.${CSS_CLASSES.subtitle}`);

      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent).toBe('Am Chord');
      expect(subtitleEl).not.toBeNull();
      expect(subtitleEl?.tagName.toLowerCase()).toBe('text');
      expect(subtitleEl?.textContent).toBe('Open Position');
      expect(subtitleEl?.getAttribute('fill')).toBe('#666666');
    });

    it('positions subtitle below title (title is higher/more negative Y)', () => {
      const fretboard = new Fretboard({ title: 'Am Chord', subtitle: 'Open Position' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);
      const subtitleEl = svg.querySelector(`.${CSS_CLASSES.subtitle}`);

      const yTitle = parseFloat(titleEl?.getAttribute('y') || '0');
      const ySubtitle = parseFloat(subtitleEl?.getAttribute('y') || '0');

      expect(yTitle).toBeLessThan(ySubtitle);
    });

    it('renders subtitle alone without title', () => {
      const fretboard = new Fretboard({ subtitle: 'Standalone Subtitle' });
      const svg = fretboard.render();
      const titleEl = svg.querySelector(`.${CSS_CLASSES.title}`);
      const subtitleEl = svg.querySelector(`.${CSS_CLASSES.subtitle}`);

      expect(titleEl).toBeNull();
      expect(subtitleEl).not.toBeNull();
      expect(subtitleEl?.textContent).toBe('Standalone Subtitle');
    });

    it('left-aligned subtitle matches left-aligned title anchor and x position', () => {
      const fretboard = new Fretboard({ title: 'Title', subtitle: 'Subtitle', titleAlignment: 'left' });
      const svg = fretboard.render();
      const subtitleEl = svg.querySelector(`.${CSS_CLASSES.subtitle}`);

      expect(subtitleEl?.getAttribute('text-anchor')).toBe('start');
      expect(subtitleEl?.getAttribute('x')).toBe('0');
    });
  });

  describe('Validation', () => {
    it('throws TypeError if invalid titleAlignment is provided', () => {
      expect(() => new Fretboard({ title: 'Test', titleAlignment: 'right' as any })).toThrow(TypeError);
    });
  });
});
