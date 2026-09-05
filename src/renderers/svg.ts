/**
 * SVG renderer for Fretboard Renderer Library
 */

import type { FretboardOptions, Marker as MarkerInterface, Zone } from '../fretboard/types';
import { SVG_NS, CSS_CLASSES, TITLE_FONT_SIZE, SUBTITLE_FONT_SIZE, TITLE_PADDING, DEFAULT_FINGERING_TEXT_COLOR } from '../fretboard/constants';
import { String as GuitarString } from '../fretboard/String';
import { Fret } from '../fretboard/Fret';
import { Inlay } from '../fretboard/Inlay';
import { Fingering } from '../fretboard/Fingering';
import {
  calculateHorizontalWidth,
  calculateHorizontalHeight,
  calculateVerticalWidth,
  calculateVerticalHeight,
  calculateFingeringRadius,
  getFingeringPosition
} from '../utils/geometry';

/**
 * SVG Renderer for creating fretboard SVG elements
 */
export class SvgRenderer {
  private readonly options: Required<FretboardOptions>;

  constructor(options: Required<FretboardOptions>) {
    this.options = options;
  }

  /**
   * Renders the complete fretboard as SVG element
   */
  render(
    strings: GuitarString[],
    frets: Fret[],
    inlays: Inlay[],
    markers: MarkerInterface[] = [],
    fingerings: Fingering[] = []
  ): SVGSVGElement {
    const isHorizontal = this.options.orientation === 'horizontal';
    const inlayOffset = 20; // Space for inlay numbers
    const padding = 10 + this.options.fretThickness; // Padding around diagram
    
    // Calculate dimensions
    let width = isHorizontal
      ? calculateHorizontalWidth(this.options.fretCount, this.options.fretSpacing)
      : calculateVerticalWidth(this.options.stringCount, this.options.stringSpacing, this.options.stringThickness);
    
    let height = isHorizontal
      ? calculateHorizontalHeight(this.options.stringCount, this.options.stringSpacing, this.options.stringThickness)
      : calculateVerticalHeight(this.options.fretCount, this.options.fretSpacing);

    // Adjust viewBox to include inlays and padding
    let viewBoxX = 0;
    let viewBoxY = 0;
    
    // Add padding on all sides
    viewBoxX = -padding;
    viewBoxY = -padding;
    width += padding * 2;
    height += padding * 2;

    // Headstock clearance for open strings (fret 0), muted strings (fret -1), and breathing room (40px)
    const reserveClearance = this.options.reserveNutClearance !== false;
    const openOffset = reserveClearance ? 40 : 0;

    if (openOffset > 0) {
      if (isHorizontal) {
        viewBoxX -= openOffset;
        width += openOffset;
      } else {
        viewBoxY -= openOffset;
        height += openOffset;
      }
    }

    // Reserved top clearance for fingerings on string 1 (top string in horizontal mode)
    const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);
    const topMarkerOffset = isHorizontal ? radius + 5 : 0;
    if (topMarkerOffset > 0) {
      viewBoxY -= topMarkerOffset;
      height += topMarkerOffset;
    }

    // Additional adjustment for title, subtitle, or zone labels/braces
    const hasZoneLabels = Boolean(this.options.zones && this.options.zones.some(z => z.label && z.label.trim().length > 0));
    const titleLines = (this.options.title || '').replace(/\\n/g, '\n').split(/\r?\n/);
    const hasTitle = Boolean(this.options.title && this.options.title.trim().length > 0);
    const titleLineCount = hasTitle ? titleLines.length : 0;

    const subtitleLines = (this.options.subtitle || '').replace(/\\n/g, '\n').split(/\r?\n/);
    const hasSubtitle = Boolean(this.options.subtitle && this.options.subtitle.trim().length > 0);
    const subtitleLineCount = hasSubtitle ? subtitleLines.length : 0;

    let extraTopSpace = 0;
    if (hasTitle) {
      extraTopSpace += (TITLE_FONT_SIZE * 1.2 * titleLineCount) + TITLE_PADDING + 16;
    }
    if (hasSubtitle) {
      extraTopSpace += (SUBTITLE_FONT_SIZE * 1.2 * subtitleLineCount) + (hasTitle ? 4 : (TITLE_PADDING + 16));
    }

    const hasTopBraces = Boolean(this.options.zones && this.options.zones.some(z => z.type === 'brace' && (z.position !== 'bottom')));
    const hasBottomBraces = Boolean(this.options.zones && this.options.zones.some(z => z.type === 'brace' && z.position === 'bottom'));
    const maxTopOffset = (this.options.zones || []).filter(z => z.position !== 'bottom').reduce((max, z) => Math.max(max, Math.abs(z.offsetY || 0)), 0);
    const maxBottomOffset = (this.options.zones || []).filter(z => z.position === 'bottom').reduce((max, z) => Math.max(max, Math.abs(z.offsetY || 0)), 0);

    if (hasTopBraces) extraTopSpace += 26 + maxTopOffset;
    else if (hasZoneLabels && isHorizontal) extraTopSpace += 16 + maxTopOffset;

    if (extraTopSpace > 0) {
      viewBoxY -= extraTopSpace;
      height += extraTopSpace;
    }

    const hasNonBraceZones = Boolean(this.options.zones && this.options.zones.some(z => z.type !== 'brace'));

    if (isHorizontal && hasBottomBraces) {
      const extraBottomSpace = 26 + maxBottomOffset;
      height += extraBottomSpace;
    } else if (isHorizontal && !this.options.showInlays && hasNonBraceZones) {
      height += 15;
    }

    if (!isHorizontal && hasBottomBraces) {
      const extraLeftSpace = 30 + maxBottomOffset;
      viewBoxX -= extraLeftSpace;
      width += extraLeftSpace;
    } else if (!isHorizontal && !this.options.showInlays && hasNonBraceZones) {
      viewBoxX -= 15;
      width += 15;
    }
    
    // Additional adjustments for inlays
    if (!isHorizontal && this.options.showInlays) {
      const extraThickness = this.options.stringThickness * (this.options.stringCount - 1);
      viewBoxX -= inlayOffset + extraThickness; // Extend left for inlays + thickness
      width += inlayOffset + extraThickness; // Space for text
    }
    if (!isHorizontal && hasTopBraces) {
      width += 30; // Extra right side padding for curly brace accolade in vertical mode
    } else if (!isHorizontal && hasNonBraceZones) {
      width += 15; // Extra right side padding for box/hull/path zones in vertical mode
    }
    if (isHorizontal && this.options.showInlays) {
      const extraThickness = this.options.stringThickness * (this.options.stringCount - 1);
      height += inlayOffset + extraThickness; // Space for text below + thickness
    }
    if (isHorizontal && hasNonBraceZones) {
      width += 15; // Extra right side padding for box/hull/path zones in horizontal mode
    }

    // Additional adjustment for tuning labels (identical 40px)
    const hasTuning = this.options.showTuning !== false && Boolean(this.options.tuning && Array.isArray(this.options.tuning) && this.options.tuning.length > 0);
    const tuningOffset = hasTuning ? 40 : 0;
    if (hasTuning) {
      if (isHorizontal) {
        viewBoxX -= tuningOffset;
        width += tuningOffset;
      } else {
        viewBoxY -= tuningOffset;
        height += tuningOffset;
      }
    }

    // Create SVG element with adjusted viewBox
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('class', CSS_CLASSES.root);
    svg.setAttribute('xmlns', SVG_NS);

    // Render components
    if (isHorizontal) {
      this.renderHorizontal(strings, frets, inlays, markers, fingerings, svg, width, height, topMarkerOffset);
    } else {
      const verticalTopOffset = (reserveClearance ? openOffset : 0) + tuningOffset;
      this.renderVertical(strings, frets, inlays, markers, fingerings, svg, width, height, verticalTopOffset);
    }

    return svg;
  }

  /**
   * Renders fretboard in horizontal orientation
   */
  private renderHorizontal(
    strings: GuitarString[],
    frets: Fret[],
    inlays: Inlay[],
    markers: MarkerInterface[],
    fingerings: Fingering[],
    svg: SVGSVGElement,
    width: number,
    _height: number,
    topOffset = 0
  ): void {
    // Render title and subtitle if specified
    if ((this.options.title && this.options.title.trim().length > 0) || (this.options.subtitle && this.options.subtitle.trim().length > 0)) {
      this.renderTitle(svg, true, topOffset);
    }

    // Render strings (horizontal lines spanning fretboard width)
    const stringsGroup = this.createGroup(CSS_CLASSES.strings);
    for (const str of strings) {
      this.renderHorizontalString(str, width, stringsGroup);
    }
    svg.appendChild(stringsGroup);

    // Render frets (vertical lines spanning fretboard height)
    const fretsGroup = this.createGroup(CSS_CLASSES.frets);
    for (const fret of frets) {
      this.renderHorizontalFret(fret, this.options.stringCount, this.options.stringSpacing, this.options.stringThickness, fretsGroup);
    }
    svg.appendChild(fretsGroup);

    // Render inlays (dots on fretboard neck + text labels below)
    if (this.options.showInlays) {
      const inlaysGroup = this.createGroup(CSS_CLASSES.inlays);
      this.renderHorizontalInlayDots(inlaysGroup);
      for (const inlay of inlays) {
        this.renderHorizontalInlay(inlay, inlaysGroup);
      }
      svg.appendChild(inlaysGroup);
    }

    // Render markers (placeholder for v2)
    if (markers.length > 0) {
      const markersGroup = this.createGroup(CSS_CLASSES.markers);
      for (const marker of markers) {
        this.renderMarker(marker, markersGroup);
      }
      svg.appendChild(markersGroup);
    }

    // Render zones (underneath fingerings)
    if (this.options.zones && this.options.zones.length > 0) {
      this.renderZonesGroup(this.options.zones, svg);
    }

    // Render fingerings
    if (fingerings.length > 0) {
      this.renderFingeringsGroup(fingerings, svg);
    }

    // Render tuning labels if specified
    this.renderTuningLabels(svg, true);

    // Render debug overlays if enabled
    if (this.options.debugZones) {
      this.renderDebugZones(svg, true);
    }
  }

  /**
   * Renders fretboard in vertical orientation
   */
  private renderVertical(
    strings: GuitarString[],
    frets: Fret[],
    inlays: Inlay[],
    markers: MarkerInterface[],
    fingerings: Fingering[],
    svg: SVGSVGElement,
    width: number,
    height: number,
    topOffset = 0
  ): void {
    // Render title and subtitle if specified
    if ((this.options.title && this.options.title.trim().length > 0) || (this.options.subtitle && this.options.subtitle.trim().length > 0)) {
      this.renderTitle(svg, false, topOffset);
    }

    // Render strings (vertical lines spanning fretboard height)
    const stringsGroup = this.createGroup(CSS_CLASSES.strings);
    for (const str of strings) {
      this.renderVerticalString(str, height, stringsGroup);
    }
    svg.appendChild(stringsGroup);

    // Render frets (horizontal lines spanning fretboard width)
    const fretsGroup = this.createGroup(CSS_CLASSES.frets);
    for (const fret of frets) {
      this.renderVerticalFret(fret, this.options.stringCount, this.options.stringSpacing, this.options.stringThickness, fretsGroup);
    }
    svg.appendChild(fretsGroup);

    // Render inlays (dots on fretboard neck + text labels left)
    if (this.options.showInlays) {
      const inlaysGroup = this.createGroup(CSS_CLASSES.inlays);
      this.renderVerticalInlayDots(inlaysGroup);
      for (const inlay of inlays) {
        this.renderVerticalInlay(inlay, inlaysGroup);
      }
      svg.appendChild(inlaysGroup);
    }

    // Render markers (placeholder for v2)
    if (markers.length > 0) {
      const markersGroup = this.createGroup(CSS_CLASSES.markers);
      for (const marker of markers) {
        this.renderMarker(marker, markersGroup);
      }
      svg.appendChild(markersGroup);
    }

    // Render zones (underneath fingerings)
    if (this.options.zones && this.options.zones.length > 0) {
      this.renderZonesGroup(this.options.zones, svg);
    }

    // Render fingerings
    if (fingerings.length > 0) {
      this.renderFingeringsGroup(fingerings, svg);
    }

    // Render tuning labels if specified
    this.renderTuningLabels(svg, false);

    // Render debug overlays if enabled
    if (this.options.debugZones) {
      this.renderDebugZones(svg, false);
    }
  }

  /**
   * Renders transparent debug overlays:
   * - Transparent Blue (#3b82f6) for Fret 0 / X zone (40px)
   * - Transparent Red (#ef4444) for Tuning zone (40px)
   */
  private renderDebugZones(svg: SVGSVGElement, isHorizontal: boolean): void {
    const debugGroup = document.createElementNS(SVG_NS, 'g');
    debugGroup.setAttribute('class', 'fretzee-debug-zones');

    const stringCount = this.options.stringCount;
    const stringSpacing = this.options.stringSpacing;
    const stringThickness = this.options.stringThickness;
    const neckSpan = (stringCount - 1) * stringSpacing + (stringThickness * stringCount);

    const reserveClearance = this.options.reserveNutClearance !== false;
    const hasTuning = this.options.showTuning !== false && Boolean(this.options.tuning && Array.isArray(this.options.tuning) && this.options.tuning.length > 0);

    // 1. Blue overlay for Fret 0 / X zone (40px)
    if (reserveClearance) {
      const fret0Rect = document.createElementNS(SVG_NS, 'rect');
      if (isHorizontal) {
        fret0Rect.setAttribute('x', '-40');
        fret0Rect.setAttribute('y', '-10');
        fret0Rect.setAttribute('width', '40');
        fret0Rect.setAttribute('height', String(neckSpan + 20));
      } else {
        fret0Rect.setAttribute('x', '-10');
        fret0Rect.setAttribute('y', '-40');
        fret0Rect.setAttribute('width', String(neckSpan + 20));
        fret0Rect.setAttribute('height', '40');
      }
      fret0Rect.setAttribute('fill', 'rgba(59, 130, 246, 0.35)'); // Blue 35%
      fret0Rect.setAttribute('stroke', '#2563eb');
      fret0Rect.setAttribute('stroke-width', '1.5');
      fret0Rect.setAttribute('stroke-dasharray', '4 4');
      debugGroup.appendChild(fret0Rect);
    }

    // 2. Red overlay for Tuning zone (40px)
    if (hasTuning) {
      const tuningRect = document.createElementNS(SVG_NS, 'rect');
      const startOffset = reserveClearance ? -80 : -40;
      if (isHorizontal) {
        tuningRect.setAttribute('x', String(startOffset));
        tuningRect.setAttribute('y', '-10');
        tuningRect.setAttribute('width', '40');
        tuningRect.setAttribute('height', String(neckSpan + 20));
      } else {
        tuningRect.setAttribute('x', '-10');
        tuningRect.setAttribute('y', String(startOffset));
        tuningRect.setAttribute('width', String(neckSpan + 20));
        tuningRect.setAttribute('height', '40');
      }
      tuningRect.setAttribute('fill', 'rgba(239, 68, 68, 0.35)'); // Red 35%
      tuningRect.setAttribute('stroke', '#dc2626');
      tuningRect.setAttribute('stroke-width', '1.5');
      tuningRect.setAttribute('stroke-dasharray', '4 4');
      debugGroup.appendChild(tuningRect);
    }

    // Insert as background underneath elements
    svg.insertBefore(debugGroup, svg.firstChild);
  }

  /**
   * Creates a grouped SVG element
   */
  private createGroup(className: string): SVGGElement {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', className);
    return g;
  }

  /**
   * Renders tuning note labels for strings
   * In horizontal mode: rendered to the left of the nut, aligned vertically with strings
   * In vertical mode: rendered above the nut, aligned horizontally with strings
   */
  private renderTuningLabels(svg: SVGSVGElement, isHorizontal: boolean): void {
    if (this.options.showTuning === false || !this.options.tuning || !Array.isArray(this.options.tuning) || this.options.tuning.length === 0) {
      return;
    }

    const tuningGroup = this.createGroup(CSS_CLASSES.tuning);
    const stringCount = this.options.stringCount;
    const tuning = this.options.tuning;

    const reserveClearance = this.options.reserveNutClearance !== false;
    // When Fret 0 is active (zone [0, -40px]), tuning labels are placed at -60px (in zone [-40px, -80px]).
    // When Fret 0 is inactive (zone [0, -40px]), tuning labels are placed at -20px.
    const uniformOffset = reserveClearance ? -60 : -20;

    const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);
    const fontSize = Math.round(radius * 1.2);

    // tuning is provided 6th string to 1st string (lowest string to highest string)
    for (let i = 0; i < stringCount; i++) {
      // Map stringIndex (0 = highest/1st string, N-1 = lowest/Nth string)
      const tuningIndex = (stringCount - 1) - i;
      const noteLabel = tuning[tuningIndex];
      if (noteLabel === undefined || noteLabel === null || noteLabel.trim() === '') continue;

      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('class', `${CSS_CLASSES.tuningLabel} fretzee-tuning-s${i + 1}`);
      text.setAttribute('fill', '#000000');
      text.setAttribute('font-size', String(fontSize));
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-weight', 'bold');

      if (isHorizontal) {
        // Positioned left of nut & open markers in a straight vertical column
        const stringPos = getFingeringPosition(
          i + 1,
          0,
          'horizontal',
          this.options.stringSpacing,
          this.options.fretSpacing,
          stringCount,
          this.options.stringThickness,
          this.options.fretThickness,
          this.options.startFret
        );

        text.setAttribute('x', String(uniformOffset));
        text.setAttribute('y', String(stringPos.y));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
      } else {
        // Positioned above nut & open markers in a straight horizontal row
        const stringPos = getFingeringPosition(
          i + 1,
          0,
          'vertical',
          this.options.stringSpacing,
          this.options.fretSpacing,
          stringCount,
          this.options.stringThickness,
          this.options.fretThickness,
          this.options.startFret
        );

        text.setAttribute('x', String(stringPos.x));
        text.setAttribute('y', String(uniformOffset));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
      }

      text.textContent = noteLabel;
      tuningGroup.appendChild(text);
    }

    svg.appendChild(tuningGroup);
  }

  /**
   * Renders the diagram title and subtitle text above the fretboard
   */
  private renderTitle(svg: SVGSVGElement, isHorizontal: boolean, topOffset = 0): void {
    const alignment = this.options.titleAlignment || 'center';
    let xPosition = 0;

    if (alignment === 'left') {
      xPosition = 0;
    } else {
      if (isHorizontal) {
        xPosition = calculateHorizontalWidth(this.options.fretCount, this.options.fretSpacing) / 2;
      } else {
        xPosition = calculateVerticalWidth(this.options.stringCount, this.options.stringSpacing, this.options.stringThickness) / 2;
      }
    }

    const hasZoneOverlay = Boolean(this.options.zones && this.options.zones.some(z => (z.type === 'brace') || (z.label && z.label.trim().length > 0)));
    const zoneOffset = hasZoneOverlay ? 22 : 0;

    const titleLines = (this.options.title || '').replace(/\\n/g, '\n').split(/\r?\n/);
    const hasTitle = Boolean(this.options.title && this.options.title.trim().length > 0);
    const titleOffset = this.options.titleOffsetY ?? 0;
    const titleMultiLineOffset = (titleLines.length - 1) * (TITLE_FONT_SIZE * 1.1);

    const subtitleLines = (this.options.subtitle || '').replace(/\\n/g, '\n').split(/\r?\n/);
    const hasSubtitle = Boolean(this.options.subtitle && this.options.subtitle.trim().length > 0);
    const subtitleOffset = this.options.subtitleOffsetY ?? 0;
    const subtitleMultiLineOffset = (subtitleLines.length - 1) * (SUBTITLE_FONT_SIZE * 1.1);
    const subtitleHeight = hasSubtitle ? (SUBTITLE_FONT_SIZE * 1.2 * subtitleLines.length) + 4 : 0;

    // 1. Render Title (if present)
    if (hasTitle) {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('class', CSS_CLASSES.title);
      text.setAttribute('fill', '#000000');
      text.setAttribute('font-size', String(TITLE_FONT_SIZE));
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('dominant-baseline', 'auto');
      text.setAttribute('text-anchor', alignment === 'left' ? 'start' : 'middle');

      const yTitlePosition = -(TITLE_PADDING + topOffset + zoneOffset + subtitleHeight + titleMultiLineOffset) + titleOffset;
      text.setAttribute('x', String(xPosition));
      text.setAttribute('y', String(yTitlePosition));

      if (titleLines.length === 1) {
        text.textContent = titleLines[0];
      } else {
        titleLines.forEach((lineText, i) => {
          const tspan = document.createElementNS(SVG_NS, 'tspan');
          tspan.setAttribute('x', String(xPosition));
          if (i > 0) {
            tspan.setAttribute('dy', '1.2em');
          }
          tspan.textContent = lineText;
          text.appendChild(tspan);
        });
      }
      svg.appendChild(text);
    }

    // 2. Render Subtitle (if present)
    if (hasSubtitle) {
      const subText = document.createElementNS(SVG_NS, 'text');
      subText.setAttribute('class', CSS_CLASSES.subtitle);
      subText.setAttribute('fill', '#666666');
      subText.setAttribute('font-size', String(SUBTITLE_FONT_SIZE));
      subText.setAttribute('font-family', 'sans-serif');
      subText.setAttribute('font-weight', 'normal');
      subText.setAttribute('dominant-baseline', 'auto');
      subText.setAttribute('text-anchor', alignment === 'left' ? 'start' : 'middle');

      const ySubtitlePosition = -(TITLE_PADDING + topOffset + zoneOffset + subtitleMultiLineOffset) + subtitleOffset;
      subText.setAttribute('x', String(xPosition));
      subText.setAttribute('y', String(ySubtitlePosition));

      if (subtitleLines.length === 1) {
        subText.textContent = subtitleLines[0];
      } else {
        subtitleLines.forEach((lineText, i) => {
          const tspan = document.createElementNS(SVG_NS, 'tspan');
          tspan.setAttribute('x', String(xPosition));
          if (i > 0) {
            tspan.setAttribute('dy', '1.2em');
          }
          tspan.textContent = lineText;
          subText.appendChild(tspan);
        });
      }
      svg.appendChild(subText);
    }
  }

  /**
   * Renders a string in horizontal orientation
   */
  private renderHorizontalString(str: GuitarString, width: number, group: SVGElement): void {
    const overlap = 10;
    const x1 = this.options.startFret > 1 ? -overlap : 0;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(str.y + str.thickness / 2));
    line.setAttribute('x2', String(width));
    line.setAttribute('y2', String(str.y + str.thickness / 2));
    
    // Determine stroke color (global string or per-string array)
    const colorOpt = this.options.stringColor ?? '#6b7280';
    let strokeColor = '#6b7280';
    if (Array.isArray(colorOpt)) {
      strokeColor = colorOpt[str.index] ?? colorOpt[colorOpt.length - 1] ?? '#6b7280';
    } else if (typeof colorOpt === 'string') {
      strokeColor = colorOpt;
    }

    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', String(str.thickness));
    line.setAttribute('class', CSS_CLASSES.string(str.index));
    group.appendChild(line);
  }

  /**
   * Renders a fret in horizontal orientation
   * Frets span from first string to last string
   */
  private renderHorizontalFret(fret: Fret, stringCount: number, stringSpacing: number, stringThickness: number, group: SVGElement): void {
    const line = document.createElementNS(SVG_NS, 'line');
    // Fret line is vertical, centered on fret position
    const x = fret.x + fret.thickness / 2;
    // Spans from first string to last string
    const y1 = 0;
    const y2 = stringSpacing * (stringCount - 1) + stringThickness;
    
    line.setAttribute('x1', String(x));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', '#000000');
    line.setAttribute('stroke-width', String(fret.thickness));
    line.setAttribute('class', CSS_CLASSES.fret(fret.index));
    group.appendChild(line);
  }

  /**
   * Renders an inlay in horizontal orientation (above fretboard)
   */
  private renderHorizontalInlay(inlay: Inlay, group: SVGElement): void {
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', String(inlay.x));
    text.setAttribute('y', String(inlay.y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('class', inlay.getCssClass());
    text.setAttribute('fill', '#000000');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-family', 'sans-serif');
    text.textContent = inlay.label;
    group.appendChild(text);
  }

  /**
   * Renders small grey inlay dots on horizontal fretboard neck
   */
  private renderHorizontalInlayDots(group: SVGElement): void {
    const stringHeight = (this.options.stringCount - 1) * this.options.stringSpacing + this.options.stringThickness;
    const neckCenterY = stringHeight / 2;
    const dotRadius = 6;
    const dotColor = '#d1d5db';
    const startFret = this.options.startFret;
    const endFret = startFret + this.options.fretCount - 1;

    for (const fretNum of this.options.inlayPositions) {
      if (fretNum < startFret || fretNum > endFret) continue;
      const relativePos = fretNum - startFret + 1;
      const fretX = (relativePos - 0.5) * this.options.fretSpacing;
      const isDoubleDot = fretNum % 12 === 0;

      if (isDoubleDot) {
        const offset = this.options.stringCount >= 6 
          ? this.options.stringSpacing 
          : this.options.stringSpacing * 0.75;
        const circle1 = document.createElementNS(SVG_NS, 'circle');
        circle1.setAttribute('cx', String(fretX));
        circle1.setAttribute('cy', String(neckCenterY - offset));
        circle1.setAttribute('r', String(dotRadius));
        circle1.setAttribute('fill', dotColor);
        circle1.setAttribute('class', CSS_CLASSES.inlayDot(fretNum));
        group.appendChild(circle1);

        const circle2 = document.createElementNS(SVG_NS, 'circle');
        circle2.setAttribute('cx', String(fretX));
        circle2.setAttribute('cy', String(neckCenterY + offset));
        circle2.setAttribute('r', String(dotRadius));
        circle2.setAttribute('fill', dotColor);
        circle2.setAttribute('class', CSS_CLASSES.inlayDot(fretNum));
        group.appendChild(circle2);
      } else {
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', String(fretX));
        circle.setAttribute('cy', String(neckCenterY));
        circle.setAttribute('r', String(dotRadius));
        circle.setAttribute('fill', dotColor);
        circle.setAttribute('class', CSS_CLASSES.inlayDot(fretNum));
        group.appendChild(circle);
      }
    }
  }

  /**
   * Renders small grey inlay dots on vertical fretboard neck
   */
  private renderVerticalInlayDots(group: SVGElement): void {
    const stringWidth = (this.options.stringCount - 1) * this.options.stringSpacing + this.options.stringThickness;
    const neckCenterX = stringWidth / 2;
    const dotRadius = 6;
    const dotColor = '#d1d5db';
    const startFret = this.options.startFret;
    const endFret = startFret + this.options.fretCount - 1;

    for (const fretNum of this.options.inlayPositions) {
      if (fretNum < startFret || fretNum > endFret) continue;
      const relativePos = fretNum - startFret + 1;
      const fretY = (relativePos - 0.5) * this.options.fretSpacing;
      const isDoubleDot = fretNum % 12 === 0;

      if (isDoubleDot) {
        const offset = this.options.stringCount >= 6 
          ? this.options.stringSpacing 
          : this.options.stringSpacing * 0.75;
        const circle1 = document.createElementNS(SVG_NS, 'circle');
        circle1.setAttribute('cx', String(neckCenterX - offset));
        circle1.setAttribute('cy', String(fretY));
        circle1.setAttribute('r', String(dotRadius));
        circle1.setAttribute('fill', dotColor);
        circle1.setAttribute('class', CSS_CLASSES.inlayDot(fretNum));
        group.appendChild(circle1);

        const circle2 = document.createElementNS(SVG_NS, 'circle');
        circle2.setAttribute('cx', String(neckCenterX + offset));
        circle2.setAttribute('cy', String(fretY));
        circle2.setAttribute('r', String(dotRadius));
        circle2.setAttribute('fill', dotColor);
        circle2.setAttribute('class', CSS_CLASSES.inlayDot(fretNum));
        group.appendChild(circle2);
      } else {
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', String(neckCenterX));
        circle.setAttribute('cy', String(fretY));
        circle.setAttribute('r', String(dotRadius));
        circle.setAttribute('fill', dotColor);
        circle.setAttribute('class', CSS_CLASSES.inlayDot(fretNum));
        group.appendChild(circle);
      }
    }
  }

  /**
   * Renders a string in vertical orientation
   */
  private renderVerticalString(str: GuitarString, height: number, group: SVGElement): void {
    const overlap = 10;
    const y1 = this.options.startFret > 1 ? -overlap : 0;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', String(str.x + str.thickness / 2));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(str.x + str.thickness / 2));
    line.setAttribute('y2', String(height));
    
    // Determine stroke color (global string or per-string array)
    const colorOpt = this.options.stringColor ?? '#6b7280';
    let strokeColor = '#6b7280';
    if (Array.isArray(colorOpt)) {
      strokeColor = colorOpt[str.index] ?? colorOpt[colorOpt.length - 1] ?? '#6b7280';
    } else if (typeof colorOpt === 'string') {
      strokeColor = colorOpt;
    }

    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', String(str.thickness));
    line.setAttribute('class', CSS_CLASSES.string(str.index));
    group.appendChild(line);
  }

  /**
   * Renders a fret in vertical orientation
   * Frets span from first string to last string
   */
  private renderVerticalFret(fret: Fret, stringCount: number, stringSpacing: number, stringThickness: number, group: SVGElement): void {
    const line = document.createElementNS(SVG_NS, 'line');
    // Fret line is horizontal, centered on fret position
    const y = fret.y + fret.thickness / 2;
    // Spans from first string to last string
    const x1 = 0;
    const x2 = stringSpacing * (stringCount - 1) + stringThickness;
    
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', '#000000');
    line.setAttribute('stroke-width', String(fret.thickness));
    line.setAttribute('class', CSS_CLASSES.fret(fret.index));
    group.appendChild(line);
  }

  /**
   * Renders an inlay in vertical orientation (left of fretboard)
   */
  private renderVerticalInlay(inlay: Inlay, group: SVGElement): void {
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', String(inlay.x));
    text.setAttribute('y', String(inlay.y));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('class', inlay.getCssClass());
    text.setAttribute('fill', '#000000');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-family', 'sans-serif');
    text.textContent = inlay.label;
    group.appendChild(text);
  }

  /**
   * Renders a marker (placeholder for v2)
   */
  private renderMarker(marker: MarkerInterface, group: SVGElement): void {
    // v1: Store marker but don't render
    // v2: Implement actual rendering with proper positioning
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', String(marker.options.size ?? 4));
    circle.setAttribute('fill', marker.options.color ?? '#ff0000');
    circle.setAttribute('class', 'fretzee-marker');
    group.appendChild(circle);
  }

  /**
   * Creates an SVG line element for a string
   */
  createStringElement(str: GuitarString, length: number, isHorizontal: boolean): SVGLineElement {
    const line = document.createElementNS(SVG_NS, 'line');
    
    if (isHorizontal) {
      line.setAttribute('x1', '0');
      line.setAttribute('y1', String(str.getCenterY()));
      line.setAttribute('x2', String(length));
      line.setAttribute('y2', String(str.getCenterY()));
    } else {
      line.setAttribute('x1', String(str.getCenterX()));
      line.setAttribute('y1', '0');
      line.setAttribute('x2', String(str.getCenterX()));
      line.setAttribute('y2', String(length));
    }
    
    line.setAttribute('stroke', '#000000');
    line.setAttribute('stroke-width', String(str.thickness));
    line.setAttribute('class', CSS_CLASSES.string(str.index));
    
    return line;
  }

  /**
   * Creates an SVG line element for a fret
   */
  createFretElement(fret: Fret, length: number, isHorizontal: boolean): SVGLineElement {
    const line = document.createElementNS(SVG_NS, 'line');
    
    if (isHorizontal) {
      line.setAttribute('x1', String(fret.getCenterX()));
      line.setAttribute('y1', '0');
      line.setAttribute('x2', String(fret.getCenterX()));
      line.setAttribute('y2', String(length));
    } else {
      line.setAttribute('x1', '0');
      line.setAttribute('y1', String(fret.getCenterY()));
      line.setAttribute('x2', String(length));
      line.setAttribute('y2', String(fret.getCenterY()));
    }
    
    line.setAttribute('stroke', '#000000');
    line.setAttribute('stroke-width', String(fret.thickness));
    line.setAttribute('class', CSS_CLASSES.fret(fret.index));
    
    return line;
  }

  /**
   * Renders group of zones / highlighted regions
   */
  private renderZonesGroup(zones: Zone[], svg: SVGSVGElement): void {
    const zonesGroup = this.createGroup(CSS_CLASSES.zones);

    for (const zone of zones) {
      this.renderZone(zone, zonesGroup);
    }

    svg.appendChild(zonesGroup);
  }

  /**
   * Renders an individual highlighted zone
   */
  /**
   * Renders an individual highlighted zone (box, hull, or path shape)
   */
  private renderZone(zone: Zone, group: SVGElement): void {
    const startFret = this.options.startFret;
    const endFret = startFret + this.options.fretCount - 1;
    const isHorizontal = this.options.orientation === 'horizontal';
    const zoneType = zone.type ?? 'box';

    const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);
    const padding = radius + 6;
    const zoneG = this.createGroup(CSS_CLASSES.zone);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    // Helper to resolve stroke dash array based on strokeDashArray or strokeStyle preset
    const resolveStrokeDashArray = (z: Zone): string | null => {
      if (z.strokeDashArray) return z.strokeDashArray;
      if (z.strokeStyle === 'dashed') return '4 4';
      if (z.strokeStyle === 'dotted') return '2 2';
      return null;
    };

    const strokeDash = resolveStrokeDashArray(zone);

    if (zoneType === 'hull' || zoneType === 'path') {
      const points = zone.points || [];
      if (points.length === 0) return;

      const screenCoords = points.map(pt => getFingeringPosition(
        pt.string,
        pt.fret,
        this.options.orientation,
        this.options.stringSpacing,
        this.options.fretSpacing,
        this.options.stringCount,
        this.options.stringThickness,
        this.options.fretThickness,
        startFret
      ));

      screenCoords.forEach(c => {
        if (c.x < minX) minX = c.x;
        if (c.x > maxX) maxX = c.x;
        if (c.y < minY) minY = c.y;
        if (c.y > maxY) maxY = c.y;
      });

      if (zoneType === 'hull') {
        // Render convex polygon hull wrapping the given points
        const polygon = document.createElementNS(SVG_NS, 'polygon');
        const pointsString = screenCoords.map(c => `${c.x},${c.y}`).join(' ');
        polygon.setAttribute('points', pointsString);
        polygon.setAttribute('fill', zone.fillColor ?? 'rgba(56, 189, 248, 0.15)');
        polygon.setAttribute('stroke', zone.strokeColor ?? '#38bdf8');
        polygon.setAttribute('stroke-width', String(zone.strokeWidth ?? 2));
        polygon.setAttribute('stroke-linejoin', 'round');
        polygon.setAttribute('stroke-linecap', 'round');
        if (strokeDash) {
          polygon.setAttribute('stroke-dasharray', strokeDash);
        }
        polygon.setAttribute('class', CSS_CLASSES.zoneRect);
        zoneG.appendChild(polygon);
      } else if (zoneType === 'path') {
        // Render connected path (e.g. scale run or arpeggio sequence line)
        const path = document.createElementNS(SVG_NS, 'path');
        const d = screenCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', zone.strokeColor ?? '#38bdf8');
        path.setAttribute('stroke-width', String(zone.strokeWidth ?? 4));
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        if (strokeDash) {
          path.setAttribute('stroke-dasharray', strokeDash);
        }
        path.setAttribute('class', CSS_CLASSES.zoneRect);
        zoneG.appendChild(path);
      }
    } else if (zoneType === 'brace') {
      // Render curly brace / accolade spanning frets at top (or side)
      const zStartFret = zone.startFret ?? 1;
      const zEndFret = zone.endFret ?? zStartFret;

      const effectiveStartFret = Math.max(zStartFret, startFret);
      const effectiveEndFret = Math.min(zEndFret, endFret);

      if (effectiveStartFret > effectiveEndFret) return;

      const pos1 = getFingeringPosition(1, effectiveStartFret, this.options.orientation, this.options.stringSpacing, this.options.fretSpacing, this.options.stringCount, this.options.stringThickness, this.options.fretThickness, startFret);
      const pos2 = getFingeringPosition(1, effectiveEndFret, this.options.orientation, this.options.stringSpacing, this.options.fretSpacing, this.options.stringCount, this.options.stringThickness, this.options.fretThickness, startFret);

      const zoneOffsetY = zone.offsetY ?? 0;
      const isBottomPos = zone.position === 'bottom';

      if (isHorizontal) {
        const x1 = Math.min(pos1.x, pos2.x) - radius;
        const x2 = Math.max(pos1.x, pos2.x) + radius;
        const midX = (x1 + x2) / 2;
        const braceHeight = 12;
        const r = 6;

        let y: number;
        let pathD: string;

        if (isBottomPos) {
          y = (this.options.stringCount - 1) * this.options.stringSpacing + 14 + zoneOffsetY;
          pathD = `
            M ${x1} ${y} 
            Q ${x1} ${y + r} ${x1 + r} ${y + r} 
            H ${midX - r} 
            Q ${midX} ${y + r} ${midX} ${y + braceHeight} 
            Q ${midX} ${y + r} ${midX + r} ${y + r} 
            H ${x2 - r} 
            Q ${x2} ${y + r} ${x2} ${y}
          `.replace(/\s+/g, ' ').trim();
          minX = x1; maxX = x2; minY = y; maxY = y + braceHeight;
        } else {
          y = -14 - zoneOffsetY;
          pathD = `
            M ${x1} ${y} 
            Q ${x1} ${y - r} ${x1 + r} ${y - r} 
            H ${midX - r} 
            Q ${midX} ${y - r} ${midX} ${y - braceHeight} 
            Q ${midX} ${y - r} ${midX + r} ${y - r} 
            H ${x2 - r} 
            Q ${x2} ${y - r} ${x2} ${y}
          `.replace(/\s+/g, ' ').trim();
          minX = x1; maxX = x2; minY = y - braceHeight; maxY = y;
        }

        const bracePath = document.createElementNS(SVG_NS, 'path');
        bracePath.setAttribute('d', pathD);
        bracePath.setAttribute('fill', 'none');
        bracePath.setAttribute('stroke', zone.strokeColor ?? '#38bdf8');
        bracePath.setAttribute('stroke-width', String(zone.strokeWidth ?? 2));
        bracePath.setAttribute('stroke-linecap', 'round');
        bracePath.setAttribute('stroke-linejoin', 'round');
        if (strokeDash) {
          bracePath.setAttribute('stroke-dasharray', strokeDash);
        }
        bracePath.setAttribute('class', CSS_CLASSES.zoneRect);
        zoneG.appendChild(bracePath);
      } else {
        // Vertical orientation: curly brace spanning frets vertically on right (default) or left (bottom pos)
        const y1 = Math.min(pos1.y, pos2.y) - radius;
        const y2 = Math.max(pos1.y, pos2.y) + radius;
        const midY = (y1 + y2) / 2;
        const braceWidth = 12;
        const r = 6;

        let x: number;
        let pathD: string;

        if (isBottomPos) {
          x = -14 - zoneOffsetY;
          minX = x - braceWidth; maxX = x; minY = y1; maxY = y2;
          pathD = `
            M ${x} ${y1} 
            Q ${x - r} ${y1} ${x - r} ${y1 + r} 
            V ${midY - r} 
            Q ${x - r} ${midY} ${x - braceWidth} ${midY} 
            Q ${x - r} ${midY} ${x - r} ${midY + r} 
            V ${y2 - r} 
            Q ${x - r} ${y2} ${x} ${y2}
          `.replace(/\s+/g, ' ').trim();
        } else {
          const widthVal = calculateVerticalWidth(this.options.stringCount, this.options.stringSpacing, this.options.stringThickness);
          x = widthVal + 14 + zoneOffsetY;
          minX = x; maxX = x + braceWidth; minY = y1; maxY = y2;
          pathD = `
            M ${x} ${y1} 
            Q ${x + r} ${y1} ${x + r} ${y1 + r} 
            V ${midY - r} 
            Q ${x + r} ${midY} ${x + braceWidth} ${midY} 
            Q ${x + r} ${midY} ${x + r} ${midY + r} 
            V ${y2 - r} 
            Q ${x + r} ${y2} ${x} ${y2}
          `.replace(/\s+/g, ' ').trim();
        }

        const bracePath = document.createElementNS(SVG_NS, 'path');
        bracePath.setAttribute('d', pathD);
        bracePath.setAttribute('fill', 'none');
        bracePath.setAttribute('stroke', zone.strokeColor ?? '#38bdf8');
        bracePath.setAttribute('stroke-width', String(zone.strokeWidth ?? 2));
        bracePath.setAttribute('stroke-linecap', 'round');
        bracePath.setAttribute('stroke-linejoin', 'round');
        if (strokeDash) {
          bracePath.setAttribute('stroke-dasharray', strokeDash);
        }
        bracePath.setAttribute('class', CSS_CLASSES.zoneRect);
        zoneG.appendChild(bracePath);
      }
    } else {
      // Box / Bounding rectangle mode
      const zStartFret = zone.startFret ?? 1;
      const zEndFret = zone.endFret ?? zStartFret;
      const zStartString = zone.startString ?? 1;
      const zEndString = zone.endString ?? zStartString;

      const effectiveStartFret = Math.max(zStartFret, startFret);
      const effectiveEndFret = Math.min(zEndFret, endFret);

      if (effectiveStartFret > effectiveEndFret) {
        return;
      }

      const posStart = getFingeringPosition(
        zStartString,
        effectiveStartFret,
        this.options.orientation,
        this.options.stringSpacing,
        this.options.fretSpacing,
        this.options.stringCount,
        this.options.stringThickness,
        this.options.fretThickness,
        startFret
      );

      const posEnd = getFingeringPosition(
        zEndString,
        effectiveEndFret,
        this.options.orientation,
        this.options.stringSpacing,
        this.options.fretSpacing,
        this.options.stringCount,
        this.options.stringThickness,
        this.options.fretThickness,
        startFret
      );

      minX = Math.min(posStart.x, posEnd.x) - padding;
      maxX = Math.max(posStart.x, posEnd.x) + padding;
      minY = Math.min(posStart.y, posEnd.y) - padding;
      maxY = Math.max(posStart.y, posEnd.y) + padding;

      const width = maxX - minX;
      const height = maxY - minY;

      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', String(minX));
      rect.setAttribute('y', String(minY));
      rect.setAttribute('width', String(width));
      rect.setAttribute('height', String(height));
      rect.setAttribute('rx', String(zone.borderRadius ?? 8));
      rect.setAttribute('ry', String(zone.borderRadius ?? 8));
      rect.setAttribute('fill', zone.fillColor ?? 'rgba(56, 189, 248, 0.15)');
      rect.setAttribute('stroke', zone.strokeColor ?? '#38bdf8');
      rect.setAttribute('stroke-width', String(zone.strokeWidth ?? 2));
      if (strokeDash) {
        rect.setAttribute('stroke-dasharray', strokeDash);
      }
      rect.setAttribute('class', CSS_CLASSES.zoneRect);
      zoneG.appendChild(rect);
    }

    // Optional label rendering
    if (zone.label && zone.label.trim() !== '' && isFinite(minX) && isFinite(minY)) {
      const text = document.createElementNS(SVG_NS, 'text');
      const labelColor = zone.strokeColor ?? '#38bdf8';
      text.setAttribute('fill', labelColor);
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-size', String(zone.labelFontSize ?? 11));
      text.setAttribute('font-weight', String(zone.labelFontWeight ?? 'bold'));
      text.setAttribute('paint-order', 'stroke fill');
      text.setAttribute('stroke', '#ffffff');
      text.setAttribute('stroke-width', '3px');
      text.setAttribute('stroke-linejoin', 'round');
      text.setAttribute('class', CSS_CLASSES.zoneLabel);

      const labelOffsetX = zone.labelOffsetX ?? zone.titleOffsetX ?? 0;
      const labelOffsetY = zone.labelOffsetY ?? zone.titleOffsetY ?? 0;

      let labelX: number;
      let labelY: number;

      if (zoneType === 'brace' && isHorizontal) {
        labelX = (minX + maxX) / 2 + labelOffsetX;
        if (zone.position === 'bottom') {
          labelY = maxY + (zone.labelFontSize ?? 11) + 2 + labelOffsetY;
        } else {
          labelY = minY - 4 + labelOffsetY;
        }
        text.setAttribute('text-anchor', 'middle');
      } else if (zoneType === 'brace' && !isHorizontal) {
        text.setAttribute('writing-mode', 'tb');
        text.setAttribute('glyph-orientation-vertical', '0');
        if (zone.position === 'bottom') {
          labelX = minX - 6 + labelOffsetX;
        } else {
          labelX = maxX + 6 + labelOffsetX;
        }
        labelY = (minY + maxY) / 2 + labelOffsetY;
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
      } else if (isHorizontal) {
        labelX = minX + 8 + labelOffsetX;
        labelY = minY + (zone.labelFontSize ?? 11) + 2 + labelOffsetY;
        text.setAttribute('text-anchor', 'start');
      } else {
        labelX = (minX + maxX) / 2 + labelOffsetX;
        labelY = minY + (zone.labelFontSize ?? 11) + 2 + labelOffsetY;
        text.setAttribute('text-anchor', 'middle');
      }

      text.setAttribute('x', String(labelX));
      text.setAttribute('y', String(labelY));

      const labelLines = (zone.label || '').replace(/\\n/g, '\n').split(/\r?\n/);
      if (labelLines.length === 1) {
        text.textContent = labelLines[0];
      } else {
        const lineX = String(labelX);
        labelLines.forEach((lineText, i) => {
          const tspan = document.createElementNS(SVG_NS, 'tspan');
          tspan.setAttribute('x', lineX);
          if (i > 0) {
            tspan.setAttribute('dy', '1.2em');
          }
          tspan.textContent = lineText;
          text.appendChild(tspan);
        });
      }

      zoneG.appendChild(text);
    }

    group.appendChild(zoneG);
  }

  /**
   * Renders group of fingering markers
   */
  private renderFingeringsGroup(fingerings: Fingering[], svg: SVGSVGElement): void {
    const fingeringsGroup = this.createGroup(CSS_CLASSES.fingerings);
    const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);

    for (const fingering of fingerings) {
      this.renderFingering(fingering, radius, fingeringsGroup);
    }

    svg.appendChild(fingeringsGroup);
  }

  /**
   * Renders an individual fingering marker
   */
  private renderFingering(fingering: Fingering, radius: number, group: SVGElement): void {
    const startFret = this.options.startFret;
    const endFret = startFret + this.options.fretCount - 1;

    // Filter out nut markers (fret 0 or -1) if nut clearance is disabled
    if ((fingering.fret === 0 || fingering.fret === -1) && this.options.reserveNutClearance === false) {
      return;
    }

    // Filter out fingerings outside the visible range (open/muted markers fret 0 or -1 are allowed only if clearance is active)
    if (fingering.fret !== 0 && fingering.fret !== -1) {
      if (fingering.fret < startFret || fingering.fret > endFret) {
        return;
      }
    }

    const pos = getFingeringPosition(
      fingering.string,
      fingering.fret,
      this.options.orientation,
      this.options.stringSpacing,
      this.options.fretSpacing,
      this.options.stringCount,
      this.options.stringThickness,
      this.options.fretThickness,
      startFret
    );

    const g = this.createGroup(fingering.getCssClass());

    const isNutMarker = fingering.fret === 0 || fingering.fret === -1;

    if (!isNutMarker) {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', String(pos.x));
      circle.setAttribute('cy', String(pos.y));
      circle.setAttribute('r', String(radius));
      circle.setAttribute('fill', fingering.color);
      circle.setAttribute('class', CSS_CLASSES.fingeringCircle);
      g.appendChild(circle);
    }

    if (fingering.text) {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', String(pos.x));
      text.setAttribute('y', String(pos.y));
      // For standalone nut markers (no circle), default fill color if non-customized (#000000 for open 'O', #ef4444 for muted 'X')
      let fill = fingering.textColor;
      if (isNutMarker && fingering.textColor === DEFAULT_FINGERING_TEXT_COLOR) {
        fill = fingering.fret === -1 ? '#ef4444' : '#000000';
      }
      text.setAttribute('fill', fill);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      const fontSize = Math.round(radius * 1.2);
      text.setAttribute('font-size', String(fontSize));
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-weight', 'bold');
      const textClass = isNutMarker ? 'fretzee-fingering-text fretzee-open-marker' : CSS_CLASSES.fingeringText;
      text.setAttribute('class', textClass);
      text.textContent = fingering.text;
      g.appendChild(text);
    }

    group.appendChild(g);
  }
}
