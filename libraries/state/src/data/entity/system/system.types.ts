import type { Role } from '../role/role.types.js';
import type { Email, UID, UIDList } from '../../../core/core.types.js';
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
   */
  name: string;

  /**
   * System handle for identifying system created resources.
   */
  handle: HandleName;

  /**
   * Domain name of the system.
   */
  domain: string;

  /**
   * Allowed CORS origins.
   */
  cors: string[];

  /**
   * Name of the session key.
   */
  sessionKey: string;

  /**
   * Number in minutes that an authentication session should live.
   *
   * @default 60
   */
  sessionExpires: number;

  /**
   * Number in minutes that a bearer token should live.
   *
   * @default 30
   */
  bearerExpires: number;

  /**
   * Open registration to anonymous users. Otherwise, only executives and
   * admins can initialize a registration for a new client.
   *
   * @default true
   */
  registrationOpen: boolean;

  /**
   * Expiration of a challenge code in minutes.
   *
   * @default 30
   */
  challengeExpiration: number;

  /**
   * Expiration of a One-time password in minutes.
   *
   * @default 5
   */
  otpExpiration: number;

  /**
   * Character length of one-time passwords.
   *
   * @default 12
   */
  otpLength: number;

  /**
   * The sender email address for news.
   */
  emailNews: Email;

  /**
   * The sender email address for system notifications.
   */
  emailNotify: Email;

  /**
   * The sender email address for authentication tasks.
   */
  emailAuth: Email;

  /**
   * Maximum file size that can be uploaded in kilobytes.
   */
  fileSizeMax: number;

  /**
   * Flag to trust the proxy server for a forwarded IP address.
   */
  proxyTrust?: boolean;

  /**
   * Role identifier that considers the user an administrator.
   * Administrators have complete control.
   */
  $adminRole: UID<Role>;

  /**
   * Role identifier that considers the user an executive.
   * Executives have second-highest control over a system, just under administrators.
   */
  $execRole: UID<Role>;

  /**
   * Anonymous access permissions.
   * These are roles used when no authorization is provided by the client.
   *
   * @default []
   */
  $anonymousRole: UID<Role>;

  /**
   * The initial roles to assign to a user when a new account is created.
   *
   * @default []
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
