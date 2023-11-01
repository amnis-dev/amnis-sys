import React from 'react';
import { Breadcrumbs, Chip } from '@mui/material';
import { noop } from '@amnis/state';
import { WebContext, type WebContextIderEntities } from '@amnis/web/react/context';

export interface IderEntityChipsProps {
  onClick?: (entityId: string) => void;
  entities: WebContextIderEntities;
}

export const IderEntityChips: React.FC<IderEntityChipsProps> = ({
  onClick = noop,
  entities,
}) => {
  const { managerLocationPush } = React.useContext(WebContext);

  const handleChipClick = React.useCallback((entityId: string) => {
    managerLocationPush(`/Edit#${entityId}`);
    onClick(entityId);
  }, [managerLocationPush, onClick]);

  return (
    <Breadcrumbs>
      {entities.map(([entity], index) => {
        if (!entity) {
          return <Chip />;
        }
        const name = entity.$id.split(':')[0];
        return <Chip
          key={entity.$id}
          label={name}
          variant={entities.length - 1 !== index ? 'outlined' : undefined}
          onClick={() => handleChipClick(entity.$id)}
        />;
      })}
    </Breadcrumbs>
  );
};

export default IderEntityChips;
