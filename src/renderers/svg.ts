/**
 * SVG renderer for Fretboard Renderer Library
 */

import type { FretboardOptions, Marker as MarkerInterface } from '../fretboard/types';
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

    // Additional adjustment for title
    const hasTitle = Boolean(this.options.title && this.options.title.trim().length > 0);
    const titleSpace = TITLE_FONT_SIZE + TITLE_PADDING;
    if (hasTitle) {
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
