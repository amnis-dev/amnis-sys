import type { Role } from '../role/role.types.js';
import type {
  Email, SURL, UID, UIDList,
} from '../../../core/core.types.js';
import type { HandleName } from '../handle/handle.types.js';
import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
} from '../../data.types.js';

export interface System extends Data {
  /**
   * Name of the system.
   *
   * @title core:state:system:name
   * @description core:state:system:name_desc
   * @minLength 1
   * @maxLength 32
   */
  name: string;

  /**
   * System handle for identifying system created resources.
   *
   * @title core:state:system:handle
   * @description core:state:system:handle_desc
   */
  handle: HandleName;

  /**
   * Domain name of the system.
   *
   * @format hostname
   * @title core:state:system:domain
   * @description core:state:system:domain_desc
   */
  domain: string;

  /**
   * Allowed CORS origins.
   *
   * @title core:state:system:cors
   * @description core:state:system:cors_desc
   */
  cors: SURL[];

  /**
   * Name of the session key.
   *
   * @title core:state:system:sessionKey
   * @description core:state:system:sessionKey_desc
   * @format variable
   * @minLength 1
   * @maxLength 32
   */
  sessionKey: string;

  /**
   * Number in minutes that an authentication session should live.
   *
   * @title core:state:system:sessionExpires
   * @description core:state:system:sessionExpires_desc
   * @minimum 1
   * @maximum 20160
   */
  sessionExpires: number;

  /**
   * Number in minutes that a bearer token should live.
   *
   * @title core:state:system:bearerExpires
   * @description core:state:system:bearerExpires_desc
   * @minimum 1
   * @maximum 20160
   */
  bearerExpires: number;

  /**
   * Expiration of a challenge code in minutes.
   *
   * @title core:state:system:challengeExpiration
   * @description core:state:system:challengeExpiration_desc
   * @minimum 1
   * @maximum 60
   */
  challengeExpiration: number;

  /**
   * Expiration of a One-time password in minutes.
   *
   * @title core:state:system:otpExpiration
   * @description core:state:system:otpExpiration_desc
   * @minimum 1
   * @maximum 60
   */
  otpExpiration: number;

  /**
   * Character length of one-time passwords.
   *
   * @title core:state:system:otpLength
   * @description core:state:system:otpLength_desc
   * @minimum 1
   * @maximum 32
   */
  otpLength: number;

  /**
   * Open registration to anonymous users. Otherwise, only executives and
   * admins can initialize a registration for a new client.
   *
   * @title core:state:system:registrationOpen
   * @description core:state:system:registrationOpen_desc
   */
  registrationOpen: boolean;

  /**
   * The sender email address for news.
   *
   * @title core:state:system:emailNews
   * @description core:state:system:emailNews_desc
   */
  emailNews: Email;

  /**
   * The sender email address for system notifications.
   *
   * @title core:state:system:emailNotify
   * @description core:state:system:emailNotify_desc
   */
  emailNotify: Email;

  /**
   * The sender email address for authentication tasks.
   *
   * @title core:state:system:emailAuth
   * @description core:state:system:emailAuth_desc
   */
  emailAuth: Email;

  /**
   * Maximum file size that can be uploaded in kilobytes.
   *
   * @title core:state:system:fileSizeMax
   * @description core:state:system:fileSizeMax_desc
   * @minimum 1
   * @maximum 8388608
   */
  fileSizeMax: number;

  /**
   * Flag to trust the proxy server for a forwarded IP address.
   *
   * @title core:state:system:proxyTrust
   * @description core:state:system:proxyTrust_desc
   */
  proxyTrust?: boolean;

  /**
   * Supported language coded for the system.
   *
   * @title core:state:system:languages
   * @description core:state:system:languages_desc
   * @minItems 1
   * @maxItems 32
   */
  languages: string[];

  /**
   * Role identifier that considers the user an administrator.
   * Administrators have complete control.
   *
   * @title core:state:system:$adminRole
   * @description core:state:system:$adminRole_desc
   */
  $adminRole: UID<Role>;

  /**
   * Role identifier that considers the user an executive.
   * Executives have second-highest control over a system, just under administrators.
   *
   * @title core:state:system:$execRole
   * @description core:state:system:$execRole_desc
   */
  $execRole: UID<Role>;

  /**
   * Anonymous access permissions.
   * These are roles used when no authorization is provided by the client.
   *
   * @title core:state:system:$anonymousRole
   * @description core:state:system:$anonymousRole_desc
   */
  $anonymousRole: UID<Role>;

  /**
   * The initial roles to assign to a user when a new account is created.
   *
   * @title core:state:system:$initialRoles
   * @description core:state:system:$initialRoles_desc
   */
  $initialRoles: UIDList<Role>;
}

/**
 * System properties excluding the extended entity properties.
 */
export type SystemRoot = DataRoot<System>;

/**
 * System base properties for creation.
 */
export type SystemMinimal = DataMinimal<System, 'name' | '$adminRole' | '$execRole'>;

/**
 * System collection meta data.
 */
export type SystemMeta = DataMeta<System>;
