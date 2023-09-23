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

  /**
   * Locale language code.
   *
   * @pattern ^[a-z]{2}(-[A-Z]{2})?$
   * @minLength 2
   * @maxLength 5
   */
  ln?: string;
}
