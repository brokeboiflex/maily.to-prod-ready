export function getAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Calculates new height based on width and aspect ratio
 * @param width - The new width
 * @param aspectRatio - The aspect ratio (width/height)
 * @returns The corresponding height
 */
export function getNewHeight(width: number, aspectRatio: number): number {
  if (width <= 0 || aspectRatio <= 0) {
    return 0;
  }
  return width / aspectRatio;
}

/**
 * Calculates new width based on height and aspect ratio
 * @param height - The new height
 * @param aspectRatio - The aspect ratio (width/height)
 * @returns The corresponding width
 */
export function getNewWidth(height: number, aspectRatio: number): number {
  return height * aspectRatio;
}
