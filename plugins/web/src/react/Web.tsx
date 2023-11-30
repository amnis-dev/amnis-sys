import React from 'react';
import type { DataSliceGeneric } from '@amnis/state';
import {
  noop,
} from '@amnis/state';
import type { RouteObject } from '@amnis/web/lib/react-router-dom';
import { RouterProvider, createBrowserRouter } from '@amnis/web/lib/react-router-dom';
import { useTranslate, useWebSelector } from '@amnis/web/react/hooks';
import { websiteSlice } from '@amnis/web/set';
import { WebProvider } from './WebProvider.js';

export interface WebProps {
  /**
   * Slices to load into the web application.
   */
  slices?: Record<string, DataSliceGeneric>;

  /**
   * Custom routes object.
   */
  routes?: RouteObject[];

  /**
   * Callback when the website is remounted.
   */
  onRemount?: () => void;

  /**
   * Children
   */
  children?: React.ReactNode;
}

export const Web: React.FC<WebProps> = ({
  slices,
  routes,
  onRemount = noop,
  children,
}) => {
  /**
   * Get the active website.
   */
  const website = useTranslate(useWebSelector(websiteSlice.select.active));

  /**
   * Memorize a meta description element.
   */
  const metaDescription = React.useMemo(() => {
    const meta = document.createElement('meta');
    meta.name = 'description';
    return meta;
  }, []);

  /**
   * Apply document meta information.
   */
  React.useEffect(() => {
    if (!website) return;

    document.title = website.title;

    metaDescription.content = website.description;
  }, [website]);

  /**
   * On iniital mount, append meta elements.
   */
  React.useEffect(() => {
    document.head.appendChild(metaDescription);
  }, []);

  /**
   * Instantiate the router.
   */
  const router = React.useMemo(() => createBrowserRouter([
    {
      path: '/',
      element: (
        <WebProvider onRemount={onRemount} slices={slices} />
      ),
      children: routes ?? [
        {
          path: '/',
          element: children,
        },
        {
          path: '/*',
          element: children,
        },
      ],
    },
  ], {
    future: {
      v7_normalizeFormMethod: true,
    },
  }), [routes, slices, children, onRemount]);

  return (
    <RouterProvider router={router} />
  );
};
