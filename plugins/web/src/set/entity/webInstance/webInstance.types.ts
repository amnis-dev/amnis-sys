import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
  Route,
  UID,
  UIDv2,
} from '@amnis/state';
import type { WebComponentID } from '../webComponent/index.js';

export type WebInstanceID = UIDv2<'webInstance'>;

/**
 * An instance based on a web component.
 */
export interface WebInstance extends Data {
  /**
   * Provided name of this web instance.
   */
  name: string;

  /**
   * Property values to configure the component.
   */
  props: Record<string, any>;

  /**
   * A regular expression appended to the base route to also render this instance on.
   */
  routeMatcher: string;

  /**
   * The base route of which this instance should be rendered on.
   */
  $route?: UID<Route>;

  /**
   * Nested web instances to render within (if the web component is capable).
   */
  $children: WebInstanceID[];

  /**
   * The web component used for this instance.
   */
  $webComponent: WebComponentID;
}

export type WebInstanceRoot = DataRoot<WebInstance>;

export type WebInstanceMinimal = DataMinimal<WebInstance, 'name' | '$webComponent'>;

export type WebInstanceMeta = DataMeta<WebInstance>;
