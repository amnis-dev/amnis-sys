import React from 'react';
import {
  useWebDispatch,
  websiteSlice,
  WebProvider,
  useWebSelector,
} from '@amnis/web';
import { apiCrud, apiSys, apiAuth } from '@amnis/api/react';
import {
  systemSlice, localeSlice, userSlice, dataActions,
} from '@amnis/state';
import { useUpdateEffect } from './hooks/useUpdateEffect.js';

export const isDev = process.env.NODE_ENV === 'development';

export interface WebsiteAppProps {
  hostname?: string,
  system?: string | string[],
  children?: React.ReactNode,
}

export const WebsiteApp: React.FC<WebsiteAppProps> = ({
  hostname,
  system: systemUrl,
  children,
}) => {
  const dispatch = useWebDispatch();

  /**
   * State data
   */
  const system = useWebSelector(systemSlice.select.active);
  const language = useWebSelector(localeSlice.select.activeCode);
  const user = useWebSelector(userSlice.select.active);

  /**
   * API lazy queries
   */
  const [systemTrigger] = apiSys.useLazySystemQuery();
  const [readWebsiteTrigger, readWebsiteResult] = apiCrud.useLazyReadQuery();

  /**
   * Remounts the website when this value toggles.
   */
  const [remount, remountSet] = React.useState(false);

  /**
   * Whenever the active system changes, then trigger a system query.
   */
  React.useEffect(() => {
    const systemUrlDefault = Array.isArray(systemUrl) ? systemUrl[0] : systemUrl;

    systemTrigger({
      url: systemUrlDefault || `${window.location.origin}/api/sys/system`,
      set: true,
    });
  }, [systemUrl]);

  /**
   * Check the authentication status.
   */
  React.useEffect(() => {
    if (!system?.$id) {
      return;
    }

    (async () => {
      await dispatch(apiAuth.endpoints.authenticate.initiate({ silent: true }));
    })();
  }, [system?.$id]);

  /**
   * Whenever the active system changes, then trigger a website query.
   */
  React.useEffect(() => {
    if (!system) {
      return;
    }

    /**
     * Check for user authentication.
     */
    // authnTrigger({});

    /**
     * Get the website data.
     */
    readWebsiteTrigger({
      [websiteSlice.key]: {
        $query: {
          hostname: {
            $eq: isDev ? 'localhost' : (hostname ?? window.location.hostname),
          },
        },
        $depth: 1,
      },
    });
  }, [system?.$id, remount]);

  /**
   * Whenever the website query result changes, then set the active website.
   */
  React.useEffect(() => {
    const { result } = readWebsiteResult?.data || {};

    if (!result || !result[websiteSlice.key]?.[0]) {
      return;
    }

    dispatch(websiteSlice.action.activeSet(result[websiteSlice.key][0].$id));
  }, [readWebsiteResult?.data?.result]);

  /**
   * Reset effect.
   */
  useUpdateEffect(() => {
    /**
     * Clear all but essential data.
     */
    dispatch(dataActions.wipe({
      spare: [
        'agent', 'system', 'api', 'bearer', 'session',
        'website', 'user', 'profile', 'contact', 'language',
      ],
    }));

    dispatch(apiCrud.util.resetApiState());

    /**
     * Trigger all child components to remount.
     */
    remountSet(!remount);
  }, [language, user?.$id]);

  return system?.$id ? (
    <div key={remount ? 0 : 1}>
      <WebProvider>
        {children}
      </WebProvider>
    </div>
  ) : null;
};

export default WebsiteApp;
