export interface EntrySchema {
  description?: string;
}

export type EntrySchemaErrors =
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

export interface EntrySchemaString {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: 'email' | 'search' | 'date-time' | 'date' | 'time' | 'uri' | 'hostname' | 'ipv4' | 'ipv6';
}

export interface EntrySchemaNumber {
  type: 'number' | 'integer';
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  format?: 'float' | 'double';
}

export interface EntrySchemaBoolean {
  type: 'boolean';
  format?: 'checkbox';
}
