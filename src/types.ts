import type { IoProcessDefinition } from '@amnis/state';

interface _SchemaObject {
  id?: string;
  $id?: string;
  $schema?: string;
  [x: string]: any;
}

export interface SchemaObject extends _SchemaObject {
  id?: string;
  $id?: string;
  $schema?: string;
  $async?: false;
  [x: string]: any;
}

export interface AmnisSys {
  schemas: SchemaObject[];
  processes: Record<string, IoProcessDefinition>;
}
