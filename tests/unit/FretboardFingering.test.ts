import { Fretboard } from '../../src/fretboard/Fretboard';

describe('Fretboard Fingering Rendering', () => {
  it('should render fingering markers group in horizontal mode with default colors', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'horizontal',
      fingerings: [
        { string: 1, fret: 1, text: '1' },
        { string: 2, fret: 2, text: '2' }
      ]
    });

    const svg = fretboard.render();
    const fingeringsGroup = svg.querySelector('.fretzee-fingerings');
    expect(fingeringsGroup).not.toBeNull();

    const fingeringElements = svg.querySelectorAll('.fretzee-fingering');
    expect(fingeringElements.length).toBe(2);

    const firstCircle = svg.querySelector('.fretzee-fingering-s1-f1 circle');
    expect(firstCircle).not.toBeNull();
    expect(firstCircle?.getAttribute('fill')).toBe('#000000');

    const firstText = svg.querySelector('.fretzee-fingering-s1-f1 text');
    expect(firstText).not.toBeNull();
    expect(firstText?.getAttribute('fill')).toBe('#ffffff');
    expect(firstText?.textContent).toBe('1');
  });

  it('should render fingering markers in vertical mode correctly', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'vertical',
      fingerings: [
        { string: 1, fret: 0, text: 'O' }
      ]
    });

    const svg = fretboard.render();
    const openFingering = svg.querySelector('.fretzee-fingering-s1-f0');
    expect(openFingering).not.toBeNull();
  });

  it('should render custom HTML background and text colors', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      fingerings: [
        { string: 3, fret: 2, text: 'R', color: '#e74c3c', textColor: '#ffffff' },
        { string: 4, fret: 3, text: '3', color: 'blue', textColor: 'yellow' }
      ]
    });

    const svg = fretboard.render();

    const rootCircle = svg.querySelector('.fretzee-fingering-s3-f2 circle');
    expect(rootCircle?.getAttribute('fill')).toBe('#e74c3c');

    const rootText = svg.querySelector('.fretzee-fingering-s3-f2 text');
    expect(rootText?.getAttribute('fill')).toBe('#ffffff');

    const thirdCircle = svg.querySelector('.fretzee-fingering-s4-f3 circle');
    expect(thirdCircle?.getAttribute('fill')).toBe('blue');

    const thirdText = svg.querySelector('.fretzee-fingering-s4-f3 text');
    expect(thirdText?.getAttribute('fill')).toBe('yellow');
  });

  it('should ensure adjacent fingerings on the same fret never overlap in horizontal and vertical modes', () => {
    // 6-string guitar with adjacent fingerings on fret 1
    const stringSpacing = 30;
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      stringSpacing,
      orientation: 'horizontal',
      fingerings: [
        { string: 1, fret: 1, text: '1' },
        { string: 2, fret: 1, text: '2' },
        { string: 3, fret: 1, text: '3' },
        { string: 4, fret: 1, text: '4' },
        { string: 5, fret: 1, text: '5' },
        { string: 6, fret: 1, text: '6' }
      ]
    });

    const svg = fretboard.render();
    const circles = Array.from(svg.querySelectorAll('.fretzee-fingering-circle'));
    expect(circles.length).toBe(6);

    // Extract radii and centers
    const r1 = parseFloat(circles[0].getAttribute('r') || '0');
    const r2 = parseFloat(circles[1].getAttribute('r') || '0');

    // Radius must be strictly less than half of stringSpacing to prevent touch/overlap
    expect(r1 * 2).toBeLessThan(stringSpacing);

    const cy1 = parseFloat(circles[0].getAttribute('cy') || '0');
    const cy2 = parseFloat(circles[1].getAttribute('cy') || '0');
    const distanceBetweenCenters = Math.abs(cy2 - cy1);

    // Distance between adjacent circle centers must be strictly greater than combined diameter/2r
    expect(distanceBetweenCenters).toBeGreaterThan(r1 + r2);
  });

  it('should adjust viewBox to ensure open string markers (fret 0) are completely visible', () => {
    const fretboardHorizontal = new Fretboard({
      stringCount: 6,
      fretCount: 4,
      orientation: 'horizontal',
      fingerings: [{ string: 1, fret: 0, text: 'O' }]
    });

    const svgH = fretboardHorizontal.render();
    const viewBoxH = svgH.getAttribute('viewBox')?.split(' ').map(Number);
    expect(viewBoxH).toBeDefined();
    // viewBoxX must extend significantly into negative territory to contain open string circle
    expect(viewBoxH![0]).toBeLessThan(-30);

    const fretboardVertical = new Fretboard({
      stringCount: 6,
      fretCount: 4,
      orientation: 'vertical',
      fingerings: [{ string: 1, fret: 0, text: 'O' }]
    });

    const svgV = fretboardVertical.render();
    const viewBoxV = svgV.getAttribute('viewBox')?.split(' ').map(Number);
    expect(viewBoxV).toBeDefined();
    // viewBoxY must extend significantly into negative territory to contain open string circle
    expect(viewBoxV![1]).toBeLessThan(-30);
  });

  it('should support reserveNutClearance: false for tight balanced margins', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 4,
      orientation: 'horizontal',
      reserveNutClearance: false,
      fingerings: [{ string: 1, fret: 0, text: 'O' }]
    });

    const svg = fretboard.render();
    const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number);
    expect(viewBox).toBeDefined();
    // Without nut clearance, viewBoxX starts directly at standard padding (-13)
    expect(viewBox![0]).toBe(-13);
  });

  it('should align fingering circle centers with string visual centers in horizontal mode', () => {
    const stringSpacing = 30;
    const stringThickness = 1;
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'horizontal',
      stringSpacing,
      stringThickness,
      fingerings: [
        { string: 1, fret: 1, text: '1' },
        { string: 3, fret: 2, text: '3' },
        { string: 6, fret: 3, text: '6' }
      ]
    });

    const svg = fretboard.render();

    // String visual center = (stringNum - 1) * stringSpacing + (stringThickness * stringNum) / 2
    // String 1: center = 0 * 30 + (1 * 1) / 2 = 0.5
    const circle1 = svg.querySelector('.fretzee-fingering-s1-f1 circle');
    expect(parseFloat(circle1!.getAttribute('cy')!)).toBeCloseTo(0 + (stringThickness * 1) / 2);

    // String 3: center = 2 * 30 + (1 * 3) / 2 = 61.5
    const circle3 = svg.querySelector('.fretzee-fingering-s3-f2 circle');
    expect(parseFloat(circle3!.getAttribute('cy')!)).toBeCloseTo(2 * stringSpacing + (stringThickness * 3) / 2);

    // String 6 (low E, thickest): center = 5 * 30 + (1 * 6) / 2 = 153
    const circle6 = svg.querySelector('.fretzee-fingering-s6-f3 circle');
    expect(parseFloat(circle6!.getAttribute('cy')!)).toBeCloseTo(5 * stringSpacing + (stringThickness * 6) / 2);
  });

  it('should align fingering circle centers with string visual centers in vertical mode', () => {
    const stringSpacing = 30;
    const stringThickness = 1;
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'vertical',
      stringSpacing,
      stringThickness,
      fingerings: [
        { string: 1, fret: 1, text: '1' },
        { string: 6, fret: 3, text: '6' }
      ]
    });

    const svg = fretboard.render();

    // In vertical mode, string X = (stringCount - 1 - stringIndex) * stringSpacing + thicknessOffset
    // String 1 (index 0): x = (6 - 1 - 0) * 30 = 150, center = 150 + (1*1)/2 = 150.5
    const circle1 = svg.querySelector('.fretzee-fingering-s1-f1 circle');
    expect(parseFloat(circle1!.getAttribute('cx')!)).toBeCloseTo(5 * stringSpacing + (stringThickness * 1) / 2);

    // String 6 (index 5): x = (6 - 1 - 5) * 30 = 0, center = 0 + (1*6)/2 = 3
    const circle6 = svg.querySelector('.fretzee-fingering-s6-f3 circle');
    expect(parseFloat(circle6!.getAttribute('cx')!)).toBeCloseTo(0 * stringSpacing + (stringThickness * 6) / 2);
  });

  it('should align fingering circle centers between fret lines in horizontal mode', () => {
    const fretSpacing = 40;
    const stringSpacing = 30;
    const stringThickness = 1;
    const fretThickness = 3; // Default
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'horizontal',
      stringSpacing,
      stringThickness,
      fretSpacing,
      fretThickness,
      fingerings: [
        { string: 1, fret: 1, text: '1' },
        { string: 1, fret: 2, text: '2' },
        { string: 1, fret: 3, text: '3' }
      ]
    });

    const svg = fretboard.render();

    // Fret line positions (horizontal, with fretThickness = 3):
    // Line 0 (fret 1): x = (1-1)*40 + 3/2 = 1.5
    // Line 1 (fret 2): x = (2-1)*40 + 3/2 = 41.5
    // Line 2 (fret 3): x = (3-1)*40 + 3/2 = 81.5
    // Line 3 (fret 4): x = (4-1)*40 + 3/2 = 121.5
    // Line 4 (fret 5): x = (5-1)*40 + 3/2 = 161.5
    // Line 5 (fret 6, end): x = (6-1)*40 + 3/2 = 201.5

    // Fingering positions should be centered between fret lines:
    // Fret 1: center between line 0 (1.5) and line 1 (41.5) = 21.5
    // Fret 2: center between line 1 (41.5) and line 2 (81.5) = 61.5
    // Fret 3: center between line 2 (81.5) and line 3 (121.5) = 101.5

    const circle1 = svg.querySelector('.fretzee-fingering-s1-f1 circle');
    expect(parseFloat(circle1!.getAttribute('cx')!)).toBe(21.5);

    const circle2 = svg.querySelector('.fretzee-fingering-s1-f2 circle');
    expect(parseFloat(circle2!.getAttribute('cx')!)).toBe(61.5);

    const circle3 = svg.querySelector('.fretzee-fingering-s1-f3 circle');
    expect(parseFloat(circle3!.getAttribute('cx')!)).toBe(101.5);
  });

  it('should align fingering circle centers between fret lines in vertical mode', () => {
    const fretSpacing = 40;
    const stringSpacing = 30;
    const stringThickness = 1;
    const fretThickness = 3; // Default
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'vertical',
      stringSpacing,
      stringThickness,
      fretSpacing,
      fretThickness,
      fingerings: [
        { string: 1, fret: 1, text: '1' },
        { string: 1, fret: 2, text: '2' },
        { string: 1, fret: 3, text: '3' }
      ]
    });

    const svg = fretboard.render();

    // Get fret lines
    const fretLines = Array.from(svg.querySelectorAll('.fretzee-frets line'));
    
    // Fret line positions (with fretThickness = 3):
    // Line 0 (fret 1): y = (1-1)*40 + 3/2 = 1.5
    // Line 1 (fret 2): y = (2-1)*40 + 3/2 = 41.5
    // Line 2 (fret 3): y = (3-1)*40 + 3/2 = 81.5
    // Line 3 (fret 4): y = (4-1)*40 + 3/2 = 121.5
    // Line 4 (fret 5): y = (5-1)*40 + 3/2 = 161.5
    // Line 5 (fret 6, end): y = (6-1)*40 + 3/2 = 201.5

    // Fingering positions should be centered between fret lines:
    // Fret 1: center between line 0 (1.5) and line 1 (41.5) = 21.5
    //        = (1 - 0.5) * 40 + 3/2 = 20 + 1.5 = 21.5
    // Fret 2: center between line 1 (41.5) and line 2 (81.5) = 61.5
    //        = (2 - 0.5) * 40 + 3/2 = 60 + 1.5 = 61.5
    // Fret 3: center between line 2 (81.5) and line 3 (121.5) = 101.5
    //        = (3 - 0.5) * 40 + 3/2 = 100 + 1.5 = 101.5

    const circle1 = svg.querySelector('.fretzee-fingering-s1-f1 circle');
    expect(parseFloat(circle1!.getAttribute('cy')!)).toBe(21.5);

    const circle2 = svg.querySelector('.fretzee-fingering-s1-f2 circle');
    expect(parseFloat(circle2!.getAttribute('cy')!)).toBe(61.5);

    const circle3 = svg.querySelector('.fretzee-fingering-s1-f3 circle');
    expect(parseFloat(circle3!.getAttribute('cy')!)).toBe(101.5);
  });
});

