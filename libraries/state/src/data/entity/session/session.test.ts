import { uid, dateNumeric } from '../../../core/index.js';
import { sessionCreate, sessionSlice } from './session.js';

/**
 * ============================================================
 */
test('session key should be is properly set', () => {
  expect(sessionSlice.key).toEqual('session');
});

/**
 * ============================================================
 */
test('should create a session', () => {
  const session = sessionCreate({
    $subject: uid('user'),
    exp: dateNumeric(),
  });

  expect(session).toEqual(
    expect.objectContaining({
      $subject: expect.any(String),
      $credential: expect.any(String),
      exp: expect.any(Number),
      prv: false,
      adm: false,
      exc: false,
    }),
  );
});
