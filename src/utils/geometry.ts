/**
 * Coordinate geometry utilities for Fretboard Renderer Library
 */

import type { Position } from '../fretboard/types';
import { DEFAULT_FRET_SPACING } from '../fretboard/constants';

/**
 * Calculate total width of fretboard in horizontal orientation
 * 
 * Computes the total width needed to display all frets horizontally.
 * Width is determined by fret count multiplied by fret spacing.
 * 
 * @param fretCount - Number of frets on the fretboard
 * @param fretSpacing - Pixel spacing between fret lines
 * @returns number - Total width in pixels
 * 
 * @example
 * ```typescript
 * const width = calculateHorizontalWidth(12, 60); // 720px for 12 frets at 60px spacing
 * ```
 */
export function calculateHorizontalWidth(
  fretCount: number,
  fretSpacing: number
): number {
  // Frets are at positions: 0, fretSpacing, fretSpacing*2, ..., fretSpacing*(fretCount-1)
  // Total width = last fret position + fretSpacing for end
  // But we want the width to cover all frets, so it's fretSpacing * fretCount
  // Actually: if we have N frets, there are N-1 gaps between them
  // Plus we need space before first and after last
  // For simplicity: total width = fretSpacing * fretCount
  return fretSpacing * fretCount;
}

/**
 * Calculate total height of fretboard in horizontal orientation
 * 
 * Computes the total height needed to display all strings vertically in horizontal orientation.
 * Height is determined by string count, spacing, and thickness.
 * 
 * @param stringCount - Number of strings on the fretboard
 * @param stringSpacing - Pixel spacing between string lines
 * @param stringThickness - Visual thickness of strings in pixels
 * @returns number - Total height in pixels
 * 
 * @example
 * ```typescript
 * const height = calculateHorizontalHeight(6, 30, 1); // 151px for 6 strings at 30px spacing
 * ```
 */
export function calculateHorizontalHeight(
  stringCount: number,
  stringSpacing: number,
  stringThickness: number
): number {
  // Strings are at positions: 0, stringSpacing, stringSpacing*2, ..., stringSpacing*(stringCount-1)
  // Total height = last string position + stringThickness
  return stringSpacing * (stringCount - 1) + stringThickness;
}

/**
 * Calculate total width of fretboard in vertical orientation
 * 
 * Computes the total width needed to display all strings horizontally in vertical orientation.
 * Width is determined by string count, spacing, and thickness.
 * 
 * @param stringCount - Number of strings on the fretboard
 * @param stringSpacing - Pixel spacing between string lines
 * @param stringThickness - Visual thickness of strings in pixels
 * @returns number - Total width in pixels
 * 
 * @example
 * ```typescript
 * const width = calculateVerticalWidth(6, 30, 1); // 151px for 6 strings at 30px spacing
 * ```
 */
export function calculateVerticalWidth(
  stringCount: number,
  stringSpacing: number,
  stringThickness: number
): number {
  // In vertical orientation, strings run horizontally
  return stringSpacing * (stringCount - 1) + stringThickness;
}

/**
 * Calculate total height of fretboard in vertical orientation
 * 
 * Computes the total height needed to display all frets vertically in vertical orientation.
 * Height is determined by fret count multiplied by fret spacing.
 * 
 * @param fretCount - Number of frets on the fretboard
 * @param fretSpacing - Pixel spacing between fret lines
 * @returns number - Total height in pixels
 * 
 * @example
 * ```typescript
 * const height = calculateVerticalHeight(24, 40); // 960px for 24 frets at 40px spacing
 * ```
 */
export function calculateVerticalHeight(
  fretCount: number,
  fretSpacing: number
): number {
  return fretSpacing * fretCount;
}

/**
 * Get string Y position for horizontal orientation
 * 
 * In horizontal orientation, strings are displayed top-to-bottom with the highest-pitched
 * string (high E) at the top and lowest-pitched string (low E) at the bottom.
 * 
 * @param stringIndex - Zero-based index of the string (0 = high E, N-1 = low E)
 * @param stringSpacing - Pixel spacing between strings
 * @returns number - The Y coordinate for the string in horizontal orientation
 * 
 * @example
 * ```typescript
 * // For a 6-string guitar in horizontal orientation
 * const highE_Y = getHorizontalStringY(0, 20); // 0 (topmost)
 * const lowE_Y = getHorizontalStringY(5, 20); // 100 (bottommost)
 * ```
 */
export function getHorizontalStringY(
  stringIndex: number,
  stringSpacing: number
): number {
  return stringIndex * stringSpacing;
}

/**
 * Get string X position for vertical orientation
 * 
 * In vertical orientation, strings are displayed left-to-right with the lowest-pitched
 * string (low E) on the left and highest-pitched string (high E) on the right, matching
 * the standard guitar neck layout when viewed vertically.
 * 
 * @param stringIndex - Zero-based index of the string (0 = high E, N-1 = low E)
 * @param stringSpacing - Pixel spacing between strings
 * @param stringCount - Total number of strings
 * @returns number - The X coordinate for the string in vertical orientation
 * 
 * @example
 * ```typescript
 * // For a 6-string guitar in vertical orientation
 * const lowE_X = getVerticalStringX(5, 20, 6); // 0 (leftmost)
 * const highE_X = getVerticalStringX(0, 20, 6); // 100 (rightmost)
 * ```
 */
export function getVerticalStringX(
  stringIndex: number,
  stringSpacing: number,
  stringCount: number
): number {
  // Reverse the order: low E (highest index) on left, high E (index 0) on right
  return (stringCount - 1 - stringIndex) * stringSpacing;
}

/**
 * Get fret X position for horizontal orientation
 * Fret 1 is at x=0, Fret 2 at x=fretSpacing, etc.
 */
export function getHorizontalFretX(
  fretIndex: number,
  fretSpacing: number
): number {
  return (fretIndex - 1) * fretSpacing;
}

/**
 * Get fret Y position for vertical orientation
 * Fret 1 is at y=0, Fret 2 at y=fretSpacing, etc.
 */
export function getVerticalFretY(
  fretIndex: number,
  fretSpacing: number
): number {
  return (fretIndex - 1) * fretSpacing;
}

/**
 * Get inlay X position for horizontal orientation (above fretboard)
 */
export function getHorizontalInlayX(
  fretIndex: number,
  fretSpacing: number
): number {
  return getHorizontalFretX(fretIndex, fretSpacing);
}

/**
 * Get inlay Y position for horizontal orientation (above fretboard)
 */
export function getHorizontalInlayY(
  stringCount: number,
  stringSpacing: number,
  inlayOffset: number = 20
): number {
  // Position above the fretboard
  return -inlayOffset;
}

/**
 * Get inlay X position for vertical orientation (left of fretboard)
 */
export function getVerticalInlayX(
  stringCount: number,
  stringSpacing: number,
  inlayOffset: number = 20
): number {
  // Position to the left of the fretboard
  return -inlayOffset;
}

/**
 * Get inlay Y position for vertical orientation (left of fretboard)
 */
export function getVerticalInlayY(
  fretIndex: number,
  fretSpacing: number
): number {
  return getVerticalFretY(fretIndex, fretSpacing);
}

/**
 * Get marker position for horizontal orientation
 */
export function getHorizontalMarkerPosition(
  fretIndex: number,
  stringIndex: number,
  fretSpacing: number,
  stringSpacing: number
): Position {
  return {
    x: getHorizontalFretX(fretIndex, fretSpacing),
    y: getHorizontalStringY(stringIndex, stringSpacing)
  };
}

/**
 * Get marker position for vertical orientation
 */
export function getVerticalMarkerPosition(
  fretIndex: number,
  stringIndex: number,
  fretSpacing: number,
  stringSpacing: number,
  stringCount: number
): Position {
  return {
    x: getVerticalStringX(stringIndex, stringSpacing, stringCount),
    y: getVerticalFretY(fretIndex, fretSpacing)
  };
}

/**
 * Get fret position for horizontal orientation
 */
export function getHorizontalFretPosition(
  fretIndex: number,
  fretSpacing: number,
  _height: number
): Position {
  // Fret spans full height of fretboard
  return {
    x: getHorizontalFretX(fretIndex, fretSpacing),
    y: 0
  };
}

/**
 * Get fret position for vertical orientation
 */
export function getVerticalFretPosition(
  fretIndex: number,
  fretSpacing: number,
  _width: number
): Position {
  // Fret spans full width of fretboard
  return {
    x: 0,
    y: getVerticalFretY(fretIndex, fretSpacing)
  };
}

/**
 * Get string position for horizontal orientation
 */
export function getHorizontalStringPosition(
  stringIndex: number,
  stringSpacing: number,
  _width: number
): Position {
  // String spans full width of fretboard
  return {
    x: 0,
    y: getHorizontalStringY(stringIndex, stringSpacing)
  };
}

/**
 * Get string position for vertical orientation
 */
export function getVerticalStringPosition(
  stringIndex: number,
  stringSpacing: number,
  height: number,
  stringCount: number
): Position {
  // String spans full height of fretboard
  return {
    x: getVerticalStringX(stringIndex, stringSpacing, stringCount),
    y: 0
  };
}

/**
 * Calculate dynamic radius for fingering markers ensuring no overlap between adjacent strings
 * 
 * @param stringSpacing - Pixel spacing between strings
 * @param fretSpacing - Pixel spacing between frets (optional)
 * @returns number - Marker radius in pixels
 */
export function calculateFingeringRadius(
  stringSpacing: number,
  fretSpacing: number = DEFAULT_FRET_SPACING
): number {
  const maxRadiusFromStrings = stringSpacing * 0.4;
  const maxRadiusFromFrets = fretSpacing * 0.4;
  return Math.min(maxRadiusFromStrings, maxRadiusFromFrets);
}

/**
 * Calculate 2D position for a fingering marker on the fretboard
 * 
 * Centers the marker on the string's visual center, accounting for
 * per-string thickness variation (thickness = stringThickness × stringNum),
 * and on the fret's visual center, accounting for fret thickness.
 * 
 * @param stringNum - 1-based string number (1 = top string / high E)
 * @param fretNum - Fret number (0 = open string, 1..N = fretted position)
 * @param orientation - Layout direction ('horizontal' | 'vertical')
 * @param stringSpacing - Pixel spacing between strings
 * @param fretSpacing - Pixel spacing between frets
 * @param stringCount - Total string count
 * @param stringThickness - Base string thickness (each string's actual thickness = stringThickness × stringNum)
 * @param fretThickness - Thickness of fret lines
 * @returns Position - {x, y} coordinates of fingering marker center
 */
export function getFingeringPosition(
  stringNum: number,
  fretNum: number,
  orientation: 'horizontal' | 'vertical',
  stringSpacing: number,
  fretSpacing: number,
  stringCount: number,
  stringThickness: number = 0,
  fretThickness: number = 0
): Position {
  const stringIndex = stringNum - 1;
  // Per-string thickness offset to center on the string's visual midline
  // String line is rendered at position + thickness/2, where thickness = stringThickness * (index + 1)
  const thicknessOffset = (stringThickness * stringNum) / 2;
  // Per-fret thickness offset to center between fret lines
  const fretThicknessOffset = fretThickness / 2;

  if (orientation === 'horizontal') {
    const y = getHorizontalStringY(stringIndex, stringSpacing) + thicknessOffset;
    const x = fretNum === 0 ? -fretSpacing * 0.35 : (fretNum - 0.5) * fretSpacing + fretThicknessOffset;
    return { x, y };
  } else {
    const x = getVerticalStringX(stringIndex, stringSpacing, stringCount) + thicknessOffset;
    const y = fretNum === 0 ? -fretSpacing * 0.35 : (fretNum - 0.5) * fretSpacing + fretThicknessOffset;
    return { x, y };
  }
}

