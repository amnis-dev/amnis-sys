import React from 'react';
import { pascalize } from '@amnis/state';
import type { SchemaObject, Entity } from '@amnis/state';
import { apiSys } from '@amnis/api/react';
import { Entry } from './material/entry/index.js';
import type { QueryResult } from './types.js';

export interface IderInputProps<E extends Entity> {
  entity?: E;
  prop?: keyof E;
}

export const IderInput = <E extends Entity>({ entity, prop }: IderInputProps<E>) => {
  if (!entity || !prop) return null;

  const slice = React.useMemo(() => entity.$id.split(':')[0], [entity.$id]);

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

  return (
    <Entry
      label={pascalize(prop as string)}
      required={required}
      schema={schema}
      value={entity[prop]}
    />
  );
};

export default IderInput;
