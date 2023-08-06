import React from 'react';
import { useWebDispatch, websiteSlice } from '@amnis/web/react';
import { apiCrud, apiSys } from '@amnis/api/react';
import { systemSlice } from '@amnis/state';
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
  // const website = useWebSelector((state) => websiteSlice.select.active(state));

  /**
   * API lazy queries
   */
  const [systemTrigger] = apiSys.useLazySystemQuery();
  const [readWebsiteTrigger, readWebsiteResult] = apiCrud.useLazyReadQuery();

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

    console.log('system', system);

    readWebsiteTrigger({
      [websiteSlice.key]: {
        $query: {
          hostname: {
            $eq: window.location.hostname,
          },
        },
      },
    });
  }, [system?.$id]);

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

  return (<>
    {children}
  </>);
};

export default WebsiteApp;
