import type { Decorator } from "@storybook/react";
import { websiteCreate } from '../../src/web/index.js';

const Website = websiteCreate({
  hostname: 'localhost',
  mocker: {
    production: true
  }
});

/**
 * Decorator that provides the redux store to the stories.
 */
export const decoratorWebsite: Decorator = (Story, context) => {

  const mock = context.parameters.mock;

  if(!mock) return <Story />;

  return (
  <Website.Provider>
    <Story />
  </Website.Provider>
  );
};

export default decoratorWebsite;