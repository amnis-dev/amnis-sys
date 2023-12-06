import React from 'react';
import {
  dataActions, dateJSON, pascalize, schemaSlice, stateSelect,
} from '@amnis/state';
import type { Entity, Schema } from '@amnis/state';
import { apiSys } from '@amnis/api/react';
import { Skeleton } from '@mui/material';
import { Entry } from '@amnis/web/react/material';
import {
  useCrudRead, useTranslate, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';
import type { QueryResult } from '@amnis/web';

export interface IderInputProps<E extends Entity> {
  entity?: E;
  prop?: Extract<keyof E, string>;
}

export const IderInput = <E extends Entity>({
  entity: entityProp,
  prop,
}: IderInputProps<E>) => {
  if (!entityProp || !prop) return null;

  const dispatch = useWebDispatch();

  const { $id } = entityProp;
  const slice = React.useMemo(() => $id.split(':')[0], [$id]);
  const schemaName = React.useMemo(() => pascalize(slice), [slice]);

  const { crudRead } = useCrudRead();

  const entity = useWebSelector(stateSelect.dataById(slice, $id)) as E | undefined;

  React.useEffect(() => {
    if (!entity) {
      crudRead({
        [slice]: {
          $query: {
            $id: {
              $eq: $id,
            },
          },
        },
      });
    }
  }, [entity]);

  apiSys.useSchemaQuery({
    type: `state/${schemaName}`,
  }) as QueryResult<Schema[]>;

  const schema = useWebSelector((state) => schemaSlice.select.compiled(state, schemaName));

  const { schemaProperty, required } = React.useMemo(() => {
    if (!schema || schema.type !== 'object') return {};

    const required = schema.required?.includes(prop);
    const schemaProperty = schema.properties?.[prop] as Schema;
    return { schemaProperty, required };
  }, [schema, prop]);

  const schemaPropertyTranslated = useTranslate(schemaProperty);

  const handleChange = React.useCallback((value: any) => {
    dispatch(dataActions.update({
      [slice]: [{
        $id,
        [prop]: value,
        updated: dateJSON(),
      }],
    }));
  }, []);

  return schemaPropertyTranslated && entity ? (
    <Entry
      required={required}
      schema={schemaPropertyTranslated}
      value={entity[prop] as any}
      onChange={handleChange}
    />
  ) : <Skeleton height={32} />;
};

export default IderInput;
