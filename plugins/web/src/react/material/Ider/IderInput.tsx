import React from 'react';
import {
  dataActions, pascalize, schemaSlice, stateSelect,
} from '@amnis/state';
import type { Entity } from '@amnis/state';
import { apiSys } from '@amnis/api/react';
import type { Schema } from 'ajv';
import { Entry } from '@amnis/web/react/material';
import { useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
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

  const entity = useWebSelector(stateSelect.dataById(slice, $id)) as E;

  apiSys.useSchemaQuery({
    type: `state/${schemaName}`,
  }) as QueryResult<Schema[]>;

  const schema = useWebSelector((state) => schemaSlice.select.compiled(state, schemaName));

  const { schemaProperty, required } = React.useMemo(() => {
    if (!schema || schema.type !== 'object') return {};

    const required = schema.required?.includes(prop);
    const schemaProperty = schema.properties?.[prop];
    return { schemaProperty, required };
  }, [schema, prop]);

  const handleChange = React.useCallback((value: any) => {
    dispatch(dataActions.update({
      [slice]: [{
        $id,
        [prop]: value,
      }],
    }));
  }, []);

  console.log('IderInput', {
    entity, prop, schemaProperty, required,
  });

  return schemaProperty ? (
    <Entry
      label={pascalize(prop)}
      required={required}
      schema={schemaProperty}
      value={entity[prop]}
      onChange={handleChange}
    />
  ) : null;
};

export default IderInput;
