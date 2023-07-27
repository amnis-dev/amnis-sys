import type { DateNumeric, UID } from '../../core/index.js';

/**
 * OTP send methods.
 */
// eslint-disable-next-line no-shadow
export enum OtpMethod {
  None,
  Email,
  Phone
}

/**
 * A short-lived object that contains a one-time password.
 */
export interface Otp {
  /**
   * OTP identifier
   */
  $id: UID;

  /**
   * Subject this OTP is intended for.
   */
  $sub: UID;

  /**
   * The string random value of the OTP.
   *
   * @minLength 4
   * @maxLength 24
   */
  val?: string;

  /**
   * The length the OTP expects.
   *
   * @min 4
   * @max 24
   */
  len: number;

  /**
   * Expiration date-time of the OTP.
   */
  exp: DateNumeric;

  /**
   * The method of sending the OTP value.
   */
  mth: OtpMethod;
}

/**
 * Otp collection meta.
 */
export interface OtpMeta {
  /**
   * Latest OTP object generated.
   */
  latest: UID | null;
}
