import * as FretlyMusic from '../../src/music/index';
import { Fretboard } from '../../src/fretboard/Fretboard';

describe('Standalone Music Catalog (FretlyMusic)', () => {
  it('returns valid chord definitions for standard open chords', () => {
    const cChord = FretlyMusic.getChord('C');
    expect(cChord).not.toBeUndefined();
    expect(cChord?.name).toBe('C Major');
    expect(cChord?.fingerings.length).toBe(6);

    const rootFingering = cChord?.fingerings.find(f => f.isRoot);
    expect(rootFingering).not.toBeUndefined();
    expect(rootFingering?.text).toBe('C');
  });

  it('returns valid chord definitions for minor and barre chords', () => {
    const amChord = FretlyMusic.getChord('Am');
    expect(amChord).not.toBeUndefined();

    const bmChord = FretlyMusic.getChord('Bm');
    expect(bmChord).not.toBeUndefined();
    expect(bmChord?.name).toBe('B Minor');
  });

  it('returns undefined for unknown chord names', () => {
    const unknown = FretlyMusic.getChord('NonExistentChord');
    expect(unknown).toBeUndefined();
  });

  it('lists all available chords in the catalog', () => {
    const chords = FretlyMusic.listChords();
    expect(chords.length).toBeGreaterThanOrEqual(10);
  });

  it('feeds catalog fingerings into Fretboard renderer independently with zero coupling', () => {
    const chord = FretlyMusic.getChord('C');
    expect(chord).not.toBeUndefined();

    const fretboard = new Fretboard({
      fingerings: chord?.fingerings
    });

    const svg = fretboard.render();
    expect(svg).not.toBeNull();
    expect(svg.querySelectorAll('.fretly-fingering').length).toBe(6);
  });
});
