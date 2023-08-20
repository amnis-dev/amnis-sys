import type { Decorator } from "@storybook/react";
import { websiteCreate } from '../src/web/index.js'
import { WebProvider } from '../plugins/web/src/index.js'

const Website = websiteCreate({
  hostname: 'localhost',
  mocker: {
    production: true
  }
});

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