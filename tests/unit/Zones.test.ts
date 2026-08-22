import { Fretboard } from '../../src/fretboard/Fretboard';

describe('Highlighted Fretboard Zones', () => {
  it('should render zone rectangle with default styling and classes', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      zones: [
        {
          startString: 1,
          endString: 3,
          startFret: 2,
          endFret: 4,
          label: 'D Form Triad'
        }
      ]
    });

    const svg = fretboard.render();
    const zonesGroup = svg.querySelector('.fretzee-zones');
    expect(zonesGroup).not.toBeNull();

    const zoneRect = zonesGroup?.querySelector('.fretzee-zone-rect');
    expect(zoneRect).not.toBeNull();
    expect(zoneRect?.getAttribute('fill')).toBe('rgba(56, 189, 248, 0.15)');
    expect(zoneRect?.getAttribute('stroke')).toBe('#38bdf8');

    const zoneLabel = zonesGroup?.querySelector('.fretzee-zone-label');
    expect(zoneLabel).not.toBeNull();
    expect(zoneLabel?.textContent).toBe('D Form Triad');
  });

  it('should support D Form triad (strings 1..3, frets 2..3) in horizontal and vertical modes', () => {
    const options = {
      title: 'D Major Triad',
      stringCount: 6,
      fretCount: 5,
      fingerings: [
        { string: 1, fret: 2, text: '3' }, // F# (3rd)
        { string: 2, fret: 3, text: 'R', color: '#00f5d4', textColor: '#090d16' }, // D (Root)
        { string: 3, fret: 2, text: '5' }  // A (5th)
      ],
      zones: [
        {
          startString: 1,
          endString: 3,
          startFret: 2,
          endFret: 3,
          label: 'D Form Triad',
          fillColor: 'rgba(56, 189, 248, 0.15)',
          strokeColor: '#38bdf8'
        }
      ]
    };

    const hFretboard = new Fretboard({ ...options, orientation: 'horizontal' });
    const hSvg = hFretboard.render();
    expect(hSvg.querySelector('.fretzee-zone')).not.toBeNull();

    const vFretboard = new Fretboard({ ...options, orientation: 'vertical' });
    const vSvg = vFretboard.render();
    expect(vSvg.querySelector('.fretzee-zone')).not.toBeNull();
  });

  it('should custom stroke dash array and border radius', () => {
    const fretboard = new Fretboard({
      zones: [
        {
          startString: 2,
          endString: 4,
          startFret: 5,
          endFret: 7,
          strokeDashArray: '4 4',
          borderRadius: 12
        }
      ]
    });

    const svg = fretboard.render();
    const rect = svg.querySelector('.fretzee-zone-rect');
    expect(rect?.getAttribute('stroke-dasharray')).toBe('4 4');
    expect(rect?.getAttribute('rx')).toBe('12');
  });

  it('should support hull shape enclosing discrete points', () => {
    const fretboard = new Fretboard({
      zones: [
        {
          type: 'hull',
          points: [
            { string: 1, fret: 2 },
            { string: 2, fret: 3 },
            { string: 3, fret: 2 }
          ],
          label: 'Convex Hull',
          strokeWidth: 5
        }
      ]
    });

    const svg = fretboard.render();
    const polygon = svg.querySelector('polygon.fretzee-zone-rect');
    expect(polygon).not.toBeNull();
    expect(polygon?.getAttribute('points')).toBeTruthy();
    expect(polygon?.getAttribute('stroke-width')).toBe('5');
  });

  it('should support path shape connecting sequential points', () => {
    const fretboard = new Fretboard({
      zones: [
        {
          type: 'path',
          points: [
            { string: 6, fret: 5 },
            { string: 5, fret: 7 },
            { string: 4, fret: 7 }
          ],
          label: 'Scale Run'
        }
      ]
    });

    const svg = fretboard.render();
    const path = svg.querySelector('path.fretzee-zone-rect');
    expect(path).not.toBeNull();
    expect(path?.getAttribute('d')).toContain('M');
  });

  it('should support curly brace shape in vertical orientation', () => {
    const fretboard = new Fretboard({
      orientation: 'vertical',
      zones: [
        {
          type: 'brace',
          startFret: 1,
          endFret: 3,
          label: 'Fret Range'
        }
      ]
    });

    const svg = fretboard.render();
    const brace = svg.querySelector('path.fretzee-zone-rect');
    expect(brace).not.toBeNull();
    expect(brace?.getAttribute('d')).toContain('M');

    const label = svg.querySelector('text.fretzee-zone-label');
    expect(label).not.toBeNull();
    expect(label?.getAttribute('writing-mode')).toBe('tb');
    expect(label?.textContent).toBe('Fret Range');
  });

  it('should support curly brace shape in horizontal orientation', () => {
    const fretboard = new Fretboard({
      orientation: 'horizontal',
      zones: [
        {
          type: 'brace',
          startFret: 1,
          endFret: 3,
          label: 'Horizontal Brace Range'
        }
      ]
    });

    const svg = fretboard.render();
    const brace = svg.querySelector('path.fretzee-zone-rect');
    expect(brace).not.toBeNull();

    const label = svg.querySelector('text.fretzee-zone-label');
    expect(label).not.toBeNull();
    expect(label?.getAttribute('text-anchor')).toBe('middle');
    expect(label?.textContent).toBe('Horizontal Brace Range');
  });

  it('should support strokeStyle presets (dashed/dotted) and custom labelFontSize', () => {
    const fretboard = new Fretboard({
      zones: [
        {
          type: 'box',
          startString: 1,
          endString: 3,
          startFret: 1,
          endFret: 3,
          strokeStyle: 'dashed',
          label: 'Custom Style Box',
          labelFontSize: 14
        },
        {
          type: 'path',
          points: [{ string: 1, fret: 1 }, { string: 2, fret: 2 }],
          strokeStyle: 'dotted',
          strokeWidth: 3
        }
      ]
    });

    const svg = fretboard.render();
    const rect = svg.querySelector('rect.fretzee-zone-rect');
    expect(rect?.getAttribute('stroke-dasharray')).toBe('4 4');

    const path = svg.querySelector('path.fretzee-zone-rect');
    expect(path?.getAttribute('stroke-dasharray')).toBe('2 2');
    expect(path?.getAttribute('stroke-width')).toBe('3');

    const label = svg.querySelector('text.fretzee-zone-label');
    expect(label?.getAttribute('font-size')).toBe('14');
  });

  describe('Zone Label Offsets (labelOffsetX and labelOffsetY)', () => {
    it('should adjust box zone label x and y positions using labelOffsetX and labelOffsetY in horizontal mode', () => {
      const baseBoard = new Fretboard({
        orientation: 'horizontal',
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 3,
            startFret: 2,
            endFret: 4,
            label: 'Box Label'
          }
        ]
      });
      const baseSvg = baseBoard.render();
      const baseLabel = baseSvg.querySelector('text.fretzee-zone-label');
      const baseX = parseFloat(baseLabel?.getAttribute('x') || '0');
      const baseY = parseFloat(baseLabel?.getAttribute('y') || '0');

      const offsetBoard = new Fretboard({
        orientation: 'horizontal',
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 3,
            startFret: 2,
            endFret: 4,
            label: 'Box Label',
            labelOffsetX: 15,
            labelOffsetY: -8
          }
        ]
      });
      const offsetSvg = offsetBoard.render();
      const offsetLabel = offsetSvg.querySelector('text.fretzee-zone-label');
      const offsetX = parseFloat(offsetLabel?.getAttribute('x') || '0');
      const offsetY = parseFloat(offsetLabel?.getAttribute('y') || '0');

      expect(offsetX).toBeCloseTo(baseX + 15);
      expect(offsetY).toBeCloseTo(baseY - 8);
    });

    it('should adjust box zone label in vertical mode with labelOffsetX and labelOffsetY', () => {
      const baseBoard = new Fretboard({
        orientation: 'vertical',
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 3,
            startFret: 2,
            endFret: 4,
            label: 'Vertical Box'
          }
        ]
      });
      const baseSvg = baseBoard.render();
      const baseLabel = baseSvg.querySelector('text.fretzee-zone-label');
      const baseX = parseFloat(baseLabel?.getAttribute('x') || '0');
      const baseY = parseFloat(baseLabel?.getAttribute('y') || '0');

      const offsetBoard = new Fretboard({
        orientation: 'vertical',
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 3,
            startFret: 2,
            endFret: 4,
            label: 'Vertical Box',
            labelOffsetX: -10,
            labelOffsetY: 20
          }
        ]
      });
      const offsetSvg = offsetBoard.render();
      const offsetLabel = offsetSvg.querySelector('text.fretzee-zone-label');
      const offsetX = parseFloat(offsetLabel?.getAttribute('x') || '0');
      const offsetY = parseFloat(offsetLabel?.getAttribute('y') || '0');

      expect(offsetX).toBeCloseTo(baseX - 10);
      expect(offsetY).toBeCloseTo(baseY + 20);
    });

    it('should adjust hull zone label with labelOffsetX and labelOffsetY', () => {
      const baseBoard = new Fretboard({
        zones: [
          {
            type: 'hull',
            points: [{ string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }],
            label: 'Hull Label'
          }
        ]
      });
      const baseSvg = baseBoard.render();
      const baseLabel = baseSvg.querySelector('text.fretzee-zone-label');
      const baseX = parseFloat(baseLabel?.getAttribute('x') || '0');
      const baseY = parseFloat(baseLabel?.getAttribute('y') || '0');

      const offsetBoard = new Fretboard({
        zones: [
          {
            type: 'hull',
            points: [{ string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }],
            label: 'Hull Label',
            labelOffsetX: 12,
            labelOffsetY: -6
          }
        ]
      });
      const offsetSvg = offsetBoard.render();
      const offsetLabel = offsetSvg.querySelector('text.fretzee-zone-label');
      const offsetX = parseFloat(offsetLabel?.getAttribute('x') || '0');
      const offsetY = parseFloat(offsetLabel?.getAttribute('y') || '0');

      expect(offsetX).toBeCloseTo(baseX + 12);
      expect(offsetY).toBeCloseTo(baseY - 6);
    });

    it('should adjust path zone label with labelOffsetX and labelOffsetY', () => {
      const baseBoard = new Fretboard({
        zones: [
          {
            type: 'path',
            points: [{ string: 6, fret: 5 }, { string: 5, fret: 7 }],
            label: 'Path Label'
          }
        ]
      });
      const baseSvg = baseBoard.render();
      const baseLabel = baseSvg.querySelector('text.fretzee-zone-label');
      const baseX = parseFloat(baseLabel?.getAttribute('x') || '0');
      const baseY = parseFloat(baseLabel?.getAttribute('y') || '0');

      const offsetBoard = new Fretboard({
        zones: [
          {
            type: 'path',
            points: [{ string: 6, fret: 5 }, { string: 5, fret: 7 }],
            label: 'Path Label',
            labelOffsetX: -14,
            labelOffsetY: 10
          }
        ]
      });
      const offsetSvg = offsetBoard.render();
      const offsetLabel = offsetSvg.querySelector('text.fretzee-zone-label');
      const offsetX = parseFloat(offsetLabel?.getAttribute('x') || '0');
      const offsetY = parseFloat(offsetLabel?.getAttribute('y') || '0');

      expect(offsetX).toBeCloseTo(baseX - 14);
      expect(offsetY).toBeCloseTo(baseY + 10);
    });

    it('should support titleOffsetX and titleOffsetY aliases', () => {
      const baseBoard = new Fretboard({
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 2,
            startFret: 1,
            endFret: 2,
            label: 'Alias Test'
          }
        ]
      });
      const baseSvg = baseBoard.render();
      const baseLabel = baseSvg.querySelector('text.fretzee-zone-label');
      const baseX = parseFloat(baseLabel?.getAttribute('x') || '0');
      const baseY = parseFloat(baseLabel?.getAttribute('y') || '0');

      const offsetBoard = new Fretboard({
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 2,
            startFret: 1,
            endFret: 2,
            label: 'Alias Test',
            titleOffsetX: 25,
            titleOffsetY: -15
          }
        ]
      });
      const offsetSvg = offsetBoard.render();
      const offsetLabel = offsetSvg.querySelector('text.fretzee-zone-label');
      const offsetX = parseFloat(offsetLabel?.getAttribute('x') || '0');
      const offsetY = parseFloat(offsetLabel?.getAttribute('y') || '0');

      expect(offsetX).toBeCloseTo(baseX + 25);
      expect(offsetY).toBeCloseTo(baseY - 15);
    });

    it('should position all tspans of a multi-line label at the offset x position', () => {
      const offsetBoard = new Fretboard({
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 3,
            startFret: 1,
            endFret: 3,
            label: 'Line 1\\nLine 2\\nLine 3',
            labelOffsetX: 18,
            labelOffsetY: 12
          }
        ]
      });
      const svg = offsetBoard.render();
      const text = svg.querySelector('text.fretzee-zone-label');
      const textX = text?.getAttribute('x');
      const tspans = svg.querySelectorAll('text.fretzee-zone-label tspan');

      expect(tspans.length).toBe(3);
      tspans.forEach(tspan => {
        expect(tspan.getAttribute('x')).toBe(textX);
      });
    });

    it('should expand viewBox so vertical box zone covering string 1 is not clipped on the right', () => {
      const fretboard = new Fretboard({
        stringCount: 6,
        fretCount: 4,
        orientation: 'vertical',
        zones: [
          {
            type: 'box',
            startString: 1,
            endString: 3,
            startFret: 1,
            endFret: 3,
            label: 'Right Box'
          }
        ]
      });

      const svg = fretboard.render();
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 0, 0];
      const [vx, , vw] = viewBox;
      const rightEdge = vx + vw;

      const rect = svg.querySelector('rect.fretzee-zone-rect');
      const rectX = parseFloat(rect?.getAttribute('x') || '0');
      const rectW = parseFloat(rect?.getAttribute('width') || '0');
      const rectRight = rectX + rectW;

      expect(rightEdge).toBeGreaterThanOrEqual(rectRight);
    });
  });
});
