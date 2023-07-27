import { routeKey, routeCreate, routeRoot } from './route.js';

/**
 * ============================================================
 */
test('route key should be is properly set', () => {
  expect(routeKey).toEqual('route');
});

/**
 * ============================================================
 */
test('should create a route', () => {
  const route = routeCreate(routeRoot);

  expect(route).toEqual(
    expect.objectContaining(routeRoot),
  );
});
