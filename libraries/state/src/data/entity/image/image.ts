import type { Image, ImageRoot, ImageMinimal } from './image.types.js';
import { uid } from '../../../core/index.js';
import { fileCreate } from '../file/file.js';

const imageKey = 'image';

export const imageRoot: ImageRoot = {
  extension: 'webp',
  mimetype: 'image/webp',
  width: 0,
  height: 0,
  aspect: 0,
  title: '',
  slug: '',
  size: 0,
};

export function imageCreate(
  image: ImageMinimal,
): Image {
  return {
    ...imageRoot,
    ...fileCreate(image),
    aspect: image.aspect ?? (image.width / image.height),
    $id: uid(imageKey),
  };
}
