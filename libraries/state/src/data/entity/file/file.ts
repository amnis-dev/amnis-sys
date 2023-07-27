import { uid } from '../../../core/index.js';
import type { File, FileRoot, FileMinimal } from './file.types.js';

export const fileKey = 'file';

export const fileRoot = (): FileRoot => ({
  title: 'Untitled File',
  slug: '',
  mimetype: 'text/plain',
  size: 0,
});

export function fileCreate(
  file: FileMinimal,
): File {
  return {
    ...fileRoot(),
    ...file,
    slug: file.slug?.length ? file.slug : file.title.replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '').toLowerCase(),
    $id: uid(fileKey),
  };
}
