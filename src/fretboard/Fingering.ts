/**
 * Fingering class representing a finger position marker on the fretboard
 */

import type { Fingering as FingeringInterface } from './types';
import { DEFAULT_FINGERING_COLOR, DEFAULT_FINGERING_TEXT_COLOR, CSS_CLASSES } from './constants';

/**
 * Represents a fingering marker on the fretboard
 */
export class Fingering implements FingeringInterface {
  /** 1-indexed string position (1 = top string) */
  readonly string: number;

  /** Fret number (0 = open string, 1..N = fretted position) */
  readonly fret: number;

  /** Text displayed inside the marker circle */
  readonly text: string;

  /** HTML/CSS fill color for circle background */
  readonly color: string;

  /** HTML/CSS fill color for text inside circle */
  readonly textColor: string;

  /**
   * Creates a new Fingering instance
   * 
   * @param options - Fingering parameters
   */
  constructor(options: FingeringInterface) {
    this.string = options.string;
    this.fret = options.fret;
    this.text = options.text ?? (options.fret === -1 ? 'X' : (options.fret === 0 ? 'O' : ''));
    this.color = options.color && options.color.trim() !== '' ? options.color : DEFAULT_FINGERING_COLOR;
    const defaultTextColor = options.fret === -1 ? '#000000' : DEFAULT_FINGERING_TEXT_COLOR;
    this.textColor = options.textColor && options.textColor.trim() !== '' ? options.textColor : defaultTextColor;
  }

  /**
   * Returns the CSS class for this fingering element group
   */
  getCssClass(): string {
    return CSS_CLASSES.fingering(this.string, this.fret);
  }
}
