/**
 * Validation utilities for Fretboard Renderer Library
 */

import {
  MIN_FRET_COUNT,
  MAX_FRET_COUNT,
  MIN_STRING_COUNT,
  MAX_STRING_COUNT,
  MIN_START_FRET,
  MAX_START_FRET,
  ERROR_MESSAGES
} from '../fretboard/constants';

/**
 * Validates and clamps fretCount to valid range
 */
export function validateFretCount(value: number): number {
  if (!Number.isInteger(value)) {
    throw new TypeError(ERROR_MESSAGES.FRET_COUNT_RANGE(value));
  }
  if (value < MIN_FRET_COUNT || value > MAX_FRET_COUNT) {
    throw new RangeError(ERROR_MESSAGES.FRET_COUNT_RANGE(value));
  }
  return value;
}

/**
 * Validates and clamps stringCount to valid range
 */
export function validateStringCount(value: number): number {
  if (!Number.isInteger(value)) {
    throw new TypeError(ERROR_MESSAGES.STRING_COUNT_RANGE(value));
  }
  if (value < MIN_STRING_COUNT || value > MAX_STRING_COUNT) {
    throw new RangeError(ERROR_MESSAGES.STRING_COUNT_RANGE(value));
  }
  return value;
}

/**
 * Validates startFret value
 */
export function validateStartFret(value: number): number {
  if (!Number.isInteger(value)) {
    throw new TypeError(ERROR_MESSAGES.START_FRET_RANGE(value));
  }
  if (value < MIN_START_FRET || value > MAX_START_FRET) {
    throw new RangeError(ERROR_MESSAGES.START_FRET_RANGE(value));
  }
  return value;
}

/**
 * Validates orientation value
 */
export function validateOrientation(value: string): 'horizontal' | 'vertical' {
  if (value !== 'horizontal' && value !== 'vertical') {
    throw new TypeError(ERROR_MESSAGES.INVALID_ORIENTATION(value));
  }
  return value;
}

/**
 * Validates titleAlignment value
 */
export function validateTitleAlignment(value: string): 'center' | 'left' {
  if (value !== 'center' && value !== 'left') {
    throw new TypeError(ERROR_MESSAGES.INVALID_TITLE_ALIGNMENT(value));
  }
  return value;
}

/**
 * Validates positive number
 */
export function validatePositive(value: number, field: string): number {
  if (typeof value !== 'number' || value <= 0) {
    throw new RangeError(ERROR_MESSAGES.POSITIVE_REQUIRED(field));
  }
  return value;
}

/**
 * Validates non-negative number
 */
export function validateNonNegative(value: number, field: string): number {
  if (typeof value !== 'number' || value < 0) {
    throw new RangeError(ERROR_MESSAGES.NON_NEGATIVE_REQUIRED(field));
  }
  return value;
}

/**
 * Validates fret index is within range
 */
export function validateFretIndex(value: number, max: number): number {
  if (!Number.isInteger(value) || value < -1 || value > max) {
    throw new RangeError(ERROR_MESSAGES.FRET_INDEX_RANGE(value, max));
  }
  return value;
}

/**
 * Validates string index is within range
 */
export function validateStringIndex(value: number, max: number): number {
  if (!Number.isInteger(value) || value < 0 || value >= max) {
    throw new RangeError(ERROR_MESSAGES.STRING_INDEX_RANGE(value, max));
  }
  return value;
}

/**
 * Validates inlay positions are within fret count
 */
export function validateInlayPositions(
  positions: number[],
  fretCount: number
): number[] {
  return positions.filter(pos => pos <= fretCount);
}

/**
 * Validates all configuration options
 */
export function validateOptions({
  fretCount,
  stringCount,
  startFret,
  orientation,
  titleAlignment,
  stringSpacing,
  stringThickness,
  fretSpacing,
  fretThickness
}: {
  fretCount?: number;
  stringCount?: number;
  startFret?: number;
  orientation?: string;
  titleAlignment?: string;
  stringSpacing?: number;
  stringThickness?: number;
  fretSpacing?: number;
  fretThickness?: number;
}): void {
  if (fretCount !== undefined) validateFretCount(fretCount);
  if (stringCount !== undefined) validateStringCount(stringCount);
  if (startFret !== undefined) validateStartFret(startFret);
  if (orientation !== undefined) validateOrientation(orientation);
  if (titleAlignment !== undefined) validateTitleAlignment(titleAlignment);
  if (stringSpacing !== undefined) validatePositive(stringSpacing, 'stringSpacing');
  if (stringThickness !== undefined) validateNonNegative(stringThickness, 'stringThickness');
  if (fretSpacing !== undefined) validatePositive(fretSpacing, 'fretSpacing');
  if (fretThickness !== undefined) validateNonNegative(fretThickness, 'fretThickness');
}
