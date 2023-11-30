import type { DateJSON, UID } from '../../../core/core.types.js';
import type { User } from '../user/user.types.js';
import type { ContactID } from '../contact/contact.types.js';
import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
} from '../../data.types.js';

/**
 * Profile entity
 *
 * @title {
 * "en": "Profile",
 * "de": "Profil",
 * "es": "Perfil",
 * }
 * @description {
 * "en": "Publicly viewable settings for the account.",
 * "de": "Öffentlich sichtbare Einstellungen für das Konto.",
 * "es": "Configuraciones visibles públicamente para la cuenta.",
 * }
 */
export interface Profile extends Data {
  /**
   * User this profile is associated with.
   */
  $_user: UID<User>;

  /**
   * Display name for the profile.
   *
   * @title {
   * en: "Display name",
   * de: "Anzeigename",
   * es: "Nombre para mostrar",
   * }
   * @description {
   * en: "The name to display for the account.",
   * de: "Der Name, der für das Konto angezeigt werden soll.",
   * es: "El nombre para mostrar de la cuenta.",
   * }
   * @minLength 1
   * @maxLength 64
   */
  nameDisplay: string;

  /**
   * Given/First name
   *
   * @title {
   * en: "First name",
   * de: "Vorname",
   * es: "Nombre de pila",
   * }
   * @description {
   * en: "The first name for the account owner.",
   * de: "Der Vorname des Kontoinhabers.",
   * es: "El nombre de pila del propietario de la cuenta.",
   * }
   * @minLength 1
   * @maxLength 128
   */
  nameGiven?: string;

  /**
   * Family/Last name
   *
   * @title {
   * en: "Last name",
   * de: "Nachname",
   * es: "Apellido",
   * }
   * @description {
   * en: "The last name for the account owner.",
   * de: "Der Nachname des Kontoinhabers.",
   * es: "El apellido del propietario de la cuenta.",
   * }
   */
  nameFamily?: string;

  /**
   * Date of birth.
   *
   * @title {
   * en: "Date of birth",
   * de: "Geburtsdatum",
   * es: "Fecha de nacimiento",
   * }
   * @description {
   * en: "The date of birth for the account owner.",
   * de: "Das Geburtsdatum des Kontoinhabers.",
   * es: "La fecha de nacimiento del propietario de la cuenta.",
   * }
   * @format date
   */
  birthDate?: DateJSON;

  /**
   * Title for work or otherwise.
   *
   * @title {
   * en: "Title",
   * de: "Titel",
   * es: "Título",
   * }
   * @description {
   * en: "A title provided to this account owner",
   * de: "Ein Titel, der diesem Kontoinhaber verliehen wurde",
   * es: "Un título proporcionado a este propietario de cuenta",
   * }
   * @minLength 1
   * @maxLength 128
   */
  title?: string;

  /**
   * Profile Contact.
   */
  $_contact?: ContactID;

  /**
   * Organization profile is a part of.
   *
   * @title {
   * en: "Organization",
   * de: "Organisation",
   * es: "Organización",
   * }
   * @description {
   * en: "An organization this account is associated with.",
   * de: "Eine Organisation, mit der dieses Konto verbunden ist.",
   * es: "Una organización con la que esta cuenta está asociada.",
   * }
   */
  organization?: string;

  /**
   * Avatar string url to an image.
   *
   * @title {
   * en: "Avatar",
   * de: "Avatar",
   * es: "Avatar",
   * }
   * @description {
   * en: "An avatar image to display for the account.",
   * de: "Ein Avatarbild, das für das Konto angezeigt werden soll.",
   * es: "Una imagen de avatar para mostrar en la cuenta.",
   * }
   * @format image
   */
  avatar?: string;
}

/**
 * Profile properties excluding the extended entity properties.
 */
export type ProfileRoot = DataRoot<Profile>;

/**
 * Root properties.
 */
export type ProfileMinimal = DataMinimal<Profile, 'nameDisplay' | '$_user'>;

/**
 * Profile collection meta data.
 */
export type ProfileMeta = DataMeta<Profile>;

/**
 * Profile ID
 *
 * @title {
 * en: "Profile ID",
 * de: "Profil-ID",
 * es: "ID de perfil",
 * }
 * @description {
 * en: "Unique identifier for a profile.",
 * de: "Eindeutiger Bezeichner für ein Profil.",
 * es: "Identificador único para un perfil.",
 * }
 * @type {string}
 * @pattern ^profile:[A-Za-z0-9_-]{21}$
 */
export type ProfileID = UID<Profile>;
