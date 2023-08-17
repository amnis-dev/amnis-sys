import type { Loader } from '@storybook/react';

export const loaderDefer: Loader = async (): Promise<any> => {
  return new Promise((resolve) => {
    window.onload = () => {
      return resolve({});
    };
  });
}

export default loaderDefer;