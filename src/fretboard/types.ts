/**
 * Type definitions for Fretboard Renderer Library
 */

/**
 * Configuration options for creating a Fretboard instance
 */
export interface FretboardOptions {
  /** Number of frets to display (4-16) */
  fretCount?: number;
  
  /** Number of strings (4-8) */
  stringCount?: number;
  
  /** Layout direction: 'horizontal' or 'vertical' */
  orientation?: 'horizontal' | 'vertical';
  
  /** Distance between string centers in pixels */
  stringSpacing?: number;
  
  /** Visual thickness of strings in pixels */
  stringThickness?: number;

  /** Color of strings: single global color string (e.g. '#6b7280') or an array per string (low E to high E or 1st to Nth) */
  stringColor?: string | string[];
  
  /** Distance between fret centers in pixels */
  fretSpacing?: number;
  
  /** Visual thickness of frets in pixels */
  fretThickness?: number;
  
  /** Which fret numbers to display as inlays */
  inlayPositions?: number[];
  
  /** Whether to display inlay numbers */
  showInlays?: boolean;

  /** Starting fret number to display (0-24, default: 1). 0 is treated as 1. */
  startFret?: number;

  /** Optional diagram title displayed above the fretboard */
  title?: string;

  /** Title alignment: 'center' or 'left' (default: 'center') */
  titleAlignment?: 'center' | 'left';

  /** Optional vertical offset in pixels to shift title higher/lower (e.g. -10 for higher) */
  titleOffsetY?: number;

  /** Optional tuning note labels ordered from lowest string (6th string) to highest (1st string) */
  tuning?: string[];

  /** Whether to render tuning note labels (default: true if tuning is provided) */
  showTuning?: boolean;

  /**
   * Whether to reserve headstock clearance before the nut for open strings (fret 0) and muted strings (fret -1).
   * - `true` (default): Expands the headstock clearance for fret 0 / X markers.
   * - `false`: Tight margins at the nut edge.
   */
  reserveNutClearance?: boolean;

  /** Whether to render transparent color-coded debug bounding boxes for Fret 0 (Blue) and Tuning (Red) zones */
  debugZones?: boolean;

  /** Fingering markers to render on the fretboard */
  fingerings?: Fingering[];

  /** Highlighted regions/zones (e.g. triads, scale shapes, CAGED forms) */
  zones?: Zone[];
}

/**
 * Definition of a highlighted region/zone on the fretboard
 */
export interface Zone {
  /** Zone shape type: 'box' (default bounding box), 'hull' (convex polygon), 'path' (line sequence), or 'brace' (curly brace accolade) */
  type?: 'box' | 'hull' | 'path' | 'brace';

  /** Starting string for box shape (1-based, e.g. 1 for High E) */
  startString?: number;

  /** Ending string for box shape (1-based, e.g. 3 for G string) */
  endString?: number;

  /** Starting fret number for box shape */
  startFret?: number;

  /** Ending fret number for box shape */
  endFret?: number;

  /** Array of point positions [{ string: 1, fret: 2 }, ...] to enclose with a hull or connect with a path */
  points?: Array<{ string: number; fret: number }>;

  /** Fill background color of the zone (e.g. 'rgba(56, 189, 248, 0.15)') */
  fillColor?: string;

  /** Stroke border color of the zone (e.g. '#38bdf8') */
  strokeColor?: string;

  /** Stroke style preset: 'solid' (default), 'dashed', or 'dotted' */
  strokeStyle?: 'solid' | 'dashed' | 'dotted';

  /** Optional vertical offset in pixels to slide/stack the zone or brace higher or lower (e.g. 0, 15, 30) */
  offsetY?: number;

  /** Placement side for brace/accolade: 'top' (default: top in horizontal, right in vertical) or 'bottom' (bottom in horizontal, left in vertical) */
  position?: 'top' | 'bottom';

  /** Stroke dash pattern (e.g. '4 4' for custom dashed outline) */
  strokeDashArray?: string;

  /** Stroke width of the zone outline/path (optional custom width in pixels) */
  strokeWidth?: number;

  /** Corner radius for the zone rectangle (default: 8) */
  borderRadius?: number;

  /** Optional text label to display on or next to the zone (e.g. 'D Form Triad') */
  label?: string;

  /** Font size in pixels for the zone label (default: 11) */
  labelFontSize?: number;

  /** Font weight for the zone label (e.g. 'normal', 'bold', '600', '800', default: 'bold') */
  labelFontWeight?: string;

  /** Optional horizontal offset in pixels to adjust the zone label/title X position (e.g. -10, 15) */
  labelOffsetX?: number;

  /** Optional vertical offset in pixels to adjust the zone label/title Y position (e.g. -5, 20) */
  labelOffsetY?: number;

  /** Alias for labelOffsetX */
  titleOffsetX?: number;

  /** Alias for labelOffsetY */
  titleOffsetY?: number;
}

/**
 * Options for exporting fretboard SVG as PNG
 */
export interface PNGExportOptions {
  /** Scaling multiplier for high DPI / Retina export (default: 2) */
  scale?: number;

  /** Quality factor between 0.0 and 1.0 (default: 1.0) */
  quality?: number;
}

/**
 * Representation of a fingering marker on the fretboard
 */
export interface Fingering {
  /** String index (1-based, 1 = top string) */
  string: number;

  /** Fret number (-1 = muted/unplayed string 'X', 0 = open string, 1..N = fretted position) */
  fret: number;

  /** Optional text to display inside the marker circle */
  text?: string;

  /** Optional HTML/CSS background fill color for the circle (default: 'black') */
  color?: string;

  /** Optional HTML/CSS font color for text inside the circle (default: 'white') */
  textColor?: string;
}

/**
 * 2D coordinate representation
 */
export interface Position {
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

/**
 * Options for custom markers
 */
export interface MarkerOptions {
  /** Marker color (CSS color value) */
  color?: string;
  /** Marker shape: 'circle', 'square', 'dot', etc. */
  shape?: string;
  /** Marker size in pixels */
  size?: number;
  /** Custom CSS classes */
  className?: string;
  /** Additional data attached to marker */
  data?: Record<string, unknown>;
}

/**
 * Represents a marker on the fretboard
 */
export interface Marker {
  /** Unique identifier */
  id: string;
  /** Fret position (1-based) */
  fretIndex: number;
  /** String position (0-based) */
  stringIndex: number;
  /** Marker options */
  options: MarkerOptions;
}

/**
 * Represents a guitar string
 */
export interface String {
  /** Zero-based string index (0 = highest/thinnest) */
  index: number;
  /** Standard tuning note (E, B, G, D, A, E) */
  tuningNote?: string;
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Visual thickness */
  thickness: number;
}

/**
 * Represents a fret wire
 */
export interface Fret {
  /** Zero-based fret index (1 to fretCount, v1 excludes nut at 0) */
  index: number;
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Visual thickness */
  thickness: number;
}

/**
 * Represents a position marker displaying the fret number
 */
export interface Inlay {
  /** The fret number to display */
  fretNumber: number;
  /** Text to display */
  label: string;
  /** X coordinate for label */
  x: number;
  /** Y coordinate for label */
  y: number;
  /** Position relative to fretboard */
  position: 'below' | 'left';
}
