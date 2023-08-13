import type { Preview } from "@storybook/react";
// import { decoratorRedux } from "./decorator.redux.js";
// import { loaderMock } from "./loader.mock.js";

import decoratorWebsite from "./decorator.website.js";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [decoratorWebsite],
  // decorators: [decoratorRedux],
  // loaders: [loaderMock]
};

export default preview;
