/**
 * Fretboard class - Main class for rendering guitar fretboards as SVG
 * 
 * The Fretboard class is the primary entry point for the Fretly library.
 * It handles the creation and rendering of guitar/bass fretboards with configurable
 * options including string count, fret count, orientation, and visual styling.
 * 
 * @example
 * ```typescript
 * // Create a standard 6-string guitar fretboard
 * const fretboard = new Fretboard();
 * const svg = fretboard.render();
 * document.body.appendChild(svg);
 * 
 * // Create a 4-string bass in vertical orientation
 * const bassFretboard = new Fretboard({
 *   stringCount: 4,
 *   fretCount: 24,
 *   orientation: 'vertical'
 * });
 * ```
 */

import type { FretboardOptions, Position, PNGExportOptions } from './types';
import { exportSvgToPngBlob, exportSvgToPngDataUrl, triggerPngDownload } from '../utils/export';
import { Marker } from './Marker';
import { String } from './String';
import { Fret } from './Fret';
import { Inlay } from './Inlay';
import { Fingering } from './Fingering';
import { SvgRenderer } from '../renderers/svg';
import {
  DEFAULT_FRET_COUNT,
  DEFAULT_STRING_COUNT,
  DEFAULT_ORIENTATION,
  DEFAULT_STRING_SPACING,
  DEFAULT_STRING_THICKNESS,
  DEFAULT_STRING_COLOR,
  DEFAULT_FRET_SPACING,
  DEFAULT_FRET_THICKNESS,
  DEFAULT_SHOW_INLAYS,
  DEFAULT_INLAY_POSITIONS,
  DEFAULT_START_FRET,
  DEFAULT_TITLE,
  DEFAULT_TITLE_ALIGNMENT
} from './constants';
import { validateOptions } from '../utils/validation';
import {
  getHorizontalStringY,
  getHorizontalFretX,
  getVerticalStringX,
  getVerticalFretY,
  getHorizontalMarkerPosition,
  getVerticalMarkerPosition,
  getHorizontalFretPosition,
  getHorizontalStringPosition,
  getVerticalFretPosition,
  getVerticalStringPosition,
  calculateHorizontalWidth,
  calculateHorizontalHeight,
  calculateVerticalWidth,
  calculateVerticalHeight
} from '../utils/geometry';

// Re-export types for convenience
export type { FretboardOptions };

/**
 * Main Fretboard class for rendering guitar necks as SVG
 * 
 * Provides methods for creating, configuring, and rendering fretboards,
 * as well as querying positions for strings, frets, and markers.
 */
export class Fretboard {
  /** Configuration options */
  private readonly options: Required<FretboardOptions>;

  /** SVG renderer instance responsible for creating SVG elements */
  private readonly renderer: SvgRenderer;

  /** Cached string objects representing the guitar/bass strings */
  private strings: String[] = [];

  /** Cached fret objects representing the fret wires */
  private frets: Fret[] = [];

  /** Cached inlay objects for fret position markers */
  private inlays: Inlay[] = [];

  /** Custom marker objects added by users */
  private markers: Marker[] = [];

  /** Fingering markers added by users */
  private fingerings: Fingering[] = [];

  /** Cached SVG element to avoid re-rendering */
  private svgCache?: SVGSVGElement;

  /**
   * Creates a new Fretboard instance
   * 
   * @param options - Partial configuration options. Missing values use library defaults.
   * @throws RangeError if any option value is outside valid ranges
   */
  constructor(options: Partial<FretboardOptions> = {}) {
    // Merge options with defaults (startFret: 0 is treated as 1)
    const effectiveStartFret = options.startFret === 0 ? 1 : (options.startFret ?? DEFAULT_START_FRET);
    this.options = {
      fretCount: DEFAULT_FRET_COUNT,
      stringCount: DEFAULT_STRING_COUNT,
      orientation: DEFAULT_ORIENTATION,
      stringSpacing: DEFAULT_STRING_SPACING,
      stringThickness: DEFAULT_STRING_THICKNESS,
      stringColor: DEFAULT_STRING_COLOR,
      fretSpacing: DEFAULT_FRET_SPACING,
      fretThickness: DEFAULT_FRET_THICKNESS,
      inlayPositions: [...DEFAULT_INLAY_POSITIONS],
      showInlays: DEFAULT_SHOW_INLAYS,
      title: options.title ?? DEFAULT_TITLE,
      titleAlignment: DEFAULT_TITLE_ALIGNMENT,
      titleOffsetY: options.titleOffsetY ?? 0,
      reserveNutClearance: options.reserveNutClearance ?? true,
      tuning: options.tuning ?? [],
      fingerings: [],
      zones: [],
      ...options,
      startFret: effectiveStartFret
    };

    // Validate all provided options
    validateOptions(this.options);

    // Initialize fingerings
    this.fingerings = (this.options.fingerings || []).map(f => new Fingering(f));

    // Initialize renderer
    this.renderer = new SvgRenderer(this.options);

    // Initialize geometry
    this.initializeGeometry();
  }

  /**
   * Initializes strings, frets, and inlays based on configuration
   */
  private initializeGeometry(): void {
    this.initializeStrings();
    this.initializeFrets();
    this.initializeInlays();
    this.svgCache = undefined; // Invalidate cache
  }

  /**
   * Creates string objects with positions
   */
  private initializeStrings(): void {
    this.strings = [];
    const isHorizontal = this.options.orientation === 'horizontal';

    for (let i = 0; i < this.options.stringCount; i++) {
      if (isHorizontal) {
        const y = getHorizontalStringY(i, this.options.stringSpacing);
        const str = new String(
          i,
          y,
          this.options.stringThickness * (i + 1), // Vary thickness for visual effect
          this.options.stringCount
        );
        this.strings.push(str);
      } else {
        const x = getVerticalStringX(i, this.options.stringSpacing, this.options.stringCount);
        const str = new String(
          i,
          0, // y not used in vertical orientation
          this.options.stringThickness * (i + 1), // Vary thickness for visual effect
          this.options.stringCount,
          x
        );
        this.strings.push(str);
      }
    }
  }

  /**
   * Creates fret objects with positions
   * Note: We create fretCount + 1 frets to form a complete rectangle
   * (e.g., 12 frets = 13 fret lines including start and end)
   */
  private initializeFrets(): void {
    this.frets = [];
    const isHorizontal = this.options.orientation === 'horizontal';
    const totalFrets = this.options.fretCount + 1; // +1 for the end fret line
    const startFret = this.options.startFret;

    for (let i = 1; i <= totalFrets; i++) {
      const fretIndex = startFret + i - 1;
      if (isHorizontal) {
        const x = getHorizontalFretX(i, this.options.fretSpacing);
        const fret = new Fret(fretIndex, x, this.options.fretThickness);
        this.frets.push(fret);
      } else {
        const y = getVerticalFretY(i, this.options.fretSpacing);
        const fret = new Fret(fretIndex, 0, this.options.fretThickness, y);
        this.frets.push(fret);
      }
    }
  }

  /**
   * Creates inlay objects at specified positions
   */
  private initializeInlays(): void {
    this.inlays = [];
    const isHorizontal = this.options.orientation === 'horizontal';
    const inlayOffset = 20; // Base space for inlay numbers
    const startFret = this.options.startFret;
    const endFret = startFret + this.options.fretCount - 1;

    for (const fretNumber of this.options.inlayPositions) {
      if (fretNumber < startFret || fretNumber > endFret) continue;

      const relativePos = fretNumber - startFret + 1;

      if (isHorizontal) {
        // Horizontal: inlays below the fretboard, centered between fret lines
        // Position between fret lines, same as fingerings
        const x = (relativePos - 0.5) * this.options.fretSpacing + 
                  this.options.fretThickness / 2;
        const height = calculateHorizontalHeight(
          this.options.stringCount,
          this.options.stringSpacing,
          this.options.stringThickness
        );
        // Account for the extra thickness of the bottom string (varying thickness)
        // The bottom string has thickness = stringThickness * stringCount, but
        // calculateHorizontalHeight only uses base stringThickness
        const bottomStringExtraThickness = this.options.stringThickness * (this.options.stringCount - 1);
        const y = height + bottomStringExtraThickness + inlayOffset;
        this.inlays.push(new Inlay(fretNumber, x, y, 'below'));
      } else {
        // Account for the extra thickness of the leftmost string in vertical mode
        const leftStringExtraThickness = this.options.stringThickness * (this.options.stringCount - 1);
        const x = -(inlayOffset + leftStringExtraThickness);
        // Position inlay between fret lines, same as fingerings
        const y = (relativePos - 0.5) * this.options.fretSpacing + 
                  this.options.fretThickness / 2;
        this.inlays.push(new Inlay(fretNumber, x, y, 'left'));
      }
    }
  }

  /**
   * Renders the fretboard as an SVG element
   * 
   * Creates and returns an SVG representation of the fretboard based on the current
   * configuration. Results are cached for performance, so subsequent calls return
   * the same SVG element until the fretboard is modified.
   * 
   * @returns SVGSVGElement - The rendered fretboard as an SVG element
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard();
   * const svg = fretboard.render();
   * document.getElementById('container').appendChild(svg);
   * ```
   */
  render(): SVGSVGElement {
    if (this.svgCache) {
      return this.svgCache;
    }

    this.svgCache = this.renderer.render(
      this.strings,
      this.frets,
      this.inlays,
      this.markers,
      this.fingerings
    );

    return this.svgCache;
  }

  /**
   * Exports the rendered fretboard as a PNG Blob
   * 
   * @param options - PNG export options (scale factor, quality)
   * @returns Promise resolving to PNG Blob
   */
  async toPNGBlob(options?: PNGExportOptions): Promise<Blob> {
    const svg = this.render();
    return exportSvgToPngBlob(svg, options);
  }

  /**
   * Exports the rendered fretboard as a PNG Data URL string
   * 
   * @param options - PNG export options (scale factor, quality)
   * @returns Promise resolving to PNG Data URL string
   */
  async toPNGDataURL(options?: PNGExportOptions): Promise<string> {
    const svg = this.render();
    return exportSvgToPngDataUrl(svg, options);
  }

  /**
   * Triggers a browser file download of the rendered fretboard as a PNG file
   * 
   * @param filename - Destination filename for the download (default: 'fretboard.png')
   * @param options - PNG export options (scale factor, quality)
   */
  async downloadPNG(filename = 'fretboard.png', options?: PNGExportOptions): Promise<void> {
    const blob = await this.toPNGBlob(options);
    triggerPngDownload(blob, filename);
  }

  /**
   * Returns the coordinates for a specific fret
   * 
   * @param fretIndex - The 1-based index of the fret (1 to fretCount)
   * @returns Position - The {x, y} coordinates of the fret
   * @throws RangeError if fretIndex is outside valid range
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard();
   * const position = fretboard.getFretPosition(5); // 5th fret position
   * ```
   */
  getFretPosition(fretIndex: number): Position {
    if (fretIndex < 1 || fretIndex > this.options.fretCount) {
      throw new RangeError(
        `fretIndex must be between 1 and ${this.options.fretCount}, got ${fretIndex}`
      );
    }

    const isHorizontal = this.options.orientation === 'horizontal';

    if (isHorizontal) {
      return getHorizontalFretPosition(
        fretIndex,
        this.options.fretSpacing,
        calculateHorizontalHeight(
          this.options.stringCount,
          this.options.stringSpacing,
          this.options.stringThickness
        )
      );
    } else {
      return getVerticalFretPosition(
        fretIndex,
        this.options.fretSpacing,
        calculateVerticalWidth(
          this.options.stringCount,
          this.options.stringSpacing,
          this.options.stringThickness
        )
      );
    }
  }

  /**
   * Returns the coordinates for a specific string
   * 
   * @param stringIndex - The 0-based index of the string (0 to stringCount-1)
   * @returns Position - The {x, y} coordinates of the string
   * @throws RangeError if stringIndex is outside valid range
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard();
   * const position = fretboard.getStringPosition(0); // High E string position
   * ```
   */
  getStringPosition(stringIndex: number): Position {
    if (stringIndex < 0 || stringIndex >= this.options.stringCount) {
      throw new RangeError(
        `stringIndex must be between 0 and ${this.options.stringCount - 1}, got ${stringIndex}`
      );
    }

    const isHorizontal = this.options.orientation === 'horizontal';

    if (isHorizontal) {
      return getHorizontalStringPosition(
        stringIndex,
        this.options.stringSpacing,
        calculateHorizontalWidth(
          this.options.fretCount,
          this.options.fretSpacing
        )
      );
    } else {
      return getVerticalStringPosition(
        stringIndex,
        this.options.stringSpacing,
        calculateVerticalHeight(
          this.options.fretCount,
          this.options.fretSpacing
        ),
        this.options.stringCount
      );
    }
  }

  /**
   * Returns the coordinates for placing a marker at a specific fret/string intersection
   * 
   * @param fretIndex - The 1-based index of the fret (1 to fretCount)
   * @param stringIndex - The 0-based index of the string (0 to stringCount-1)
   * @returns Position - The {x, y} coordinates for placing a marker
   * @throws RangeError if fretIndex or stringIndex are outside valid ranges
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard();
   * const position = fretboard.getMarkerPosition(5, 2); // 5th fret, 3rd string
   * ```
   */
  getMarkerPosition(fretIndex: number, stringIndex: number): Position {
    if (fretIndex < 1 || fretIndex > this.options.fretCount) {
      throw new RangeError(
        `fretIndex must be between 1 and ${this.options.fretCount}, got ${fretIndex}`
      );
    }
    if (stringIndex < 0 || stringIndex >= this.options.stringCount) {
      throw new RangeError(
        `stringIndex must be between 0 and ${this.options.stringCount - 1}, got ${stringIndex}`
      );
    }

    const isHorizontal = this.options.orientation === 'horizontal';

    if (isHorizontal) {
      return getHorizontalMarkerPosition(
        fretIndex,
        stringIndex,
        this.options.fretSpacing,
        this.options.stringSpacing
      );
    } else {
      return getVerticalMarkerPosition(
        fretIndex,
        stringIndex,
        this.options.fretSpacing,
        this.options.stringSpacing,
        this.options.stringCount
      );
    }
  }

  /**
   * Adds a custom marker to the fretboard
   * 
   * Creates a marker at the specified fret/string position and adds it to the fretboard.
   * The marker will be rendered when the fretboard is next rendered.
   * 
   * @param fretIndex - The 1-based index of the fret (1 to fretCount)
   * @param stringIndex - The 0-based index of the string (0 to stringCount-1)
   * @param options - Optional marker styling options (color, size, etc.)
   * @returns Marker - The created marker instance
   * @throws RangeError if fretIndex or stringIndex are outside valid ranges
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard();
   * const marker = fretboard.addMarker(5, 2, {
   *   color: 'red',
   *   size: 8
   * });
   * ```
   */
  addMarker(
    fretIndex: number,
    stringIndex: number,
    options: Partial<Marker['options']> = {}
  ): Marker {
    if (fretIndex < 1 || fretIndex > this.options.fretCount) {
      throw new RangeError(
        `fretIndex must be between 1 and ${this.options.fretCount}, got ${fretIndex}`
      );
    }
    if (stringIndex < 0 || stringIndex >= this.options.stringCount) {
      throw new RangeError(
        `stringIndex must be between 0 and ${this.options.stringCount - 1}, got ${stringIndex}`
      );
    }

    const marker = new Marker(fretIndex, stringIndex, options);
    this.markers.push(marker);
    this.svgCache = undefined; // Invalidate cache
    return marker;
  }

  /**
   * Removes a marker by ID
   * 
   * @param id - The unique identifier of the marker to remove
   * @returns boolean - true if marker was found and removed, false otherwise
   * 
   * @example
   * ```typescript
   * const marker = fretboard.addMarker(5, 2);
   * fretboard.removeMarker(marker.id);
   * ```
   */
  removeMarker(id: string): boolean {
    const index = this.markers.findIndex(m => m.id === id);
    if (index === -1) {
      return false;
    }
    this.markers.splice(index, 1);
    this.svgCache = undefined; // Invalidate cache
    return true;
  }

  /**
   * Clears all markers from the fretboard
   * 
   * @example
   * ```typescript
   * fretboard.clearMarkers();
   * ```
   */
  clearMarkers(): void {
    this.markers = [];
    this.svgCache = undefined; // Invalidate cache
  }

  /**
   * Returns all markers on the fretboard
   * 
   * @returns Marker[] - Array of all marker instances
   * 
   * @example
   * ```typescript
   * const markers = fretboard.getMarkers();
   * markers.forEach(marker => console.log(marker.fretIndex, marker.stringIndex));
   * ```
   */
  getMarkers(): Marker[] {
    return [...this.markers];
  }

  /**
   * Returns all fingering markers on the fretboard
   * 
   * @returns Fingering[] - Array of all fingering instances
   */
  getFingerings(): Fingering[] {
    return [...this.fingerings];
  }

  /**
   * Returns the current configuration options
   * 
   * @returns Required<FretboardOptions> - Complete configuration with all defaults applied
   * 
   * @example
   * ```typescript
   * const options = fretboard.getOptions();
   * console.log(options.fretCount, options.stringCount);
   * ```
   */
  getOptions(): Required<FretboardOptions> {
    return { ...this.options };
  }

  /**
   * Returns the starting fret configured for this fretboard
   */
  get startFret(): number {
    return this.options.startFret;
  }

  /**
   * Returns the number of frets configured for this fretboard
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard({ fretCount: 24 });
   * console.log(fretboard.fretCount); // 24
   * ```
   */
  get fretCount(): number {
    return this.options.fretCount;
  }

  /**
   * Returns the number of strings configured for this fretboard
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard({ stringCount: 7 });
   * console.log(fretboard.stringCount); // 7
   * ```
   */
  get stringCount(): number {
    return this.options.stringCount;
  }

  /**
   * Returns the current orientation of the fretboard
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard({ orientation: 'vertical' });
   * console.log(fretboard.orientation); // 'vertical'
   * ```
   */
  get orientation(): 'horizontal' | 'vertical' {
    return this.options.orientation;
  }

  /**
   * Invalidates the SVG cache
   * 
   * Call this method after making external modifications to force a re-render
   * of the fretboard SVG on the next call to render().
   * 
   * @example
   * ```typescript
   * const fretboard = new Fretboard();
   * // After modifying something externally
   * fretboard.invalidateCache();
   * const freshSvg = fretboard.render();
   * ```
   */
  invalidateCache(): void {
    this.svgCache = undefined;
  }
}
