/**
 * SVG renderer for Fretboard Renderer Library
 */

import type { FretboardOptions, Marker as MarkerInterface } from '../fretboard/types';
import { SVG_NS, CSS_CLASSES } from '../fretboard/constants';
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
    
    // Additional adjustments for inlays
    if (!isHorizontal && this.options.showInlays) {
      viewBoxX -= inlayOffset; // Extend left for inlays
      width += inlayOffset; // Space for text
    }
    if (isHorizontal && this.options.showInlays) {
      height += inlayOffset; // Space for text below
    }

    // Additional adjustments for open string fingerings (fret 0)
    const hasOpenStrings = fingerings.some(f => f.fret === 0);
    if (hasOpenStrings) {
      const radius = calculateFingeringRadius(this.options.stringSpacing, this.options.fretSpacing);
      const openOffset = (this.options.fretSpacing * 0.35) + radius + 5;
      if (isHorizontal) {
        viewBoxX -= openOffset;
        width += openOffset;
      } else {
        viewBoxY -= openOffset;
        height += openOffset;
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
      this.renderHorizontal(strings, frets, inlays, markers, fingerings, svg, width, height);
    } else {
      this.renderVertical(strings, frets, inlays, markers, fingerings, svg, width, height);
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
    _height: number
  ): void {
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
    height: number
  ): void {
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
   * Renders a string in horizontal orientation
   */
  private renderHorizontalString(str: GuitarString, width: number, group: SVGElement): void {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', '0');
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

    for (const fretNum of this.options.inlayPositions) {
      if (fretNum > this.options.fretCount) continue;
      const fretX = (fretNum - 0.5) * this.options.fretSpacing;
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

    for (const fretNum of this.options.inlayPositions) {
      if (fretNum > this.options.fretCount) continue;
      const fretY = (fretNum - 0.5) * this.options.fretSpacing;
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
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', String(str.x + str.thickness / 2));
    line.setAttribute('y1', '0');
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
    circle.setAttribute('class', 'fretly-marker');
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
    const pos = getFingeringPosition(
      fingering.string,
      fingering.fret,
      this.options.orientation,
      this.options.stringSpacing,
      this.options.fretSpacing,
      this.options.stringCount,
      this.options.stringThickness
    );

    const g = this.createGroup(fingering.getCssClass());

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', String(radius));
    circle.setAttribute('fill', fingering.color);
    circle.setAttribute('class', CSS_CLASSES.fingeringCircle);
    g.appendChild(circle);

    if (fingering.text) {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', String(pos.x));
      text.setAttribute('y', String(pos.y));
      text.setAttribute('fill', fingering.textColor);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-size', String(Math.round(radius * 1.2)));
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('class', CSS_CLASSES.fingeringText);
      text.textContent = fingering.text;
      g.appendChild(text);
    }

    group.appendChild(g);
  }
}
