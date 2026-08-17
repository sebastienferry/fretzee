/**
 * String class representing a single guitar string
 * 
 * Each String instance represents one of the strings on a guitar or bass fretboard,
 * with properties for its visual position, thickness, and tuning note.
 */

import type { String as StringInterface } from './types';
import { STANDARD_TUNING } from './constants';

/**
 * Represents a single guitar string with position and thickness
 * 
 * Strings are indexed from 0 (high E, thinnest) to N-1 (low E, thickest) following
 * standard guitar tuning conventions.
 */
export class String implements StringInterface {
  /** Zero-based string index (0 = highest/thinnest) */
  readonly index: number;
  
  /** Standard tuning note (E, B, G, D, A, E) */
  readonly tuningNote?: string;
  
  /** X coordinate */
  readonly x: number;
  
  /** Y coordinate (used in horizontal orientation) */
  readonly y: number;
  
  /** Visual thickness in pixels */
  readonly thickness: number;

  /**
   * Creates a new String instance
   * 
   * @param index - Zero-based string index (0 = high E, thinnest string)
   * @param y - Y coordinate for horizontal orientation, or placeholder for vertical
   * @param thickness - Visual thickness in pixels
   * @param stringCount - Total number of strings (for tuning note assignment)
   * 
   * @example
   * ```typescript
   * // Create a string for horizontal orientation
   * const highE = new String(0, 0, 1, 6); // High E string at y=0
   * ```
   */
  constructor(
    index: number,
    y: number,
    thickness: number,
    stringCount: number = 6,
    x: number = 0
  ) {
    this.index = index;
    this.y = y;
    this.thickness = thickness;
    this.x = x;
    
    // Assign tuning note if within standard 6-string range
    if (index < STANDARD_TUNING.length && index < stringCount) {
      this.tuningNote = STANDARD_TUNING[index];
    }
  }

  /**
   * Returns the center Y position for horizontal orientation
   * 
   * @returns number - The vertical center position of the string
   */
  getCenterY(): number {
    return this.y + this.thickness / 2;
  }

  /**
   * Returns the center X position for vertical orientation
   * 
   * @returns number - The horizontal center position of the string
   */
  getCenterX(): number {
    return this.x + this.thickness / 2;
  }

  /**
   * Returns the string position as an object
   * 
   * @returns {x: number, y: number} - The x and y coordinates of the string
   */
  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  /**
   * Returns the tuning note for this string
   * 
   * @returns string | undefined - The standard tuning note (e.g., "E", "B", "G", "D", "A", "E")
   * or undefined if the string index is outside the standard 6-string range
   * 
   * @example
   * ```typescript
   * const string = new String(0, 0, 1, 6); // High E string
   * console.log(string.getNote()); // "E"
   * ```
   */
  getNote(): string | undefined {
    return this.tuningNote;
  }
}
