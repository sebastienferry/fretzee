/**
 * SVG renderer for Fretboard Renderer Library
 */

import type { FretboardOptions, Marker as MarkerInterface, Zone } from '../fretboard/types';
import { SVG_NS, CSS_CLASSES, TITLE_FONT_SIZE, TITLE_PADDING, DEFAULT_FINGERING_TEXT_COLOR } from '../fretboard/constants';
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

    // Additional adjustments for open string / muted string fingerings (fret 0 or fret -1)
    const hasOpenStrings = fingerings.some(f => f.fret === 0 || f.fret === -1);
    const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);
    const openOffset = (this.options.fretSpacing * 0.50) + radius + 5;

    if (hasOpenStrings) {
      if (isHorizontal) {
        viewBoxX -= openOffset;
        width += openOffset;
      } else {
        viewBoxY -= openOffset;
        height += openOffset;
      }
    }

    // Additional adjustment for fingerings on string 1 (top string in horizontal mode)
    const hasTopStringFingerings = isHorizontal && fingerings.some(f => f.string === 1);
    const topMarkerOffset = hasTopStringFingerings ? radius + 5 : 0;
    if (hasTopStringFingerings) {
      viewBoxY -= topMarkerOffset;
      height += topMarkerOffset;
    }

    // Additional adjustment for title or zone labels
    const hasZoneLabels = Boolean(this.options.zones && this.options.zones.some(z => z.label && z.label.trim().length > 0));
    const hasTitle = Boolean(this.options.title && this.options.title.trim().length > 0);
    const titleSpace = TITLE_FONT_SIZE + TITLE_PADDING;
    if (hasTitle || (hasZoneLabels && isHorizontal)) {
      viewBoxY -= titleSpace;
      height += titleSpace;
    }
    
    // Additional adjustments for inlays
    if (!isHorizontal && this.options.showInlays) {
      const extraThickness = this.options.stringThickness * (this.options.stringCount - 1);
      viewBoxX -= inlayOffset + extraThickness; // Extend left for inlays + thickness
      width += inlayOffset + extraThickness; // Space for text
    }
    if (isHorizontal && this.options.showInlays) {
      const extraThickness = this.options.stringThickness * (this.options.stringCount - 1);
      height += inlayOffset + extraThickness; // Space for text below + thickness
    }

    // Additional adjustment for tuning labels
    const hasTuning = Boolean(this.options.tuning && Array.isArray(this.options.tuning) && this.options.tuning.length > 0);
    const tuningOffset = hasTuning ? (isHorizontal ? 25 : 20) : 0;
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
      this.renderVertical(strings, frets, inlays, markers, fingerings, svg, width, height, (hasOpenStrings ? openOffset : 0) + tuningOffset);
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
    // Render title if specified
    if (this.options.title && this.options.title.trim().length > 0) {
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
    // Render title if specified
    if (this.options.title && this.options.title.trim().length > 0) {
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
    if (!this.options.tuning || !Array.isArray(this.options.tuning) || this.options.tuning.length === 0) {
      return;
    }

    const tuningGroup = this.createGroup(CSS_CLASSES.tuning);
    const stringCount = this.options.stringCount;
    const tuning = this.options.tuning;

    const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);
    const hasAnyOpenMarker = (this.options.fingerings || []).some(f => f.fret === 0 || f.fret === -1);
    
    // Uniform offset across all strings to keep labels aligned in a straight line
    const openOffset = (this.options.fretSpacing * 0.50) + radius;
    const uniformOffset = hasAnyOpenMarker ? -(openOffset + 14) : -(radius + 12);

    // tuning is provided 6th string to 1st string (lowest string to highest string)
    for (let i = 0; i < stringCount; i++) {
      // Map stringIndex (0 = highest/1st string, N-1 = lowest/Nth string)
      const tuningIndex = (stringCount - 1) - i;
      const noteLabel = tuning[tuningIndex];
      if (noteLabel === undefined || noteLabel === null || noteLabel.trim() === '') continue;

      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('class', `${CSS_CLASSES.tuningLabel} fretzee-tuning-s${i + 1}`);
      text.setAttribute('fill', '#000000');
      text.setAttribute('font-size', '10');
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
        text.setAttribute('text-anchor', 'end');
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
        text.setAttribute('dominant-baseline', 'auto');
      }

      text.textContent = noteLabel;
      tuningGroup.appendChild(text);
    }

    svg.appendChild(tuningGroup);
  }

  /**
   * Renders the diagram title text above the fretboard
   */
  private renderTitle(svg: SVGSVGElement, isHorizontal: boolean, topOffset = 0): void {
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('class', CSS_CLASSES.title);
    text.setAttribute('fill', '#000000');
    text.setAttribute('font-size', String(TITLE_FONT_SIZE));
    text.setAttribute('font-family', 'sans-serif');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('dominant-baseline', 'auto');

    const alignment = this.options.titleAlignment || 'center';
    let xPosition = 0;

    if (alignment === 'left') {
      text.setAttribute('text-anchor', 'start');
      xPosition = 0;
    } else {
      text.setAttribute('text-anchor', 'middle');
      if (isHorizontal) {
        xPosition = calculateHorizontalWidth(this.options.fretCount, this.options.fretSpacing) / 2;
      } else {
        xPosition = calculateVerticalWidth(this.options.stringCount, this.options.stringSpacing, this.options.stringThickness) / 2;
      }
    }

    // Y position is above the fretboard area and any top string/nut markers
    const yPosition = -(TITLE_PADDING + topOffset);

    text.setAttribute('x', String(xPosition));
    text.setAttribute('y', String(yPosition));
    text.textContent = this.options.title;

    svg.appendChild(text);
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
    line.setAttribute('stroke', '#000000');
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
    line.setAttribute('stroke', '#000000');
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
        polygon.setAttribute('stroke-width', String(padding * 2));
        polygon.setAttribute('stroke-linejoin', 'round');
        polygon.setAttribute('stroke-linecap', 'round');
        if (zone.strokeDashArray) {
          polygon.setAttribute('stroke-dasharray', zone.strokeDashArray);
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
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        if (zone.strokeDashArray) {
          path.setAttribute('stroke-dasharray', zone.strokeDashArray);
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

      if (isHorizontal) {
        const x1 = Math.min(pos1.x, pos2.x) - radius;
        const x2 = Math.max(pos1.x, pos2.x) + radius;
        const y = -14;
        const midX = (x1 + x2) / 2;
        const heightVal = 10;

        // Authentic mathematical curly brace accolade:
        // Left curve ({), central peak (v), right curve (})
        const braceHeight = 12;
        const r = 6; // Corner radius for curves
        const pathD = `
          M ${x1} ${y} 
          Q ${x1} ${y - r} ${x1 + r} ${y - r} 
          H ${midX - r} 
          Q ${midX} ${y - r} ${midX} ${y - braceHeight} 
          Q ${midX} ${y - r} ${midX + r} ${y - r} 
          H ${x2 - r} 
          Q ${x2} ${y - r} ${x2} ${y}
        `.replace(/\s+/g, ' ').trim();

        const bracePath = document.createElementNS(SVG_NS, 'path');
        bracePath.setAttribute('d', pathD);
        bracePath.setAttribute('fill', 'none');
        bracePath.setAttribute('stroke', zone.strokeColor ?? '#38bdf8');
        bracePath.setAttribute('stroke-width', '2');
        bracePath.setAttribute('stroke-linecap', 'round');
        bracePath.setAttribute('stroke-linejoin', 'round');
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
      rect.setAttribute('stroke-width', '2');
      if (zone.strokeDashArray) {
        rect.setAttribute('stroke-dasharray', zone.strokeDashArray);
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
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('class', CSS_CLASSES.zoneLabel);

      if (isHorizontal) {
        text.setAttribute('x', String(minX + 8));
        text.setAttribute('y', String(minY - 6));
        text.setAttribute('text-anchor', 'start');
      } else {
        text.setAttribute('x', String((minX + maxX) / 2));
        text.setAttribute('y', String(minY - 6));
        text.setAttribute('text-anchor', 'middle');
      }

      text.textContent = zone.label;
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

    // Filter out fingerings outside the visible range (open/muted markers fret 0 or -1 are always allowed)
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
      const fontSize = isNutMarker ? Math.round(radius * 1.5) : Math.round(radius * 1.2);
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
