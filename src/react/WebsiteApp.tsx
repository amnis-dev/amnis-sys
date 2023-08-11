import React from 'react';
import {
  useWebDispatch,
  websiteSlice,
  WebProvider,
} from '@amnis/web/react';
import { apiCrud, apiSys } from '@amnis/api/react';
import { systemSlice, localeSlice } from '@amnis/state';
import { useSysSelector } from './hooks/index.js';

export interface WebsiteAppProps {
  system?: string | string[],
  children?: React.ReactNode,
}

export const WebsiteApp: React.FC<WebsiteAppProps> = ({
  system: systemUrl,
  children,
}) => {
  const webDispatch = useWebDispatch();

  /**
   * State data
   */
  const system = useSysSelector((state) => systemSlice.select.active(state));
  const language = useSysSelector(localeSlice.select.activeCode);

  /**
   * API lazy queries
   */
  const [systemTrigger] = apiSys.useLazySystemQuery();
  // const [authnTrigger, authnResult] = apiAuth.useAuthenticateMutation();
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
            $eq: window.location.hostname,
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

    webDispatch(websiteSlice.action.activeSet(result[websiteSlice.key][0].$id));
  }, [readWebsiteResult?.data?.result]);

  /**
   * Remount effect.
   */
  React.useEffect(() => remountSet(!remount), [language]);

  return (
    <div key={remount ? 0 : 1}>
      <WebProvider>
        {children}
      </WebProvider>
    </div>
  );
};

export default WebsiteApp;
