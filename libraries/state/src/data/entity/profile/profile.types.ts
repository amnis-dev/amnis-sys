import type { DateJSON, UID, SURL } from '../../../core/core.types.js';
import type { User } from '../user/user.types.js';
import type { Contact } from '../contact/contact.types.js';
import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
} from '../../data.types.js';

/**
 * Profile entity
 */
export interface Profile extends Data {
  /**
   * User this profile is associated with.
   */
  $user: UID<User>;

  /**
   * Display name for the profile.
   */
  nameDisplay: string;

  /**
   * Given/First name
   */
  nameGiven?: string;

  /**
   * Family/Last name
   */
  nameFamily?: string;

  /**
   * Date of birth.
   */
  birthDate?: DateJSON;

  /**
   * Title for work or otherwise.
   */
  title?: string;

  /**
   * Profile Contact.
   */
  $contact?: UID<Contact>;

  /**
   * Organization profile is a part of.
   */
  organization?: string;

  /**
   * Avatar string url to an image.
   */
  avatar?: SURL;
}

/**
 * Profile properties excluding the extended entity properties.
 */
export type ProfileRoot = DataRoot<Profile>;

/**
 * Root properties.
 */
export type ProfileMinimal = DataMinimal<Profile, 'nameDisplay' | '$user'>;

/**
 * Profile collection meta data.
 */
export type ProfileMeta = DataMeta<Profile>;
