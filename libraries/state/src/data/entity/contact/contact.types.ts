import type { Email, SURL } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * Contact entity
 */
export interface Contact extends Data {
  /**
   * Name (or title) of the contact
   *
   * @title core:state:contact:name
   * @description core:state:contact:name_desc
   * @minLength 1
   * @maxLength 128
   */
  name: string;

  /**
   * Details about the contact.
   *
   * @title core:state:contact:description
   * @description core:state:contact:description_desc
   * @minLength 1
   * @maxLength 4096
   */
  description?: string;

  /**
   * Phone numbers. First item in the array is the primary phone number.
   *
   * @title core:state:contact:phones
   * @description core:state:contact:phones_desc
   */
  phones: string[];

  /**
   * Contact emails. First item in the array is the primary email.
   *
   * @title core:state:contact:emails
   * @description core:state:contact:emails_desc
   */
  emails: Email[];

  /**
   * Contact's social urls.
   *
   * @title core:state:contact:socials
   * @description core:state:contact:socials_desc
   */
  socials: SURL[];
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
