import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
  UIDTree,
  RouteID,
} from '@amnis/state';

/**
 * Website font types.
 *
 * @type string
 * @format font
 */
export type WebsiteFontType = 'open-sans' | 'public-sans' | 'merriweather' | 'merriweather-sans'
| 'source-sans-pro' | 'roboto' | 'roboto-mono' | 'roboto-slab' | 'roboto-condensed' | 'lato';

/**
 * Website data.
 *
 * @title {
 * en: "Website",
 * de: "Website",
 * es: "Sitio web",
 * }
 * @description {
 * en: "Fundemental data for a website.",
 * de: "Grundlegende Daten für eine Website.",
 * es: "Datos fundamentales para un sitio web.",
 * }
 */
export interface Website extends Data {
  /**
   * Hostname this website is linked to.
   * This is used to determine the website to load.
   *
   * @title {
   *  en: "Hostname",
   *  de: "Hostname",
   *  es: "Hostname",
   * }
   * @description {
   *  en: "The hostname this website is linked to",
   *  de: "Der Hostname, mit dem diese Website verknüpft ist",
   *  es: "El nombre de host al que está vinculado este sitio web",
   * }
   * @minLength 3
   * @maxLength 128
   */
  hostname: string;

  /**
   * Title of the website
   *
   * @title {
   *  en: "Title",
   *  de: "Titel",
   *  es: "Título",
   * }
   * @description {
   *  en: "The title of the website",
   *  de: "Der Titel der Website",
   *  es: "El título del sitio web",
   * }
   * @minLength 1
   * @maxLength 256
   */
  title: string;

  /**
   * Description of the website
   *
   * @title {
   *  en: "Description",
   *  de: "Beschreibung",
   *  es: "Descripción",
   * }
   * @description {
   *  en: "The description of the website",
   *  de: "Die Beschreibung der Website",
   *  es: "La descripción del sitio web",
   * }
   * @minLength 1
   * @maxLength 4096
   */
  description: string;

  /**
   * The logo image to use for the website.
   *
   * @title {
   *  en: "Logo",
   *  de: "Logo",
   *  es: "Logo",
   * }
   * @description {
   *  en: "The logo image to use for the website",
   *  de: "Das Logobild, das für die Website verwendet werden soll",
   *  es: "La imagen del logotipo para usar en el sitio web",
   * }
   * @format image
   */
  logo?: string;

  /**
   * The default social card image for the website.
   *
   * @title {
   *  en: "Social Card",
   *  de: "Social Card",
   *  es: "Social Card",
   * }
   * @description {
   *  en: "The default social card image for the website",
   *  de: "Das Standard-Social-Card-Bild für die Website",
   *  es: "La imagen de la tarjeta social predeterminada para el sitio web",
   * }
   * @format image
   */
  socialCard?: string;

  /**
   * Font type for titles.
   *
   * @title {
   *  en: "Title Font",
   *  de: "Titelschriftart",
   *  es: "Fuente del título",
   * }
   * @description {
   *  en: "Font type for titles",
   *  de: "Schriftart für Titel",
   *  es: "Fuente del título",
   * }
   */
  fontTitle: WebsiteFontType;

  /**
   * Font type for body text.
   *
   * @title {
   *  en: "Body Font",
   *  de: "Textschriftart",
   *  es: "Fuente del cuerpo",
   * }
   * @description {
   *  en: "Font type for body text",
   *  de: "Schriftart für Fließtext",
   *  es: "Fuente del cuerpo",
   * }
   */
  fontBody: WebsiteFontType;

  /**
   * Font type for code text.
   *
   * @title {
   *  en: "Code Font",
   *  de: "Codeschriftart",
   *  es: "Fuente de código",
   * }
   * @description {
   *  en: "Font type for code text",
   *  de: "Schriftart für Code",
   *  es: "Fuente de código",
   * }
   */
  fontCode: WebsiteFontType;

  /**
   * Font type for user interface text.
   *
   * @title {
   *  en: "UI Font",
   *  de: "UI-Schriftart",
   *  es: "Fuente de la interfaz de usuario",
   * }
   * @description {
   *  en: "Font type for user interface text",
   *  de: "Schriftart für Benutzeroberflächentext",
   *  es: "Fuente de la interfaz de usuario",
   * }
   */
  fontUi: WebsiteFontType;

  /**
   * Navigational routes for the website.
   *
   * @title {
   *  en: "Routes",
   *  de: "Routen",
   *  es: "Rutas",
   * }
   * @description {
   *  en: "Navigational routes for the website",
   *  de: "Navigationsrouten für die Website",
   *  es: "Rutas de navegación para el sitio web",
   * }
   */
  $routes: UIDTree<RouteID>;
}

export type WebsiteRoot = DataRoot<Website>;

export type WebsiteMinimal = DataMinimal<Website, 'title'>;

export type WebsiteMeta = DataMeta<Website>;
