import type { DataMinimal, DataRoot } from '../../data.types.js';
import type { File } from '../file/file.types.js';

export interface Image extends File {
  /**
   * image extention type.
   */
  extension: 'webp' | 'jpeg' | 'png' | 'bmp' | 'tiff';

  /**
   * Original width in pixels.
   */
  width: number;

  /**
   * Original height in pixels.
   */
  height: number;

  /**
   * Aspect ratio calculation (width / height).
   */
  aspect: number;
}

/**
 * Image properties excluding the extended entity properties.
 */
export type ImageRoot = DataRoot<Image>;

/**
   * Root properties in order to create an image.
   */
export type ImageMinimal = DataMinimal<Image, 'title' | 'mimetype' | 'size' | 'extension' | 'width' | 'height'>;
