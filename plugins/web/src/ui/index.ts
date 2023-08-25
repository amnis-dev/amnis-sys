import React from 'react';
import type { UserInterface } from '@amnis/state';

export * from './ui.types.js';

type UiModules = typeof import('@amnis/web/react/material');
type UiModulesKey = keyof UiModules;

const importer = (module: UiModulesKey) => React.lazy(
  () => import('@amnis/web/react/material').then(
    (m): { default: React.FC<any> } => ({
      default: m[module] as React.FC<any>,
    }),
  ),
);

export const ui: UserInterface = {
  Navbar: importer('Navbar'),
};
