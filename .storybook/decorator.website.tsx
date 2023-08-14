import type { Decorator } from "@storybook/react";
import { websiteCreate } from '../src/react/index.js'
import { WebProvider } from '../plugins/web/src/react/index.js'

const Website = websiteCreate();

/**
 * Decorator that provides the redux store to the stories.
 */
export const decoratorWebsite: Decorator = (Story) => (
  <Website.Provider>
    <WebProvider>
      <Story />
    </WebProvider>
  </Website.Provider>
);

export default decoratorWebsite;