import type { IoProcessDefinition } from '@amnis/state';
import type { Middleware, Reducer } from '@reduxjs/toolkit';

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

export enum AmnisSysModule {
  Set = 1 << 1,
  Schema = 1 << 2,
  Process = 1 << 3,
}

export type AmnisSet = { reducers: Record<string, Reducer>, middleware: Middleware[] }

export interface AmnisSys {
  sets: AmnisSet[];
  schemas: SchemaObject[];
  processes: Record<string, IoProcessDefinition>;
}
