import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
  UIDTree,
  Route,
} from '@amnis/state';

/**
 * Website data.
 */
export interface Website extends Data {
  /**
   * Hostname this website is linked to.
   * This is used to determine the website to load.
   */
  hostname: string;

  /**
   * Title of the website
   */
  title: string;

  /**
   * Description of the website
   */
  description: string;

  /**
   * Navigational routes for the website.
   */
  routes: UIDTree<Route>;
}

export type WebsiteRoot = DataRoot<Website>;

export type WebsiteMinimal = DataMinimal<Website, 'title'>;

export type WebsiteMeta = DataMeta<Website>;
