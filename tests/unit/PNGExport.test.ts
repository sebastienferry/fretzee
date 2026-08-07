import { Fretboard } from '../../src/fretboard/Fretboard';
import { exportSvgToPngBlob, exportSvgToPngDataUrl } from '../../src/utils/export';

describe('PNG Export Functionality', () => {
  it('throws a descriptive error in non-browser/node environments when window is undefined', async () => {
    const fretboard = new Fretboard();
    const originalWindow = global.window;

    // Temporarily undefine window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;

    await expect(fretboard.toPNGBlob()).rejects.toThrow(
      'PNG export requires a DOM environment with Canvas support.'
    );

    global.window = originalWindow;
  });

  it('provides exportSvgToPngBlob and exportSvgToPngDataUrl function signatures', () => {
    expect(typeof exportSvgToPngBlob).toBe('function');
    expect(typeof exportSvgToPngDataUrl).toBe('function');
  });

  it('exposes toPNGBlob, toPNGDataURL, and downloadPNG methods on Fretboard', () => {
    const fretboard = new Fretboard();
    expect(typeof fretboard.toPNGBlob).toBe('function');
    expect(typeof fretboard.toPNGDataURL).toBe('function');
    expect(typeof fretboard.downloadPNG).toBe('function');
  });
});
