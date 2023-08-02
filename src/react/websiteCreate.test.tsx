// @vitest-environment jsdom
import React from 'react';
import { render } from '@testing-library/react';
import { websiteCreate } from './websiteCreate.js';

function sleep(ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

test('Should create a website with a store', async () => {
  const website = websiteCreate();

  expect(website).toHaveProperty('store');

  const app = React.createElement(website.Provider, { children: null });
  render(app);

  await sleep(5000);

  console.log(JSON.stringify(website.store.getState(), null, 2));
});
