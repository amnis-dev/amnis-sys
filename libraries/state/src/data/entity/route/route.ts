import { uid } from '../../../core/index.js';
import { entityCreate } from '../entity.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Entity } from '../entity.types.js';
import type { Route, RouteRoot, RouteMinimal } from './route.types.js';

export const routeKey = 'route';

export const routeRoot: () => RouteRoot = () => ({
  label: 'Index',
  path: '/',
});

export function routeCreate(
  route: RouteMinimal,
): Route {
  return {
    ...routeRoot(),
    ...route,
    $id: uid(routeKey),
  };
}

/**
 * Create multiple route entities from a single object.
 */
export function routeMapEntities(
  routes: { [label: string]: Omit<RouteMinimal, 'label'> },
): Entity<Route>[] {
  return Object.keys(routes).map((label) => (entityCreate<Route>(routeCreate({
    label,
    ...routes[label],
  }))));
}

export const routeSlice = entitySliceCreate({
  key: routeKey,
  create: routeCreate,
});
