import { createWebsite } from './createWebsite.js';

test('Should create a website with a store', () => {
  const website = createWebsite();

  expect(website).toHaveProperty('store');
});
