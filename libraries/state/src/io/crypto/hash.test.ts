import { hashData } from './hash.js';

const dataSample = 'Hello data to hash';

test('should hash data', async () => {
  const hashed = await hashData(dataSample);
  expect(typeof hashed === 'string').toBe(true);
  // expect(hashed.length).toBe(44);
});

test('should produce equal hashes for same data', async () => {
  const hashed1 = await hashData(dataSample);
  const hashed2 = await hashData(dataSample);
  expect(hashed1 === hashed2).toBe(true);
});

test('should produce different hashes for different data', async () => {
  const hashed1 = await hashData(dataSample);
  const hashed2 = await hashData('Hello different data to hash');
  expect(hashed1 === hashed2).toBe(false);
});
