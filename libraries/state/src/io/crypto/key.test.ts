import { asymGenerate, asymSign, asymVerify } from './asym.js';
import {
  keyExport, keyImport, keyUnwrap, keyWrap,
} from './key.js';

test('should wrap and unwrap key to verify signature', async () => {
  const data = 'hello world';
  const asymSignerKeys = await asymGenerate('signer');

  const wrapped = await keyWrap(asymSignerKeys.privateKey, 'passwd12');
  const unwrapped = await keyUnwrap(wrapped, 'passwd12');

  if (!unwrapped) {
    expect(unwrapped).toBeDefined();
    return;
  }

  const signature = await asymSign(data, unwrapped);
  const verify = await asymVerify(data, signature, asymSignerKeys.publicKey);

  expect(verify).toBe(true);
});

test('should wrap and fail to unwrap key with invalid password', async () => {
  const asymSignerKeys = await asymGenerate('signer');

  const wrapped = await keyWrap(asymSignerKeys.privateKey, 'passwd12');
  const unwrapped = await keyUnwrap(wrapped, 'passwd11');

  expect(unwrapped).toBeUndefined();
});

test('should export public key and import it back again to verify signature', async () => {
  const data = 'hello world';
  const asymSignerKeys = await asymGenerate('signer');

  const exported = await keyExport(asymSignerKeys.publicKey);
  const imported = await keyImport(exported);

  if (!imported) {
    expect(imported).toBeDefined();
    return;
  }

  const signature = await asymSign(data, asymSignerKeys.privateKey);
  const verify = await asymVerify(data, signature, imported);

  expect(verify).toBe(true);
});
