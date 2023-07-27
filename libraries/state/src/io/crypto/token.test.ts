import { dateNumeric } from '../../core/index.js';
import { asymGenerate, asymVerify } from './asym.js';
import { tokenDecode, tokenSign, tokenVerify } from './token.js';

const payload = {
  exp: dateNumeric('1h') / 1000,
  msg: 'Hello World',
};

test('should create a new json web token', async () => {
  const tokenSigned = await tokenSign(payload);

  expect(tokenSigned).toBeDefined();

  const [header, body, signature] = tokenSigned.split('.');
  expect(header).toBeDefined();
  expect(body).toBeDefined();
  expect(signature).toBeDefined();
});

test('should create a new json web token and verify it', async () => {
  const tokenSigned = await tokenSign(payload);
  const tokenVerified = await tokenVerify(tokenSigned);

  expect(tokenVerified).toBeDefined();
  expect(tokenVerified).toEqual({
    iat: expect.any(Number),
    ...payload,
  });
});

test('should create a new json web token and NOT verify it with different private key', async () => {
  const keyPair = await asymGenerate('signer');
  const tokenSigned = await tokenSign(payload, keyPair.privateKey);
  const tokenVerified = await tokenVerify(tokenSigned);

  expect(tokenVerified).toBeUndefined();
});

test('should create a new json web token and NOT verify it with different public key', async () => {
  const keyPair = await asymGenerate('signer');
  const tokenSigned = await tokenSign(payload);
  const tokenVerified = await tokenVerify(tokenSigned, keyPair.publicKey);

  expect(tokenVerified).toBeUndefined();
});

test('should create a new json web token, decode it, then verify the decoded data', async () => {
  const tokenSigned = await tokenSign(payload);
  const [tokenDecoded, tokenRaw, tokenSignature] = await tokenDecode(tokenSigned);

  if (!tokenDecoded || !tokenRaw || !tokenSignature) {
    expect(tokenDecoded).toBeDefined();
    expect(tokenRaw).toBeDefined();
    expect(tokenSignature).toBeDefined();
    return;
  }
  const verified = await asymVerify(tokenRaw, tokenSignature);
  expect(verified).toBe(true);
});
