import type { Preview } from "@storybook/react";
// import { decoratorRedux } from "./decorator.redux.js";
// import { loaderMock } from "./loader.mock.js";

import { decoratorAccounts, accountOptions, decoratorWebsite } from "./decorator/index.js";
import loaderDefer from "./loader.defer.js";

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
  globalTypes: {
    account: {
      name: "Account",
      description: "Account to use for the preview",
      defaultValue: Object.keys(accountOptions)[0],
      type: "string",
      toolbar: {
        icon: "user",
        items: Object.keys(accountOptions),
      }
    },
  },
  decorators: [decoratorAccounts, decoratorWebsite],
};

export default preview;
