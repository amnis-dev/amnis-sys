import type { UIDv2Key } from '@amnis/state';
import { uid, entitySliceCreate } from '@amnis/state';
import type {
  WebComponent, WebComponentID, WebComponentMinimal, WebComponentRoot,
} from './webComponent.types.js';

export const webComponentKey: UIDv2Key<WebComponentID> = 'webComponent';

export const webComponentRoot = (): WebComponentRoot => ({
  key: 'Unkeyed',
  type: 'other',
  description: '',
  schema: '',
});

export function webComponentCreate(
  webComponent: WebComponentMinimal,
): WebComponent {
  return {
    ...webComponentRoot(),
    ...webComponent,
    $id: uid(webComponentKey),
  };
}

export const webComponentSlice = entitySliceCreate({
  key: webComponentKey,
  create: webComponentCreate,
});
