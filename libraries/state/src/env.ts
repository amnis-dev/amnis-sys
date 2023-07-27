/* eslint-disable @typescript-eslint/ban-ts-comment */
export type EnvRuntime = 'browser' | 'node' | 'react-native';

/**
 * Determine if the environment is running in a browser, node, or react-native.
 */
export const envRuntime = (): EnvRuntime => {
  if (typeof window !== 'undefined') {
    return 'browser';
  }

  if (typeof process !== 'undefined') {
    return 'node';
  }

  return 'react-native';
};

/** @ts-ignore */
// eslint-disable-next-line no-restricted-globals
export const envWorker = (): boolean => typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
