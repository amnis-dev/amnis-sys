import { passCompare, passHash } from './pass.js';

test('should hash a password', async () => {
  const password = 'MyPassword123';
  const passwordHashed1 = await passHash(password);
  const passwordHashed2 = await passHash(password);
  expect(passwordHashed1).toBeDefined();
  expect(passwordHashed2).toBeDefined();

  // Two hashes should never be the same with random salting.
  expect(passwordHashed1 === passwordHashed2).toBe(false);
});

test('should hash a password and validate hash value with the original', async () => {
  const password = 'MyPassword123';
  const passwordHashed = await passHash(password);
  const result = await passCompare(password, passwordHashed);

  expect(result).toBe(true);
});

test('should hash a password and NOT validate hash with a different password', async () => {
  const password = 'MyPassword123';
  const passwordHashed = await passHash(password);
  const result = await passCompare('MyPassword12', passwordHashed);

  expect(result).toBe(false);
});
