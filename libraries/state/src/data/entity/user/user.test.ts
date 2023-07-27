import { userCreate, userSlice } from './user.js';

/**
 * ============================================================
 */
test('user key should be is properly set', () => {
  expect(userSlice.key).toEqual('user');
});

/**
 * ============================================================
 */
test('should create a user', async () => {
  const user = userCreate({
    handle: 'Newbie',
    email: 'newbie@amnis.dev',
  });

  expect(user).toEqual(
    expect.objectContaining({
      handle: expect.any(String),
      email: expect.any(String),
      $credentials: expect.any(Array),
      $roles: expect.any(Array),
      $permits: expect.any(Array),
    }),
  );
});
