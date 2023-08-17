import React from 'react';
import { dataActions, pascalize, stateSelect } from '@amnis/state';
import type { SchemaObject, Entity } from '@amnis/state';
import { apiSys } from '@amnis/api/react';
import { Entry } from './material/entry/index.js';
import type { QueryResult } from './types.js';
import { useWebDispatch, useWebSelector } from './hooks/index.js';

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

  const entity = useWebSelector(stateSelect.dataById(slice, $id)) as E;

  const { data } = apiSys.useSchemaQuery({
    type: `state/${pascalize(slice)}`,
  }) as QueryResult<SchemaObject>;

  const { schema, required } = React.useMemo(() => {
    if (!data) return {};

    const { result } = data;
    if (!result) return {};

    const required = result.required?.includes(prop);
    const schema = result.properties[prop];
    return { schema, required };
  }, [data, prop]);

  const handleChange = React.useCallback((value: any) => {
    dispatch(dataActions.update({
      [slice]: [{
        $id,
        [prop]: value,
      }],
    }));
  }, []);

  return (
    <Entry
      label={pascalize(prop)}
      required={required}
      schema={schema}
      value={entity[prop]}
      onChange={handleChange}
    />
  );
};

export default IderInput;
