/* eslint-disable max-len */
import type {
  DateJSON, UIDList,
} from '../../../core/core.types.js';
import type { Permit } from '../permit/permit.types.js';
import type { Credential, CredentialID } from '../credential/credential.types.js';
import type { Role, RoleID } from '../role/role.types.js';
import type {
  Data, DataMeta, DataMinimal, DataRoot,
} from '../../data.types.js';

/**
 * Data associated to a User.
 *
 * @title {
 * "en": "User",
 * "de": "Benutzer",
 * "es": "Usuario",
 * }
 * @description {
 * "en": "A user who can authenticate to the system.",
 * "de": "Ein Benutzer, der sich am System authentifizieren kann.",
 * "es": "Un usuario que puede autenticarse en el sistema.",
 * }
 */
export interface User extends Data {
  /**
   * Handle for the user.
   *
   * @title {
   * "en": "Handle",
   * "de": "Griff",
   * "es": "Mango",
   * }
   * @description {
   * "en": "An easy to read unique identifier associated with this account.",
   * "de": "Ein leicht zu lesender eindeutiger Bezeichner, der mit diesem Konto verknüpft ist.",
   * "es": "Un identificador único fácil de leer asociado a esta cuenta.",
   * }
   * @format handle
   * @minLength 1
   * @maxLength 24
   */
  handle: string;

  /**
   * A hashed value of the users password.
   *
   * @title {
   * "en": "Password",
   * "de": "Passwort",
   * "es": "Contraseña",
   * }
   * @description {
   * "en": "A personal array of characters to use for authentication.",
   * "de": "Ein persönliches Array von Zeichen zur Verwendung für die Authentifizierung.",
   * "es": "Una matriz personal de caracteres para usar en la autenticación.",
   * }
   * @format password
   */
  password?: string;

  /**
   * If this account is locked from being authenticated.
   *
   * @title {
   * "en": "Locked",
   * "de": "Gesperrt",
   * "es": "Bloqueado",
   * }
   * @description {
   * "en": "If this account is locked out from being authenticated.",
   * "de": "Wenn dieses Konto gesperrt ist und nicht authentifiziert werden kann.",
   * "es": "Si esta cuenta está bloqueada y no se puede autenticar.",
   * }
   * @default false
   */
  locked: boolean;

  /**
   * Email address for user account related purposes.
   *
   * @title {
   * "en": "Email",
   * "de": "Email",
   * "es": "Correo electrónico",
   * }
   * @description {
   * "en": "Email address for user account related purposes; such as password resets.",
   * "de": "E-Mail-Adresse für benutzerkontenbezogene Zwecke; wie z.B. Passwort-Resets.",
   * "es": "Dirección de correo electrónico para fines relacionados con la cuenta de usuario; como restablecimientos de contraseña.",
   * }
   * @format email
   */
  email?: string;

  /**
   * If the user email is verified.
   *
   * @title {
   * "en": "Email Verified",
   * "de": "E-Mail verifiziert",
   * "es": "Correo electrónico verificado",
   * }
   * @description {
   * "en": "If the user email is verified.",
   * "de": "Wenn die E-Mail des Benutzers verifiziert ist.",
   * "es": "Si el correo electrónico del usuario está verificado.",
   * }
   */
  _emailVerified?: boolean;

  /**
   * Phone number for user account related purposes.
   *
   * @title {
   * "en": "Phone",
   * "de": "Telefon",
   * "es": "Teléfono",
   * }
   * @description {
   * "en": "Phone number for user account related purposes; such as password resets.",
   * "de": "Telefonnummer für benutzerkontenbezogene Zwecke; wie z.B. Passwort-Resets.",
   * "es": "Número de teléfono para fines relacionados con la cuenta de usuario; como restablecimientos de contraseña.",
   * }
   *
   * @maxLength 24
   */
  phone?: string;

  /**
   * If the user phone number is verified.
   *
   * @title {
   * "en": "Phone Verified",
   * "de": "Telefon verifiziert",
   * "es": "Teléfono verificado",
   * }
   * @description {
   * "en": "If the user phone number is verified.",
   * "de": "Wenn die Telefonnummer des Benutzers verifiziert ist.",
   * "es": "Si el número de teléfono del usuario está verificado.",
   * }
   */
  _phoneVerified?: boolean;

  /**
   * If this is an administrative account.
   *
   * @title {
   * "en": "Admin",
   * "de": "Admin",
   * "es": "Admin",
   * }
   * @description {
   * "en": "If this is an administrative account.",
   * "de": "Wenn dies ein Administratorkonto ist.",
   * "es": "Si esta es una cuenta administrativa.",
   * }
   */
  _admin?: boolean;

  /**
   * Date-time of last login.
   *
   * @title {
   * "en": "Last Login",
   * "de": "Letzte Anmeldung",
   * "es": "Último acceso",
   * }
   * @description {
   * "en": "Date-time of last login.",
   * "de": "Datum und Uhrzeit der letzten Anmeldung.",
   * "es": "Fecha y hora del último inicio de sesión.",
   * }
   */
  _logged?: DateJSON;

  /**
   * Credentials this user has registered.
   *
   * @title {
   * "en": "Credentials",
   * "de": "Anmeldeinformationen",
   * "es": "Credenciales",
   * }
   * @description {
   * "en": "Device credentials registered to this account.",
   * "de": "Geräteanmeldeinformationen, die diesem Konto zugeordnet sind.",
   * "es": "Credenciales de dispositivo registradas en esta cuenta.",
   * }
   *
   * @default []
   */
  $credentials: CredentialID[];

  /**
   * Roles this user has been given.
   *
   * @title {
   * "en": "Roles",
   * "de": "Rollen",
   * "es": "Roles",
   * }
   * @description {
   * "en": "Roles this user has been given.",
   * "de": "Rollen, die diesem Benutzer zugewiesen wurden.",
   * "es": "Roles que se le han asignado a este usuario.",
   * }
   * @default []
   */
  $roles: RoleID[];
}

/**
 * User properties excluding the extended entity properties.
 */
export type UserRoot = DataRoot<User>;

/**
  * User base properties for creation.
  */
export type UserMinimal = DataMinimal<User, 'handle'>;

/**
 * User collection meta data.
 */
export type UserMeta = DataMeta<User>;
