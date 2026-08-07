/**
 * Inlay class representing a position marker displaying fret number
 */

import type { Inlay as InlayInterface } from './types';

/**
 * Represents a position marker displaying the fret number
 */
export class Inlay implements InlayInterface {
  /** The fret number to display */
  readonly fretNumber: number;
  
  /** Text to display */
  readonly label: string;
  
  /** X coordinate for label */
  readonly x: number;
  
  /** Y coordinate for label */
  readonly y: number;
  
  /** Position relative to fretboard */
  readonly position: 'below' | 'left';

  /**
   * Creates a new Inlay instance
   * @param fretNumber - The fret number to display
   * @param x - X coordinate for label
   * @param y - Y coordinate for label
   * @param position - Position relative to fretboard ('below' or 'left')
   * @param label - Optional custom label (defaults to fretNumber)
   */
  constructor(
    fretNumber: number,
    x: number,
    y: number,
    position: 'below' | 'left',
    label?: string
  ) {
    this.fretNumber = fretNumber;
    this.x = x;
    this.y = y;
    this.position = position;
    this.label = label ?? String(fretNumber);
  }

  /**
   * Returns position as object
   */
  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  /**
   * Returns whether this inlay is for a specific fret number
   */
  isForFret(fretNumber: number): boolean {
    return this.fretNumber === fretNumber;
  }

  /**
   * Returns CSS class name for this inlay
   */
  getCssClass(): string {
    return `fretzee-inlay fretzee-inlay-${this.fretNumber}`;
  }
}
