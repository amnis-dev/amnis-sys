import type { Email, UID } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * Contact entity
 *
 * @title {
 * en: "Contact",
 * de: "Kontakt",
 * es: "Contacto",
 * }
 * @description {
 * en: "Methods of contacting the account owner.",
 * de: "Methoden, um den Kontoinhaber zu kontaktieren.",
 * es: "Métodos para contactar al propietario de la cuenta.",
 * }
 */
export interface Contact extends Data {
  /**
   * Name (or title) of the contact
   *
   * @title {
   * en: "Name",
   * de: "Name",
   * es: "Nombre",
   * }
   * @description {
   * en: "Name of the contact.",
   * de: "Name des Kontakts.",
   * es: "Nombre del contacto.",
   * }
   * @minLength 1
   * @maxLength 128
   */
  name: string;

  /**
   * Details about the contact.
   *
   * @title {
   * en: "Description",
   * de: "Beschreibung",
   * es: "Descripción",
   * }
   * @description {
   * en: "Description of the contact.",
   * de: "Beschreibung des Kontakts.",
   * es: "Descripción del contacto.",
   * }
   * @minLength 1
   * @maxLength 4096
   */
  description?: string;

  /**
   * Phone numbers. First item in the array is the primary phone number.
   *
   * @title {
   * en: "Phone numbers",
   * de: "Telefonnummern",
   * es: "Números de teléfono",
   * }
   * @description {
   * en: "Contact phone numbers.",
   * de: "Kontakt-Telefonnummern.",
   * es: "Números de teléfono de contacto.",
   * }
   */
  phones: string[];

  /**
   * Contact emails. First item in the array is the primary email.
   *
   * @title {
   * en: "Emails",
   * de: "E-Mails",
   * es: "Correos electrónicos",
   * }
   * @description {
   * en: "Contact emails.",
   * de: "Kontakt-E-Mails.",
   * es: "Correos electrónicos de contacto.",
   * }
   */
  emails: Email[];

  /**
   * Contact's social urls.
   *
   * @title {
   * en: "Socials",
   * de: "Soziales",
   * es: "Redes sociales",
   * }
   * @description {
   * en: "Contact's social urls.",
   * de: "Soziale URLs des Kontakts.",
   * es: "URLs sociales del contacto.",
   * }
   * @format url
   */
  socials: string[];
}

/**
 * Contact properties excluding the extended entity properties.
 */
export type ContactRoot = DataRoot<Contact>;

/**
 * Root properties in order to create a log.
 */
export type ContactMinimal = DataMinimal<Contact, 'name'>;

/**
 * Contact collection meta data.
 */
export type ContactMeta = DataMeta<Contact>;

/**
 * Contact ID
 *
 * @title {
 * en: "Contact ID",
 * de: "Kontakt ID",
 * es: "ID de contacto",
 * }
 * @description {
 * en: "Unique identifier for a contact.",
 * de: "Eindeutiger Bezeichner für einen Kontakt.",
 * es: "Identificador único para contacto.",
 * }
 * @type {string}
 * @pattern ^contact:[A-Za-z0-9_-]{21}$
 */
export type ContactID = UID<Contact>;
