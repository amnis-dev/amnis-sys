import React from 'react';
import { pascalize, schemaSlice } from '@amnis/state';
import type {
  SchemaTypeObject, UID,
} from '@amnis/state';
import { apiSys } from '@amnis/api/react';
import { useTranslate, useWebSelector } from '@amnis/web/react/hooks';
import type { QueryResult } from '@amnis/web';

export function useEntitySchema(
  $id?: string | UID,
  translate = true,
): SchemaTypeObject | undefined {
  // if (!$id) return undefined;

  const sliceKey = React.useMemo(() => ($id ? $id.split(':')[0] : ''), [$id]);
  const definition = React.useMemo(() => pascalize(sliceKey), [sliceKey]);

  const schema = useWebSelector(
    (state) => schemaSlice.select.compiled(state, sliceKey),
  ) as SchemaTypeObject;

  apiSys.useSchemaQuery({
    type: `state/${definition}`,
  }) as QueryResult<SchemaTypeObject>;

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
        [key]: properties[key as keyof SchemaTypeObject],
      };
    }, {});

    return {
      ...schema,
      properties: propertiesNew,
    } as SchemaTypeObject;
  }, [schema]);

  const schemaTranslated = useTranslate(schemaReduced);

  return translate ? schemaTranslated : schemaReduced;
}

export default useEntitySchema;
