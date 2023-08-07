import type {
  Data, DataRoot, DataMinimal,
} from '../../data.types.js';

/**
 * Locale entity
 */
export interface Locale extends Data {
  /**
   * Two-character or five-character language code.
   * @minLength 2
   * @maxLength 5
   */
  code: string;

  /**
   * The variable name of the translation in the set.
   * @minLength 1
   * @maxLength 32
   */
  name: string;

  /**
   * The translation value.
   * @minLength 0
   * @maxLength 8192
   */
  value: string;
}

/**
 * Locale properties excluding the extended entity properties.
 */
export type LocaleRoot = DataRoot<Locale>;

/**
 * Root properties in order to create a log.
 */
export type LocaleMinimal = DataMinimal<Locale, 'code' | 'name' | 'value'>;

export interface LocaleMeta {
  /**
   * The currently set language code.
   */
  code: string;

  /**
   * Cached translation names for quick access.
   */
  names: Record<string, Locale>;
}
