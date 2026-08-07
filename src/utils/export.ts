/**
 * Utility functions for exporting SVG element as PNG blob, data URL, and file downloads
 */

import type { PNGExportOptions } from '../fretboard/types';

/**
 * Converts an SVG element into a PNG Blob using native HTML5 Canvas
 *
 * @param svgElement - The SVG element to rasterize
 * @param options - Scaling and quality options
 * @returns Promise resolving to PNG Blob
 */
export async function exportSvgToPngBlob(
  svgElement: SVGSVGElement,
  options: PNGExportOptions = {}
): Promise<Blob> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('PNG export requires a DOM environment with Canvas support.');
  }

  const scale = options.scale ?? 2;
  const quality = options.quality ?? 1.0;

  // Serialize SVG to XML string
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  // Ensure xmlns attribute is present for proper image loading
  if (!svgString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Get SVG dimensions (falling back to viewbox or bounding rect)
  let width = parseFloat(svgElement.getAttribute('width') || '0');
  let height = parseFloat(svgElement.getAttribute('height') || '0');

  if (!width || !height) {
    const bbox = svgElement.getBoundingClientRect();
    width = bbox.width || 300;
    height = bbox.height || 150;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
  }

  // Scale canvas for high-DPI rasterization
  ctx.scale(scale, scale);

  // Encode SVG string to Blob / Object URL
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate PNG Blob from canvas.'));
          }
        },
        'image/png',
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to render SVG to Image: ${err}`));
    };

    img.src = url;
  });
}

/**
 * Converts an SVG element into a PNG Data URL string
 */
export async function exportSvgToPngDataUrl(
  svgElement: SVGSVGElement,
  options: PNGExportOptions = {}
): Promise<string> {
  const blob = await exportSvgToPngBlob(svgElement, options);
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to Data URL.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Triggers a browser file download for a PNG Blob
 */
export function triggerPngDownload(blob: Blob, filename = 'fretboard.png'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('PNG download requires a browser DOM environment.');
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
