// @vitest-environment jsdom
import React from 'react';
import { render } from '@testing-library/react';
import { createWebsite } from './createWebsite.js';

function sleep(ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

test('Should create a website with a store', async () => {
  const website = createWebsite();

  expect(website).toHaveProperty('store');

  const app = React.createElement(website.Provider, { children: null });
  render(app);

  await sleep(5000);

  console.log(JSON.stringify(website.store.getState(), null, 2));
});
