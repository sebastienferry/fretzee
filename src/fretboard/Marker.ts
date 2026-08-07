/**
 * Marker class representing a custom marker on the fretboard
 */

import type { Marker as MarkerInterface, MarkerOptions, Position } from './types';

/**
 * Generates a unique ID for markers
 */
let markerIdCounter = 0;
function generateId(): string {
  return `fretzee-marker-${++markerIdCounter}`;
}

/**
 * Represents a custom marker that can be added to the fretboard
 */
export class Marker implements MarkerInterface {
  /** Unique identifier */
  readonly id: string;
  
  /** Fret position (1-based) */
  readonly fretIndex: number;
  
  /** String position (0-based) */
  readonly stringIndex: number;
  
  /** Marker options */
  readonly options: MarkerOptions;

  /**
   * Creates a new Marker instance
   * @param fretIndex - 1-based fret position
   * @param stringIndex - 0-based string position
   * @param options - Marker styling/behavior options
   * @param id - Optional custom ID (auto-generated if not provided)
   */
  constructor(
    fretIndex: number,
    stringIndex: number,
    options: MarkerOptions = {},
    id?: string
  ) {
    this.id = id ?? generateId();
    this.fretIndex = fretIndex;
    this.stringIndex = stringIndex;
    this.options = {
      color: '#ff0000',
      shape: 'circle',
      size: 4,
      ...options
    };
  }

  /**
   * Returns the marker's position based on fretboard geometry
   * Note: Actual coordinates are calculated by Fretboard class
   */
  getPosition(): Position {
    // Position will be calculated by Fretboard based on fretIndex and stringIndex
    return { x: 0, y: 0 };
  }

  /**
   * Returns whether this marker is at a specific position
   */
  isAt(fretIndex: number, stringIndex: number): boolean {
    return this.fretIndex === fretIndex && this.stringIndex === stringIndex;
  }

  /**
   * Returns CSS class name for this marker
   */
  getCssClass(): string {
    return `fretzee-marker fretzee-marker-${this.id}`;
  }

  /**
   * Updates marker options
   */
  update(options: Partial<MarkerOptions>): Marker {
    return new Marker(
      this.fretIndex,
      this.stringIndex,
      { ...this.options, ...options },
      this.id
    );
  }

  /**
   * Resets the marker ID counter (for testing)
   */
  static resetIdCounter(): void {
    markerIdCounter = 0;
  }
}
