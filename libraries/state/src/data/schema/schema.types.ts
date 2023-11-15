import type { SchemaObject as SchemaObjectFile } from '../../types.js';

/**
 * Schema types.
 */
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';

/**
 * Schema formats.
 */
export type SchemaFormat = 'date-time' | 'date' | 'time' | 'email' | 'password'
| 'hostname' | 'handle' | 'ipv4' | 'ipv6' | 'url' | 'file' | 'media'
| 'image' | 'video' | 'binary' | 'font';

/**
 * Base properties for a schema.
 */
export type SchemaBase = {
  /**
   * ID is the definition reference.
   *
   * `#/definitions/Example`
   */
  $id: string;

  /**
   * Data type.
   */
  type?: SchemaType;

  /**
   * Format of the data.
   */
  format?: string;

  /**
   * The data title.
   */
  title?: string;

  /**
   * The data desciption.
   */
  description?: string;

  /**
   * Default value.
   */
  default?: any;

  /**
   * References to another schema.
   */
  $ref?: string;
};

/**
 * Schema string.
 */
export interface SchemaTypeString extends SchemaBase {
  /**
   * String data type.
   */
  type: 'string';

  /**
   * The minimum length of the string.
   */
  minLength?: number;

  /**
   * The maximum length of the string.
   */
  maxLength?: number;

  /**
   * The pattern the string must match.
   */
  pattern?: string;

  /**
   * Default value.
   */
  default?: string;
}

/**
 * Schema number.
 */
export interface SchemaTypeNumber extends SchemaBase {
  /**
   * Number data type.
   */
  type: 'number';

  /**
   * The minimum value of the number.
   */
  minimum?: number;

  /**
   * The maximum value of the number.
   */
  maximum?: number;

  /**
   * The number must be a multiple of this value.
   */
  multipleOf?: number;

  /**
   * Default value.
   */
  default?: number;

}

/**
 * Schema boolean.
 */
export interface SchemaTypeBoolean extends SchemaBase {
  /**
   * Boolean data type.
   */
  type: 'boolean';

  /**
   * Default value.
   */
  default?: boolean;
}

/**
 * Schema object.
 */
export interface SchemaTypeObject<S extends SchemaBase = SchemaBase> extends SchemaBase {
  /**
   * Object data type.
   */
  type: 'object';

  /**
   * The minimum number of properties.
   */
  minProperties?: number;

  /**
   * The maximum number of properties.
   */
  maxProperties?: number;

  /**
   * The required properties.
   */
  required?: string[];

  /**
   * The properties.
   */
  properties?: Record<string, S>;

  /**
   * The pattern properties.
   */
  patternProperties?: Record<string, S>;

  /**
   * Additional properties.
   */
  additionalProperties?: boolean | S;

  /**
   * Default value.
   */
  default?: Record<string, any>;
}

/**
 * Schema array.
 */
export interface SchemaTypeArray<S extends SchemaBase = SchemaBase> extends SchemaBase {
  /**
   * Array data type.
   */
  type: 'array';

  /**
   * The minimum number of items.
   */
  minItems?: number;

  /**
   * The maximum number of items.
   */
  maxItems?: number;

  /**
   * The items.
   */
  items?: S;

  /**
   * The unique items.
   */
  uniqueItems?: boolean;

  /**
   * Default value.
   */
  default?: any[];
}

/**
 * Client application settings and data.
 */
export type Schema =
  SchemaTypeString |
  SchemaTypeNumber |
  SchemaTypeBoolean |
  SchemaTypeObject |
  SchemaTypeArray;

/**
 * Schema meta data.
 */
export type SchemaMeta = {
  /**
   * Currently active schema id string.
   */
  $active: string;
};

/**
 * Schema file
 */
export type SchemaFile = SchemaObjectFile;
