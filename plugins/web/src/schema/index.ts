import type { SchemaObject } from '@amnis/state';
import schemaWebState from './state.schema.json';
import schemaWebUi from './ui.schema.json';

export const schema: SchemaObject[] = [schemaWebState, schemaWebUi];

export default schema;
