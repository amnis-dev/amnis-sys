import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
  UIDTree,
  Route,
} from '@amnis/state';

/**
 * Website font types.
 */
export type WebsiteFontType = 'open-sans' | 'public-sans' | 'merriweather' | 'merriweather-sans'
| 'source-sans-pro' | 'roboto' | 'roboto-mono' | 'roboto-slab' | 'roboto-condensed' | 'lato';

/**
 * Website data.
 */
export interface Website extends Data {
  /**
   * Hostname this website is linked to.
   * This is used to determine the website to load.
   *
   * @title web:website:hostname
   * @description web:website:hostname_desc
   * @minLength 3
   * @maxLength 128
   */
  hostname: string;

  /**
   * Title of the website
   *
   * @title web:website:title
   * @description web:website:title_desc
   * @minLength 1
   * @maxLength 256
   */
  title: string;

  /**
   * Description of the website
   *
   * @title web:website:description
   * @description web:website:description_desc
   * @minLength 1
   * @maxLength 4096
   */
  description: string;

  /**
   * The logo image to use for the website.
   *
   * @title web:website:logo
   * @description web:website:logo_desc
   * @format url-image
   */
  logo?: string;

  /**
   * The default social card image for the website.
   *
   * @title web:website:socialCard
   * @description web:website:socialCard_desc
   * @format url-image
   */
  socialCard?: string;

  /**
   * Font type for titles.
   *
   * @title web:website:fontTitle
   * @description web:website:fontTitle_desc
   * @format font
   */
  fontTitle: WebsiteFontType;

  /**
   * Font type for body text.
   *
   * @title web:website:fontBody
   * @description web:website:fontBody_desc
   * @format font
   */
  fontBody: WebsiteFontType;

  /**
   * Font type for code text.
   *
   * @title web:website:fontCode
   * @description web:website:fontCode_desc
   * @format font
   */
  fontCode: WebsiteFontType;

  /**
   * Font type for user interface text.
   *
   * @title web:website:fontUi
   * @description web:website:fontUi_desc
   * @format font
   */
  fontUi: WebsiteFontType;

  /**
   * Navigational routes for the website.
   *
   * @title web:website:routes
   * @description web:website:routes_desc
   */
  $routes: UIDTree<Route>;
}

export type WebsiteRoot = DataRoot<Website>;

export type WebsiteMinimal = DataMinimal<Website, 'title'>;

export type WebsiteMeta = DataMeta<Website>;
