import type { UID, DateNumeric } from '../../../core/core.types.js';
import type { Data, DataMeta } from '../../data.types.js';

/**
 * A session object.
 * Session data should be stored in *SECURE* HTTP cookies only.
 */
export interface Session extends Data {
  /**
   * Subject of the session.
   * Typically a user id.
   */
  $subject: UID;

  /**
   * The credential id in use.
   */
  $credential: UID;

  /**
   * Possible "Issued At" property when decoding.
   */
  iat?: DateNumeric;

  /**
   * Expiration date (numeric).
   */
  exp: DateNumeric;

  /**
   * If the session holder is an administrator.
   */
  adm: boolean;

  /**
   * If the session holder is an executive.
   */
  exc: boolean;

  /**
   * If the session holder has one of the privileged roles.
   * (Administrator or Executive)
   */
  prv: boolean;
}

/**
 * Session collection meta data.
 */
export type SessionMeta = DataMeta<Session>;
