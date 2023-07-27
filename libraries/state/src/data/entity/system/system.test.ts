import { uid } from '../../../core/index.js';
import { systemCreate, systemSlice } from './system.js';

/**
 * ============================================================
 */
test('system key should be is properly set', () => {
  expect(systemSlice.key).toEqual('system');
});

/**
 * ============================================================
 */
test('should create a system', () => {
  const system = systemCreate({
    name: 'Amnis System',
    $adminRole: uid('role'),
    $execRole: uid('role'),
    $initialRoles: [uid('role')],
  });

  expect(system).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );
});
