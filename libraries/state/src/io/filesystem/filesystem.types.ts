/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UID } from '../../core/index.js';
import type { Image } from '../../data/index.js';

/**
 * Method for saving data.
 */
export type FilesystemImageWriteMethod = (
  image: ArrayBuffer,
  imageProps: Partial<Image>
) => Promise<Image | undefined>;

/**
 * Method for saving data.
 */
export type FilesystemImageReadMethod = (
  imageId: UID<Image>,
  options?: {
    height?: number,
    width?: number,
  }
) => Promise<ArrayBuffer | undefined>;

/**
 * Core interface for database methods.
 */
export interface Filesystem {
  /**
   * Method to implement file system initialization.
   */
  initialize: (...params: any[]) => void;

  /**
   * Method for saving/storing files onto the filesystem.
   * If successful, it will return the storaged file information.
   */
  imageWrite: FilesystemImageWriteMethod;

  /**
   * Method for reading images from
   */
  imageRead: FilesystemImageReadMethod;
}
