import React from 'react';
import {
  noop,
} from '@amnis/state';
import { RouterProvider, createBrowserRouter } from '@amnis/web/lib/react-router-dom';
import { useTranslate, useWebSelector } from '@amnis/web/react/hooks';
import { websiteSlice } from '@amnis/web/set';
import { WebProvider } from './WebProvider.js';

export interface WebProps {
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
        <WebProvider onRemount={onRemount} />
      ),
      children: [
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
  }), [children, onRemount]);

  return (
    <RouterProvider router={router} />
  );
};
