import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Bulletin, BulletinRoot, BulletinMinimal } from './bulletin.types.js';

const bulletinKey = 'bulletin';

export const bulletinRoot = (): BulletinRoot => ({
  title: 'Bulletin',
  markdown: 'Bulletin message',
  tags: [],
});

export function bulletinCreate(
  bulletin: BulletinMinimal,
): Bulletin {
  return {
    ...bulletinRoot(),
    ...bulletin,
    $id: uid(bulletinKey),
  };
}

export const bulletinSlice = entitySliceCreate({
  key: bulletinKey,
  create: bulletinCreate,
});
