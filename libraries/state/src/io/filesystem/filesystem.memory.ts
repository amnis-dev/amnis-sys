import {
  imageCreate,
  entityCreate,
} from '../../data/entity/index.js';
import type { Filesystem } from './filesystem.types.js';
import { Webp } from './filesystem.webp.js';

const storage: Record<string, ArrayBuffer> = {};

export const filesystemMemory: Filesystem = {
  initialize: () => { /** noop */ },

  imageWrite: async (image, entity = {}) => {
    try {
      /**
       * Validate and calulate the image size.
       */
      const imageBuffer = Buffer.from(image);
      const valid = Webp.validate(imageBuffer);

      if (!valid) {
        return undefined;
      }

      const { height, width } = Webp.calculate(imageBuffer);

      if (!height || !width) {
        return undefined;
      }

      /**
       * Create an image entity.
       */
      const imageEntity = entityCreate(imageCreate({
        extension: 'webp',
        mimetype: 'image/webp',
        title: 'Unknown Image',
        height,
        width,
        size: image.byteLength,
        ...entity,
      }));

      /**
       * Save the file to databaseMemory.
       */
      storage[imageEntity.$id] = image;

      /**
       * Return the image entity object.
       */
      return imageEntity;
    } catch (error) {
      return undefined;
    }
  },

  imageRead: async (imageId) => storage[imageId],
};

export default filesystemMemory;
