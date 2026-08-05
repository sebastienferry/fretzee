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
  
  /** Distance between fret centers in pixels */
  fretSpacing?: number;
  
  /** Visual thickness of frets in pixels */
  fretThickness?: number;
  
  /** Which fret numbers to display as inlays */
  inlayPositions?: number[];
  
  /** Whether to display inlay numbers */
  showInlays?: boolean;

  /** Fingering markers to render on the fretboard */
  fingerings?: Fingering[];
}

/**
 * Representation of a fingering marker on the fretboard
 */
export interface Fingering {
  /** String index (1-based, 1 = top string) */
  string: number;

  /** Fret number (0 = open string, 1..N = fretted position) */
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
