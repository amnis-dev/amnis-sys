import type { Preview } from "@storybook/react";
import { decoratorRedux } from "./decorator.redux.js";
import { loaderMock } from "./loader.mock.js";

/**
 * Import the blueprint css file.
 */
import "@blueprintjs/core/lib/css/blueprint.css";

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
  decorators: [decoratorRedux],
  loaders: [loaderMock]
};

export default preview;
