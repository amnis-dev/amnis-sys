import type { Decorator } from "@storybook/react";
import { Provider as ReduxProvider } from "react-redux";
import { websiteCreate } from '../src/react/index.js';

const Website = websiteCreate();

/**
 * Decorator that provides the redux store to the stories.
 */
export const decoratorWebsite: Decorator = (Story) => (
  <Website.Provider>
    <Story />
  </Website.Provider>
);

export default decoratorWebsite;