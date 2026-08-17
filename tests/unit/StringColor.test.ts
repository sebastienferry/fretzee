import { Fretboard } from '../../src/fretboard/Fretboard';

describe('String Color Customization (Issue 50)', () => {
  it('should default string color to gray (#6b7280)', () => {
    const fretboard = new Fretboard({
      stringCount: 6
    });

    const svg = fretboard.render();
    const strings = svg.querySelectorAll('.fretzee-string');
    expect(strings.length).toBe(6);
    strings.forEach(str => {
      expect(str.getAttribute('stroke')).toBe('#6b7280');
    });
  });

  it('should support global custom string color', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      stringColor: '#333333'
    });

    const svg = fretboard.render();
    const strings = svg.querySelectorAll('.fretzee-string');
    strings.forEach(str => {
      expect(str.getAttribute('stroke')).toBe('#333333');
    });
  });

  it('should support array of colors per string', () => {
    const customColors = ['#e11d48', '#d97706', '#ca8a04', '#16a34a', '#2563eb', '#9333ea'];
    const fretboard = new Fretboard({
      stringCount: 6,
      stringColor: customColors
    });

    const svg = fretboard.render();
    const strings = svg.querySelectorAll('.fretzee-string');
    expect(strings.length).toBe(6);
    strings.forEach((str, index) => {
      expect(str.getAttribute('stroke')).toBe(customColors[index]);
    });
  });
});
