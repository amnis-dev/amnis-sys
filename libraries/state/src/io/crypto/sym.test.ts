import { symDecrypt, symEncrypt, symGenerate } from './sym.js';

const data = 'Hello Symmetric Encryption';

test('should symmetrically encrypt data', async () => {
  const encrypted = await symEncrypt(data);
  expect(typeof encrypted === 'string').toBe(true);
});

test('should produce different encryption values with same data.', async () => {
  const encrypted1 = await symEncrypt(data);
  const encrypted2 = await symEncrypt(data);
  expect(encrypted1 === encrypted2).toBe(false);
});

test('should symmetrically encrypt data and decrypt data', async () => {
  const encrypted = await symEncrypt(data);
  const decrypted = await symDecrypt(encrypted);

  expect(decrypted).toBe(data);
});

test('should symmetrically encrypt data and NOT decrypt data with different encryption key', async () => {
  const key = await symGenerate();
  const encrypted = await symEncrypt(data, key);
  const decrypted = await symDecrypt(encrypted);

  expect(decrypted).toBeUndefined();
});

test('should symmetrically encrypt data and NOT decrypt data with different decryption key', async () => {
  const key = await symGenerate();
  const encrypted = await symEncrypt(data);
  const decrypted = await symDecrypt(encrypted, key);

  expect(decrypted).toBeUndefined();
});
