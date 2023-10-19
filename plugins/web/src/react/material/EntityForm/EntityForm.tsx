import React from 'react';
import { apiSys } from '@amnis/api/react';
import type { Entity, Schema } from '@amnis/state';
import { dataActions, pascalize, schemaSlice } from '@amnis/state';
import type { EntityState } from '@amnis/state/rtk';
import { useDispatch } from 'react-redux';
import type { QueryResult } from '@amnis/web';
import {
  useTranslate, useWebSelector, useDebounce, useUpdateEffect,
} from '@amnis/web/react/hooks';
import { Entry } from '@amnis/web/react/material';

export interface EntityFormProps {
  /**
   * Entity ID
   */
  $id?: string;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  $id,
}) => {
  const sliceKey = React.useMemo(() => $id?.split(':')[0] ?? '', [$id]);
  if (sliceKey.length === 0) return null;

  const definition = React.useMemo(() => pascalize(sliceKey), [sliceKey]);

  apiSys.useSchemaQuery({
    type: `state/${definition}`,
  }) as QueryResult<Schema>;

  const dispatch = useDispatch();

  const entity = useWebSelector((state) => {
    const entities = (
      state[sliceKey as keyof typeof state] as EntityState<Entity, string>
    )?.entities;

    if (!entities) return undefined;
    return entities[$id as string];
  });

  if (!entity) return null;

  const entityUpdatedInternally = React.useRef(false);
  const [entityCopy, entityCopySet] = React.useState({ ...entity });
  const entityDebounced = useDebounce(entityCopy, 120);

  React.useEffect(() => {
    if (!entityUpdatedInternally.current) {
      entityCopySet({ ...entity });
    }
    entityUpdatedInternally.current = false;
  }, [entity]);

  useUpdateEffect(() => {
    entityUpdatedInternally.current = true;
    dispatch(dataActions.update({
      [sliceKey]: [{
        ...entityDebounced,
      }],
    }));
  }, [entityDebounced]);

  const handleEntityUpdate = React.useCallback((entityNext: any) => {
    entityCopySet(entityNext);
  }, [sliceKey, dispatch]);

  const schema = useTranslate(useWebSelector(
    (state) => schemaSlice.select.compiled(state, sliceKey),
  ));

  const schemaReduced = React.useMemo(() => {
    if (!schema) return undefined;

    if (schema.type !== 'object') return schema;
    const { properties } = schema;
    if (!properties) return schema;

    /**
     * Reduce the schema object to remove the $id property.
     */
    const propertiesNew = Object.keys(properties).reduce((acc, key) => {
      if (key === '$id') return acc;

      return {
        ...acc,
        [key]: properties[key as keyof Schema],
      };
    }, {});

    return {
      ...schema,
      properties: propertiesNew,
    } as Schema;
  }, [schema]);

  return (
    <div>
      <Entry
        schema={schemaReduced}
        value={entityCopy}
        onChange={handleEntityUpdate}
      />
    </div>
  );
};

export default EntityForm;
