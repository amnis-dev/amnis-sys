import { uid, entitySliceCreate } from '@amnis/state';
import type { Website, WebsiteMinimal, WebsiteRoot } from './website.types.js';

export const websiteKey = 'website';

export const websiteRoot = (): WebsiteRoot => ({
  hostname: 'localhost',
  title: 'Website Title',
  description: 'Website description.',
  $routes: [],
  fontTitle: 'roboto',
  fontBody: 'roboto',
  fontCode: 'roboto-mono',
  fontUi: 'roboto',
});

export function websiteCreate(
  website: WebsiteMinimal,
): Website {
  return {
    ...websiteRoot(),
    ...website,
    $id: uid(websiteKey),
  };
}

export const websiteSlice = entitySliceCreate({
  key: websiteKey,
  create: websiteCreate,
});
