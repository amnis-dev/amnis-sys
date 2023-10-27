export interface ApiSysSchema {
  /**
   * Type of schema to request.
   * Typically something like 'state/User' or 'auth/ApiAuthOtp'.
   *
   * @pattern ^.+\/.+$
   * @minLength 1
   * @maxLength 64
   */
  type: string;
}

/**
 * Locale keys that can be requested must start with a '!', which
 * indicates that no authorization associated data is required
 * for the locale strings.
 *
 * @pattern ^!.*$
 */
export type ApiSysLocaleGlobalKey = string;

export interface ApiSysLocale {
  /**
   * Language to request.
   * Typically something like 'en' or 'de'.
   *
   * @pattern ^[a-z]{2}$
   * @minLength 2
   * @maxLength 2
   */
  language?: string;

  /**
   * The locale keys to request.
   *
   * @minItems 1
   * @maxItems 256
   */
  keys: ApiSysLocaleGlobalKey[];
}
