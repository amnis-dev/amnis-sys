import type {
  Data, DataRoot, DataMinimal, DataMeta,
} from '../../data.types.js';

/**
 * A brief statement from an authoritative source.
 */
export interface Bulletin extends Data {
  /**
   * Bulletin title.
   *
   * @minLength 1
   * @maxLength 64
   */
  title: string;

  /**
   * Textual content that supports markdown.
   *
   * @minLength 1
   * @maxLength 8192
   */
  markdown: string;

  /**
   * Optional tags to help categorize the bulletin.
   */
  tags: string[];

  /**
   * Flags the bulletin as important so an application
   * can emphasize it.
   */
  important?: boolean;
}

/**
 * Bulletin properties excluding the extended entity properties.
 */
export type BulletinRoot = DataRoot<Bulletin>;

/**
 * Root properties.
 */
export type BulletinMinimal = DataMinimal<Bulletin, 'title' | 'markdown'>;

/**
 * Bulletin collection meta data.
 */
export type BulletinMeta = DataMeta<Bulletin>;
