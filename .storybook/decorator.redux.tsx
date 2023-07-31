import type { Decorator } from "@storybook/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store.js";

/**
 * Decorator that provides the redux store to the stories.
 */
export const decoratorRedux: Decorator = (Story) => (
  <ReduxProvider store={store}>
    <Story />
  </ReduxProvider>
);

export default decoratorRedux;