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
   * @title system:state:contact:name
   * @description system:state:contact:name_desc
   * @minLength 1
   * @maxLength 128
   */
  name: string;

  /**
   * Details about the contact.
   *
   * @title system:state:contact:description
   * @description system:state:contact:description_desc
   * @minLength 1
   * @maxLength 4096
   */
  description?: string;

  /**
   * Phone numbers. First item in the array is the primary phone number.
   *
   * @title system:state:contact:phones
   * @description system:state:contact:phones_desc
   */
  phones: string[];

  /**
   * Contact emails. First item in the array is the primary email.
   *
   * @title system:state:contact:emails
   * @description system:state:contact:emails_desc
   */
  emails: Email[];

  /**
   * Contact's social urls.
   *
   * @title system:state:contact:socials
   * @description system:state:contact:socials_desc
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
