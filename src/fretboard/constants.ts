/**
 * Default configuration constants for Fretboard Renderer Library
 */

// Default values matching spec requirements
export const DEFAULT_FRET_COUNT = 12;
export const DEFAULT_STRING_COUNT = 6;
export const DEFAULT_ORIENTATION: 'horizontal' | 'vertical' = 'horizontal';
export const DEFAULT_STRING_SPACING = 30;
export const DEFAULT_STRING_THICKNESS = 1;
export const DEFAULT_FRET_SPACING = 60;
export const DEFAULT_FRET_THICKNESS = 3;
export const DEFAULT_SHOW_INLAYS = true;
export const DEFAULT_START_FRET = 1;
export const DEFAULT_TITLE_ALIGNMENT: 'center' | 'left' = 'center';
export const TITLE_FONT_SIZE = 16;
export const TITLE_PADDING = 8;

// Standard guitar inlay positions
export const DEFAULT_INLAY_POSITIONS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

// Default fingering styling
export const DEFAULT_FINGERING_COLOR = '#000000';
export const DEFAULT_FINGERING_TEXT_COLOR = '#ffffff';

// Validation ranges
export const MIN_FRET_COUNT = 4;
export const MAX_FRET_COUNT = 16;
export const MIN_STRING_COUNT = 4;
export const MAX_STRING_COUNT = 8;
export const MIN_START_FRET = 0;
export const MAX_START_FRET = 24;

// Standard guitar tuning (high E to low E)
export const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];

// SVG namespace
export const SVG_NS = 'http://www.w3.org/2000/svg';

// CSS class names
export const CSS_CLASSES = {
  root: 'fretly',
  title: 'fretly-title',
  frets: 'fretly-frets',
  strings: 'fretly-strings',
  inlays: 'fretly-inlays',
  markers: 'fretly-markers',
  fingerings: 'fretly-fingerings',
  startFretIndicator: 'fretly-start-fret',
  fret: (index: number) => `fretly-fret ${CSS_CLASSES.frets} fretly-fret-${index}`,
  string: (index: number) => `fretly-string ${CSS_CLASSES.strings} fretly-string-${index}`,
  inlay: (fretNumber: number) => `fretly-inlay ${CSS_CLASSES.inlays} fretly-inlay-${fretNumber}`,
  inlayDot: (fretNumber: number) => `fretly-inlay-dot ${CSS_CLASSES.inlays} fretly-inlay-dot-${fretNumber}`,
  fingering: (stringNum: number, fretNum: number) => `fretly-fingering ${CSS_CLASSES.fingerings} fretly-fingering-s${stringNum}-f${fretNum}`,
  fingeringCircle: 'fretly-fingering-circle',
  fingeringText: 'fretly-fingering-text',
  tuning: 'fretly-tuning',
  tuningLabel: 'fretly-tuning-label'
};

// Error messages
export const ERROR_MESSAGES = {
  FRET_COUNT_RANGE: (value: number) => 
    `fretCount must be between ${MIN_FRET_COUNT} and ${MAX_FRET_COUNT}, got ${value}`,
  STRING_COUNT_RANGE: (value: number) => 
    `stringCount must be between ${MIN_STRING_COUNT} and ${MAX_STRING_COUNT}, got ${value}`,
  START_FRET_RANGE: (value: number) =>
    `startFret must be between ${MIN_START_FRET} and ${MAX_START_FRET}, got ${value}`,
  INVALID_ORIENTATION: (value: string) => 
    `orientation must be 'horizontal' or 'vertical', got '${value}'`,
  INVALID_TITLE_ALIGNMENT: (value: string) =>
    `titleAlignment must be 'center' or 'left', got '${value}'`,
  POSITIVE_REQUIRED: (field: string) => `${field} must be a positive number`,
  NON_NEGATIVE_REQUIRED: (field: string) => `${field} must be a non-negative number`,
  FRET_INDEX_RANGE: (value: number, max: number) => 
    `fretIndex must be between 1 and ${max}, got ${value}`,
  STRING_INDEX_RANGE: (value: number, max: number) => 
    `stringIndex must be between 0 and ${max - 1}, got ${value}`
};
