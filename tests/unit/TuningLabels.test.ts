import { Fretboard } from '../../src/fretboard/Fretboard';
import { CSS_CLASSES } from '../../src/fretboard/constants';

describe('Tuning Labels Feature', () => {
  it('renders tuning note labels in horizontal orientation to the left of the nut', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5,
      orientation: 'horizontal',
      tuning: ['E', 'A', 'D', 'G', 'B', 'E']
    });

    const svg = fretboard.render();
    const tuningGroup = svg.querySelector(`.${CSS_CLASSES.tuning}`);
    expect(tuningGroup).not.toBeNull();

    const labels = svg.querySelectorAll(`.${CSS_CLASSES.tuningLabel}`);
    expect(labels.length).toBe(6);

    // 6th string (lowest string E) is string index 6
    const string6Label = svg.querySelector('.fretzee-tuning-s6');
    expect(string6Label?.textContent).toBe('E');

    // 1st string (highest string E) is string index 1
    const string1Label = svg.querySelector('.fretzee-tuning-s1');
    expect(string1Label?.textContent).toBe('E');
  });

  it('renders tuning note labels in vertical orientation above the nut', () => {
    const fretboard = new Fretboard({
      stringCount: 4,
      fretCount: 5,
      orientation: 'vertical',
      tuning: ['E', 'A', 'D', 'G']
    });

    const svg = fretboard.render();
    const labels = svg.querySelectorAll(`.${CSS_CLASSES.tuningLabel}`);
    expect(labels.length).toBe(4);

    const string4Label = svg.querySelector('.fretzee-tuning-s4');
    expect(string4Label?.textContent).toBe('E');

    const string1Label = svg.querySelector('.fretzee-tuning-s1');
    expect(string1Label?.textContent).toBe('G');
  });

  it('does not render tuning labels when tuning is omitted', () => {
    const fretboard = new Fretboard({
      stringCount: 6,
      fretCount: 5
    });

    const svg = fretboard.render();
    const tuningGroup = svg.querySelector(`.${CSS_CLASSES.tuning}`);
    expect(tuningGroup).toBeNull();
  });
});
