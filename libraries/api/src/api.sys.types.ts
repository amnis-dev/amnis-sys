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
