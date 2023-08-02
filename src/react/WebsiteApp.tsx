import React from 'react';
import { useWebSelector } from '@amnis/web/react';

export interface WebsiteAppProps {
  children?: React.ReactNode,
}

export const WebsiteApp: React.FC<WebsiteAppProps> = ({
  children,
}) => {
  const website = useWebSelector((state) => state.website);

  return (<>
    {children}
  </>);
};

export default WebsiteApp;
