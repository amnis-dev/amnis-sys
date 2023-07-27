import { dateNumeric, uid } from '../../core/index.js';
import type { JWTAccess } from '../../core/index.js';
import { accessEncode, accessVerify } from './access.js';
import { asymGenerate } from './asym.js';

const jwtAccess: JWTAccess = {
  iss: '',
  sub: uid(''),
  exp: dateNumeric('1h'),
  typ: 'access',
};

const jwtAccessExpired: JWTAccess = {
  iss: '',
  sub: uid(''),
  exp: dateNumeric(),
  typ: 'access',
};

test('should encode and verify access token from singleton asymmetric key', async () => {
  const encoded = await accessEncode(jwtAccess);
  expect(encoded).toBeDefined();

  const verified = await accessVerify(encoded);
  expect(verified).toEqual({
    ...jwtAccess,
    exp: expect.any(Number),
    iat: expect.any(Number),
  });
});

test('should encode and verify access token from generated asymmetric key', async () => {
  const keyPair = await asymGenerate('signer');
  const encoded = await accessEncode(jwtAccess, keyPair.privateKey);
  expect(encoded).toBeDefined();

  const verified = await accessVerify(encoded, keyPair.publicKey);
  expect(verified).toEqual({
    ...jwtAccess,
    exp: expect.any(Number),
    iat: expect.any(Number),
  });
});

test('should encode and NOT verify access token due to expiration', async () => {
  const encoded = await accessEncode(jwtAccessExpired);
  expect(encoded).toBeDefined();

  const verified = await accessVerify(encoded);
  expect(verified).toBeUndefined();
});

test('should encode and NOT verify access token from different generated asymmetric key', async () => {
  const keyPair = await asymGenerate('signer');
  const encoded = await accessEncode(jwtAccess, keyPair.privateKey);
  expect(encoded).toBeDefined();

  const verified = await accessVerify(encoded);
  expect(verified).toBeUndefined();
});
