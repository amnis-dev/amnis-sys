import type {
  Data, DataRoot, DataMinimal,
} from '../../data.types.js';

/**
 * Record of locale translations.
 */
export type LocaleTranslation = Record<string, string>;

/**
 * A reference string to a locale.
 */
export type LocaleReference = `%${string}:${string}`;

/**
 * Locale entity
 */
export interface Locale extends Data {
  /**
   * Key for the locale.
   * code + ':' + set
   */
  key: string;

  /**
   * Two-character language code.
   * @minLength 2
   * @maxLength 2
   */
  code: string;

  /**
   * Name of the translation set for organization.
   * @minLength 1
   * @maxLength 32
   */
  set: string;

  /**
   * The language key value translations.
   */
  t: LocaleTranslation;
}

/**
 * Locale properties excluding the extended entity properties.
 */
export type LocaleRoot = DataRoot<Locale>;

/**
 * Root properties in order to create a log.
 */
export type LocaleMinimal = DataMinimal<Omit<Locale, 'key'>, 'code' | 'set'>;

export interface LocaleMeta {
  /**
   * The currently set language code.
   */
  code: string;
}
