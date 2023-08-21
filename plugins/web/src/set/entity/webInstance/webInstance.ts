import type { UIDv2Key } from '@amnis/state';
import { uid, entitySliceCreate, uidv2 } from '@amnis/state';
import type {
  WebInstance, WebInstanceID, WebInstanceMinimal, WebInstanceRoot,
} from './webInstance.types.js';

export const webInstanceKey: UIDv2Key<WebInstanceID> = 'webInstance';

export const webInstanceRoot = (): WebInstanceRoot => ({
  name: 'Unnamed',
  props: {},
  routeMatcher: '',
  $route: undefined,
  $children: [],
  $webComponent: uidv2('webComponent'),
});

export function webInstanceCreate(
  webInstance: WebInstanceMinimal,
): WebInstance {
  return {
    ...webInstanceRoot(),
    ...webInstance,
    $id: uid(webInstanceKey),
  };
}

export const webInstanceSlice = entitySliceCreate({
  key: webInstanceKey,
  create: webInstanceCreate,
});
