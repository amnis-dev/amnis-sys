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
  const root = routeRoot();
  const route = routeCreate(root);

  expect(route).toEqual(
    expect.objectContaining(root),
  );
});
