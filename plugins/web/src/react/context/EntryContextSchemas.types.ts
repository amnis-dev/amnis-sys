export interface EntryContextSchema {
  description?: string;
}

export type EntryContextSchemaErrors =
  'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minimum'
  | 'maximum'
  | 'exclusiveMinimum'
  | 'exclusiveMaximum'
  | 'multipleOf'
  | 'type';

export interface EntryContextSchemaString {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: 'email' | 'search' | 'date-time' | 'date' | 'time' | 'uri' | 'hostname' | 'ipv4' | 'ipv6';
}

export interface EntryContextSchemaNumber {
  type: 'number' | 'integer';
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  format?: 'float' | 'double';
}

export interface EntryContextSchemaBoolean {
  type: 'boolean';
  format?: 'checkbox';
}
