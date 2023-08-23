import React from 'react';
import type {
  Website,
} from '@amnis/web';
import {
  Web,
  useWebDispatch,
  websiteSlice,
  useWebSelector,
} from '@amnis/web';
import { apiCrud, apiSys, apiAuth } from '@amnis/api/react';
import {
  systemSlice,
} from '@amnis/state';

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

  /**
   * API lazy queries
   */
  const [systemTrigger] = apiSys.useLazySystemQuery();
  const [readWebsiteTrigger, readWebsiteResult] = apiCrud.useLazyReadQuery();

  /**
   * Callback that triggers a website query.
   */
  const readWebsiteQuery = React.useCallback(() => {
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
  }, [hostname, window?.location?.hostname]);

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

    readWebsiteQuery();
  }, [system?.$id]);

  /**
   * Whenever the website query result changes, then set the active website.
   */
  React.useEffect(() => {
    const { result } = readWebsiteResult?.data || {};

    if (!result || !result[websiteSlice.key]?.[0]) {
      return;
    }

    const websiteEntity = result[websiteSlice.key][0] as Website;
    dispatch(websiteSlice.action.activeSet(websiteEntity.$id));
  }, [readWebsiteResult?.data?.result]);

  return system?.$id ? (
    <div>
      <Web onRemount={readWebsiteQuery}>
        {children}
      </Web>
    </div>
  ) : null;
};

export default WebsiteApp;
