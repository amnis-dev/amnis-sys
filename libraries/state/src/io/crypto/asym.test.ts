import {
  asymGenerate,
  asymEncrypt,
  asymDecrypt,
  asymSign,
  asymVerify,
} from './asym.js';

const data = 'This is a secret';

test('should generate a key pair', async () => {
  const keyPairEncrypt = await asymGenerate('encryptor');
  expect(typeof keyPairEncrypt.privateKey).toBeDefined();
  expect(typeof keyPairEncrypt.publicKey).toBeDefined();

  const keyPairSign = await asymGenerate('signer');
  expect(typeof keyPairSign.privateKey).toBeDefined();
  expect(typeof keyPairSign.publicKey).toBeDefined();
});

test('should generate a key pair, encrypt data, and decrypt data', async () => {
  const keyPair = await asymGenerate('encryptor');

  const encryption = await asymEncrypt(data, keyPair.publicKey);
  expect(encryption).toBeDefined();

  const decryption = await asymDecrypt(encryption, keyPair.privateKey);
  expect(decryption).toBe(data);
});

test('should generate a key pair, encrypt data, and fail decryption with invalid key', async () => {
  const keyPair = await asymGenerate('encryptor');

  const encryption = await asymEncrypt(data);
  expect(encryption).toBeDefined();

  const decryption = await asymDecrypt(encryption, keyPair.privateKey);
  expect(decryption).toBeUndefined();
});

test('should sign data and verify that signarture', async () => {
  const signature = await asymSign(data);
  const verification = await asymVerify(data, signature);
  expect(verification).toBe(true);
});

test('should sign data and not verify different data', async () => {
  const signature = await asymSign(data);
  const dataNew = 'this is another secret';
  const verification = await asymVerify(dataNew, signature);
  expect(verification).toBe(false);
});

test('should sign data and not verify different signature', async () => {
  const keyPair = await asymGenerate('signer');
  const signatureAnother = await asymSign(data, keyPair.privateKey);
  const verification = await asymVerify(data, signatureAnother);
  expect(verification).toBe(false);
});
