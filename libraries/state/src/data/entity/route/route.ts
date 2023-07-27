import { uid } from '../../../core/index.js';
import type { Route, RouteRoot, RouteMinimal } from './route.types.js';

export const routeKey = 'route';

export const routeRoot: RouteRoot = {
  label: '',
  path: '/',
};

export function routeCreate(
  route: RouteMinimal,
): Route {
  return {
    ...routeRoot,
    ...route,
    $id: uid(routeKey),
  };
}
