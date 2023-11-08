import type { UID } from '../../../core/index.js';
import type { Data, DataRoot, DataMinimal } from '../../data.types.js';
import type { Image } from '../image/image.types.js';

/**
 * Data for routing to a resouce.
 *
 * @title {
 * en: "Route",
 * de: "Route",
 * es: "Ruta",
 * }
 * @description {
 * en: "Data for routing to a resouce.",
 * de: "Daten zum Routing zu einer Ressource.",
 * es: "Datos para enrutar a un recurso.",
 * }
 */
export interface Route extends Data {
  /**
   * Text to present when linking this route.
   *
   * @title {
   *  en: "Label",
   *  de: "Bezeichnung",
   *  es: "Etiqueta",
   * }
   * @description {
   *  en: "Text to present when linking this route.",
   *  de: "Text, der beim Verlinken dieser Route angezeigt werden soll.",
   *  es: "Texto para presentar al vincular esta ruta.",
   * }
   */
  label: string;

  /**
   * Pathing string for this route.
   *
   * @title {
   * en: "Path",
   * de: "Pfad",
   * es: "Ruta",
   * }
   * @description {
   * en: "Pathing string for this route.",
   * de: "Pfadzeichenfolge für diese Route.",
   * es: "Cadena de enrutamiento para esta ruta.",
   * }
   */
  path: string;

  /**
   * The title this route should have when active.
   *
   * @title {
   * en: "Title",
   * de: "Titel",
   * es: "Título",
   * }
   * @description {
   * en: "The title this route should have when active.",
   * de: "Der Titel, den diese Route haben sollte, wenn sie aktiv ist.",
   * es: "El título que debe tener esta ruta cuando está activa.",
   * }
   */
  title?: string;

  /**
   * The description this route should have when active.
   *
   * @title {
   * en: "Description",
   * de: "Beschreibung",
   * es: "Descripción",
   * }
   * @description {
   * en: "The description this route should have when active.",
   * de: "Die Beschreibung, die diese Route haben sollte, wenn sie aktiv ist.",
   * es: "La descripción que debe tener esta ruta cuando está activa.",
   * }
   */
  description?: string;

  /**
   * An image that represents this route.
   *
   * @title {
   * en: "Image",
   * de: "Bild",
   * es: "Imagen",
   * }
   * @description {
   * en: "An image that represents this route.",
   * de: "Ein Bild, das diese Route repräsentiert.",
   * es: "Una imagen que representa esta ruta.",
   * }
   */
  image?: UID<Image>;

  /**
   * Entity ID this route points to.
   *
   * @title {
   * en: "Entity",
   * de: "Entität",
   * es: "Entidad",
   * }
   * @description {
   * en: "Entity ID this route points to.",
   * de: "Die Entitäts-ID, auf die diese Route verweist.",
   * es: "ID de entidad a la que apunta esta ruta.",
   * }
   */
  $entity?: UID;

  /**
   * An icon associated with the route.
   *
   * @title {
   * en: "Icon",
   * de: "Symbol",
   * es: "Icono",
   * }
   * @description {
   * en: "An icon associated with the route.",
   * de: "Ein Symbol, das mit der Route verknüpft ist.",
   * es: "Un icono asociado a la ruta.",
   * }
   */
  icon?: string;
}

/**
 * Route properties excluding the extended entity properties.
 */
export type RouteRoot = DataRoot<Route>;

/**
 * Root properties in order to create a log.
 */
export type RouteMinimal = DataMinimal<Route, 'label' | 'path'>;

/**
 * Route ID
 *
 * @title {
 *  en: "Route",
 *  de: "Route",
 *  es: "Ruta",
 * }
 * @description {
 *  en: "A route to a resource.",
 *  de: "Eine Route zu einer Ressource.",
 *  es: "Una ruta a un recurso.",
 * }
 * @type {string}
 * @pattern ^route:[A-Za-z0-9_-]{21}$
 */
export type RouteID = UID<Route>;
