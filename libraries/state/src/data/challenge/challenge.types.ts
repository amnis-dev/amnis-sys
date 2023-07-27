import type { DateNumeric, UID } from '../../core/index.js';

/**
 * An object containing one-time data to prevent replay attacks.
 */
export interface Challenge {
  /**
   * Challenge identifier
   */
  $id: UID;

  /**
   * The string random value of the challenge.
   *
   * @minLength 16
   * @maxLength 256
   */
  val: string;

  /**
   * Expiration date-time of the challenge.
   *
   * @min 0
   */
  exp: DateNumeric;
}

/**
 * Challenge collection meta.
 */
export interface ChallengeMeta {
  /**
   * Challenges that require OTP values.
   */
  otps: UID[];
}
