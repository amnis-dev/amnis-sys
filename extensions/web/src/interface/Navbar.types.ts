import type { Route, UIDTree } from '@amnis/state';

/**
 * A navigational bar that displays links for routing, application/account settings,
 * searching, and language selections.
 */
export interface NavbarProps {
  /**
   * The heading text to display on the navigation bar.
   */
  title?: string;

  /**
   * Hide the visibility of the website title on the navigation bar.
   */
  titleHide?: boolean;

  /**
   * Routing information.
   */
  routes?: UIDTree<Route>;

  /**
   * Hides the navigation bar routes.
   */
  routesHide?: boolean;

}
