import type {
  Credential,
  Challenge,
  Otp,
} from '@amnis/state';
import type {
  ApiAuthRegister,
  ApiAuthLogin,
  ApiAuthLogout,
  // ApiAuthPkce,
  ApiAuthCreate,
  ApiAuthOtp,
  ApiAuthVerify,
  ApiAuthChallenge,
  ApiAuthAuthenticate,
  ApiAuthCredential,
} from '../api.auth.types.js';

export interface AuthSchema {
  authenticate?: ApiAuthAuthenticate;
  challenge?: ApiAuthChallenge;
  credential?: ApiAuthCredential;
  otp?: ApiAuthOtp;
  register?: ApiAuthRegister;
  login?: ApiAuthLogin;
  logout?: ApiAuthLogout;
  verify?: ApiAuthVerify;
  create?: ApiAuthCreate;
  /**
   * Encoded types.
   */
  typeChallenge?: Challenge;
  typeCrendential?: Credential;
  typeOtp?: Otp;
}
