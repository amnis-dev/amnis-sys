import { dateNumeric, uid } from '../../core/index.js';
import { sessionSlice, userSlice } from '../../data/index.js';
import { sessionDecrypt, sessionEncrypt } from './session.js';

test('should encrypt a session', async () => {
  const session = sessionSlice.create({
    $subject: uid(userSlice.key),
    exp: dateNumeric('30m'),
  });

  const sessionEncrypted = await sessionEncrypt(session);

  expect(sessionEncrypted).toBeDefined();
  expect(sessionEncrypted).toEqual(expect.any(String));
});

test('should encrypt and decrypt a session', async () => {
  const session = sessionSlice.create({
    $subject: uid(userSlice.key),
    exp: dateNumeric('30m'),
  });

  const sessionEncrypted = await sessionEncrypt(session);
  const sessionDecrypted = await sessionDecrypt(sessionEncrypted);

  expect(sessionDecrypted).toBeDefined();
  expect(sessionDecrypted).toMatchObject({
    ...session,
    exp: expect.any(Number),
  });
});

test('should encrypt and not decrypt an expired session', async () => {
  const session = sessionSlice.create({
    $subject: uid(userSlice.key),
    exp: dateNumeric(),
  });

  const sessionEncrypted = await sessionEncrypt(session);
  expect(sessionEncrypted).toBeDefined();
  expect(sessionEncrypted).toEqual(expect.any(String));

  const sessionDecrypted = await sessionDecrypt(sessionEncrypted);
  expect(sessionDecrypted).toBeUndefined();
});
