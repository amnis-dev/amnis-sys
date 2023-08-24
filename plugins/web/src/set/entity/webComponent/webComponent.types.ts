import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
  UIDv2,
} from '@amnis/state';

export type WebComponentID = UIDv2<'webComponent'>;

/**
 * Web Component types.
 */
export type WebComponentType = 'input' | 'display' | 'feedback' | 'surface' | 'layout' | 'navigation' | 'utility' | 'other';

/**
 * Web Component data.
 */
export interface WebComponent extends Data {
  /**
   * Provided key of this web component.
   * This maps to the functional component to render.
   */
  key: string;

  /**
   * The type category web component fall under based on its intended behavior.
   */
  type: WebComponentType;

  /**
   * Description of the web component.
   */
  description: string;

  /**
   * The schema reference for this component properties.
   */
  schema: string;
}

export type WebComponentRoot = DataRoot<WebComponent>;

export type WebComponentMinimal = DataMinimal<WebComponent, 'key' | 'type'>;

export type WebComponentMeta = DataMeta<WebComponent>;

// /**
//    * Properties to pass to this component.
//    */
// props: Record<string, any>;

// /**
//  * The routes of which this component should be rendered on.
//  */
// $routes: UID<Route>[];

// /**
//  * Children of this component.
//  */
// $children: WebComponentID[];
