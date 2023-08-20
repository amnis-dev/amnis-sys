import React from 'react';
import { Breadcrumbs, Chip } from '@mui/material';
import type { WebContextIderEntities } from '@amnis/web/react/context';

export interface IderEntityChipsProps {
  entities: WebContextIderEntities;
}

export const IderEntityChips: React.FC<IderEntityChipsProps> = ({ entities }) => (
  <Breadcrumbs>
    {entities.map(([entity], index) => {
      if (!entity) {
        return <Chip />;
      }
      const name = entity.$id.split(':')[0];
      return <Chip key={entity.$id} label={name} variant={entities.length - 1 !== index ? 'outlined' : undefined} />;
    })}
  </Breadcrumbs>
);

export default IderEntityChips;
