import { routeCreate, routeRoot, routeSlice } from './route.js';

/**
 * ============================================================
 */
test('route key should be is properly set', () => {
  expect(routeSlice.key).toEqual('route');
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
