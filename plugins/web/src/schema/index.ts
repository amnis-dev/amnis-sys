import type { SchemaObject } from '@amnis/state';
import schemaWebState from './state.schema.json';
import schemaWebInterface from './webInterface.schema.json';

export const schema: SchemaObject[] = [schemaWebState, schemaWebInterface];

export default schema;
