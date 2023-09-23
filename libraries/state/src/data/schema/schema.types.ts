import type { SchemaObject } from '../../types.js';

/**
 * Schema types.
 */
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';

/**
 * Schema formats.
 */
export type SchemaFormat = 'date-time' | 'date' | 'time' | 'email' | 'password'
| 'hostname' | 'handle' | 'ipv4' | 'ipv6' | 'url' | 'url-file' | 'url-media'
| 'url-image' | 'url-video' | 'binary' | 'font';

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
 * Client application settings and data.
 */
export type Schema = SchemaBase & {
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

} | SchemaBase & {
  /**
   * Number/Integer data type.
   */
  type: 'number' | 'integer';

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

} | SchemaBase & {
  /**
   * Boolean data type.
   */
  type: 'boolean';
} | SchemaBase & {
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
  properties?: Record<string, Schema>;

  /**
   * The pattern properties.
   */
  patternProperties?: Record<string, Schema>;

  /**
   * Additional properties.
   */
  additionalProperties?: boolean | Schema;

  /**
   * Default value.
   */
  default?: Record<string, any>;
} | SchemaBase & {
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
  items?: Schema;

  /**
   * The unique items.
   */
  uniqueItems?: boolean;

  /**
   * Default value.
   */
  default?: any[];
};

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
export type SchemaFile = SchemaObject;
