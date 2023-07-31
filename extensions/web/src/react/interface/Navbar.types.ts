import type { DataTree, Route } from '@amnis/state';

export interface NavbarProps {
  /**
   * The heading text to display on the navigation bar.
   */
  title?: string;

  /**
   * Hide the visibility of the title on the navigation bar.
   */
  titleHide?: boolean;

  /**
   * Routing information.
   */
  routes?: DataTree<Route>;

  /**
   * Hides the navigation bar routes.
   */
  routesHide?: boolean;

}
