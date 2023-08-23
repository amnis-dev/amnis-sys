import type { UID } from '../../../core/index.js';
import type { Data, DataRoot, DataMinimal } from '../../data.types.js';
import type { Image } from '../image/image.types.js';

/**
 * Data for routing to a resouce.
 */
export interface Route extends Data {
  /**
   * Text to present when linking this route.
   */
  label: string;

  /**
   * Pathing string for this route.
   */
  path: string;

  /**
   * The title this route should have when active.
   */
  title?: string;

  /**
   * The description this route should have when active.
   */
  description?: string;

  /**
   * An image that represents this route.
   */
  image?: UID<Image>;

  /**
   * Entity ID this route points to.
   */
  $entity?: UID;

  /**
   * An icon associated with the route.
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
