import type { SchemaObject } from '../types.js';
/* eslint-disable import/prefer-default-export */
import schemaState from './state.schema.json';

export { default as schemaState } from './state.schema.json';

export const schema: SchemaObject[] = [schemaState];

export default schema;
