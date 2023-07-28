import type {
  HandleName,
  Credential,
  HandleNameId,
  Bearer,
  UID,
  Email,
  Password,
  Name,
} from '@amnis/state';

/**
 * OTP purposes
 */
export type ApiAuthOtpPurpose = 'credential';

/**
 * Challenge Generation Request.
 */
export type ApiAuthChallenge = Record<string, never>;

/**
 * One-time password request.
 */
export interface ApiAuthOtp {
  /**
   * OTP Subject.
   */
  $subject: UID | HandleNameId;

  /**
   * Purpose of the OTP.
   */
  purpose?: ApiAuthOtpPurpose;
}

/**
 * Adds a credential to an account.
 */
export interface ApiAuthCredential {
  /**
   * Credential entity to assign.
   */
  credential: Credential;

  /**
   * Password of the user account.
   */
  password?: Password;
}

/**
 * A request to authenticate with a session.
 * User must log in if authentication fails.
 */
export type ApiAuthAuthenticate = Record<string, never>;

/**
 * Payload for an registration request.
 * A value of undefined starts a registration event.
 */
export interface ApiAuthRegister {
  /**
   * The handle name to register under.
   */
  handle: HandleName;

  /**
   * The password for the registration.
   */
  password: Password;

  /**
   * Email address to add to the account to receive one-time-passcodes.
   */
  email?: Email;

  /**
   * The display name to register under.
   */
  nameDisplay?: Name;

  /**
   * Credential to add during the registration.
   */
  credential: Credential;
}

/**
 * Payload for a login request.
 */
export interface ApiAuthLogin {
  /**
   * Unique name for login credentials
   */
  handle: HandleName;

  /**
   * The login password
   */
  password?: Password;

  /**
   * Credential value that should match the credential on the user account.
   */
  credential: Credential;
}

/**
 * Payload that destroys the user session and connection.
 */
export interface ApiAuthLogout {
  [key: string]: never;
}

/**
 * Logs in from a third-party using the data from OpenID PKCE Authorization.
 */
export interface ApiAuthPkce {
  /**
   * Supported PKCE login methods.
   */
  platform: 'microsoft' | 'twitter',

  /**
   * @minLength 16
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  clientId: string;

  /**
   * @minLength 32
   * @maxLength 1024
   * @pattern ^[a-zA-Z0-9-_.]+$
   */
  code: string;

  /**
   * @minLength 32
   * @maxLength 256
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  codeVerifier: string;

  /**
   * @minLength 8
   * @maxLength 512
   * @pattern https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?
   */
  redirectUri: string;

  /**
   * @minLength 16
   * @maxLength 64
   * @pattern ^[a-zA-Z0-9-_]+$
   */
  tenantId?: string;

  /**
   * True or false value.
   */
  gov?: boolean;
}

/**
 * Creates an account for authentication.
 */
export interface ApiAuthCreate {
  /**
   * The user handle.
   */
  handle: HandleName;

  /**
   * The account password to apply.
   */
  password: Password;

  /**
   * Account email address for important account related information
   */
  email?: Email;

  /**
   * Display name for the account profile.
   */
  nameDisplay?: string;
}

/**
 * Verifies the validity of a stringified bearer.
 */
export type ApiAuthVerify = Bearer;
