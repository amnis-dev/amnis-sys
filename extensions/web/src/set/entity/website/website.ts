import { uid, entitySliceCreate } from '@amnis/state';
import type { Website, WebsiteMinimal, WebsiteRoot } from './website.types.js';

export const websiteKey = 'website';

export const websiteRoot = (): WebsiteRoot => ({
  hostname: 'localhost',
  title: 'Website Title',
  routes: [],
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
