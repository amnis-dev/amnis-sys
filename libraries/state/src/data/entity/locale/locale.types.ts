/* eslint-disable max-len */
import type {
  Data, DataRoot, DataMinimal,
} from '../../data.types.js';

/**
 * Locale entity
 *
 * @title {
 *  en: "Locale",
 *  de: "Sprache",
 *  es: "Idioma",
 * }
 * @description {
 *  en: "Translation information for a group of text.",
 *  de: "Übersetzungsinformationen für eine Gruppe von Text.",
 *  es: "Información de traducción para un grupo de texto.",
 * }
 */
export interface Locale extends Data {
  /**
   * Two-character or five-character language code.
   *
   * @title {
   *  en: "Language Code",
   *  de: "Sprachcode",
   *  es: "Código de idioma",
   * }
   * @description {
   *  en: "Two-character or five-character language code.",
   *  de: "Zwei- oder fünfstelliger Sprachcode.",
   *  es: "Código de idioma de dos o cinco caracteres.",
   * }
   * @minLength 2
   * @maxLength 5
   */
  code: string;

  /**
   * The variable name of the translation in the set.
   *
   * @title {
   *  en: "Set Name",
   *  de: "Satzname",
   *  es: "Nombre del conjunto",
   * }
   * @description {
   *  en: "The variable name of the translation in the set. Names beginning with an exclamation mark can be fetched without associative data or authorization.",
   *  de: "Der Variablenname der Übersetzung im Satz. Namen, die mit einem Ausrufezeichen beginnen, können ohne assoziative Daten oder Autorisierung abgerufen werden.",
   *  es: "El nombre de variable de la traducción en el conjunto. Los nombres que comienzan con un signo de exclamación se pueden obtener sin datos asociativos o autorización.",
   * }
   * @minLength 1
   * @maxLength 128
   */
  name: string;

  /**
   * The translation value.
   *
   * @title {
   *  en: "Text Value",
   *  de: "Textwert",
   *  es: "Valor de texto",
   * }
   * @description {
   *  en: "The translation value.",
   *  de: "Der Übersetzungswert.",
   *  es: "El valor de traducción.",
   * }
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
