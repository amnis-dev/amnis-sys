import type { SchemaObject } from '@amnis/state';
import schemaSys from './sys.schema.json';
import schemaAuth from './auth.schema.json';

export { default as schemaSys } from './sys.schema.json';
export { default as schemaAuth } from './auth.schema.json';

export const schema: SchemaObject[] = [schemaSys, schemaAuth];

export default schema;
