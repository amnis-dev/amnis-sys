import React from 'react';
import type { EntitySearchLocaleProps } from '@amnis/web';
import { EntitySearchLocale } from '@amnis/web';
import { ManagerContext } from '../ManagerContext.js';

export const PanelLocalization: React.FC = () => {
  const { locationPush } = React.useContext(ManagerContext);

  const handleLocaleSelect = React.useCallback<Required<EntitySearchLocaleProps>['onSelect']>((locale) => {
    locationPush(`Translate#${locale.$id}`);
  }, [locationPush]);

  return (
    <EntitySearchLocale onSelect={handleLocaleSelect} />
  );
};

export default PanelLocalization;
