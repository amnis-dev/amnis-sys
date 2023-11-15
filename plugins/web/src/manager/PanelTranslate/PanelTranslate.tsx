import React from 'react';
import type { UID } from '@amnis/state';
import { EntityFormLocale } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

export const PanelTranslate: React.FC = () => {
  const { location: { hash: localeId } } = React.useContext(ManagerContext);

  const $id = React.useMemo<UID | undefined>(() => {
    if (!localeId) return undefined;
    return localeId as UID;
  }, [localeId]);

  return (
    <EntityFormLocale $id={$id} />
  );
};

export default PanelTranslate;
