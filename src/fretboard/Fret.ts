/**
 * Fret class representing a single fret wire
 * 
 * Each Fret instance represents one of the metal fret wires on a guitar/bass fretboard,
 * with properties for its position and visual thickness.
 */

import type { Fret as FretInterface } from './types';

/**
 * Represents a single fret wire with position and thickness
 * 
 * Frets are numbered from 1 (first fret) to N (last fret), with the nut implicitly
 * at position 0.
 */
export class Fret implements FretInterface {
  /** Zero-based fret index (1 to fretCount, v1 excludes nut at 0) */
  readonly index: number;
  
  /** X coordinate */
  readonly x: number;
  
  /** Y coordinate (used in vertical orientation) */
  readonly y: number;
  
  /** Visual thickness in pixels */
  readonly thickness: number;

  /**
   * Creates a new Fret instance
   * 
   * @param index - One-based fret index (1 to fretCount)
   * @param x - X coordinate for horizontal orientation, or placeholder for vertical
   * @param thickness - Visual thickness in pixels
   * 
   * @example
   * ```typescript
   * // Create the first fret
   * const firstFret = new Fret(1, 0, 2);
   * ```
   */
  constructor(index: number, x: number, thickness: number, y: number = 0) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.thickness = thickness;
  }

  /**
   * Returns the center X position for horizontal orientation
   * 
   * @returns number - The horizontal center position of the fret
   */
  getCenterX(): number {
    return this.x + this.thickness / 2;
  }

  /**
   * Returns the center Y position for vertical orientation
   * 
   * @returns number - The vertical center position of the fret
   */
  getCenterY(): number {
    return this.y + this.thickness / 2;
  }

  /**
   * Returns the fret position as an object
   * 
   * @returns {x: number, y: number} - The x and y coordinates of the fret
   */
  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  /**
   * Checks if this is the first fret
   * 
   * @returns boolean - true if this is fret 1, false otherwise
   */
  isFirst(): boolean {
    return this.index === 1;
  }

  /**
   * Checks if this is the last fret in a given count
   * 
   * @param fretCount - The total number of frets to check against
   * @returns boolean - true if this fret index equals the fretCount, false otherwise
   */
  isLast(fretCount: number): boolean {
    return this.index === fretCount;
  }
}
