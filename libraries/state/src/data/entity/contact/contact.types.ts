import type { SURL } from '../../../core/core.types.js';
import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * Contact entity
 */
export interface Contact extends Data {
  /**
   * Name (or title) of the contact
   * @title Name
   */
  name: string;

  /**
   * Details about the contact.
   */
  description?: string;

  /**
   * Phone numbers. First item in the array is the primary phone number.
   * @title Phone Numbers
   */
  phones: string[];

  /**
   * Contact emails. First item in the array is the primary email.
   * @title E-Mail Addresses
   */
  emails: string[];

  /**
   * Contact's social urls.
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
