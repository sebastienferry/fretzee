/**
 * Fretly - Guitar Fretboard Renderer Library
 * 
 * A lightweight library to render guitar fretboards as SVG
 * with configurable frets, strings, and orientation.
 */

export { Fretboard, type FretboardOptions } from './fretboard/Fretboard';
export { Fingering } from './fretboard/Fingering';
export type { Fingering as FingeringOptions } from './fretboard/types';
export type { Fingering as FingeringInterface } from './fretboard/types';
export type { Fingering as IFingering } from './fretboard/types';
export type { Position, MarkerOptions, Marker, PNGExportOptions } from './fretboard/types';
export { exportSvgToPngBlob, exportSvgToPngDataUrl, triggerPngDownload } from './utils/export';
