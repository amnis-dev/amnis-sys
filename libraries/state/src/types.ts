import type { Middleware, Reducer } from '@amnis/state/rtk';
import type { IoProcessDefinition } from './io/io.types.js';
import type {
  systemKey,
  roleKey,
  routeKey,
  EntityObjects,
  System,
  Entity,
  Role,
  Route,
} from './data/index.js';

interface _SchemaObject {
  id?: string;
  $id?: string;
  $schema?: string;
  [x: string]: any;
}

export interface SchemaObject extends _SchemaObject {
  id?: string;
  $id?: string;
  $schema?: string;
  $async?: false;
  [x: string]: any;
}

export type ReduxSet = {
  reducers: Record<string, Reducer>,
  middleware: Middleware[]
}

export type StateDataGuaranteed = {
  [K in (typeof systemKey)]: [Entity<System>]
} & {
  [K in (typeof roleKey)]: [Entity<Role>, Entity<Role>, Entity<Role>]
} & {
  [K in (typeof routeKey)]: Entity<Route>[]
} & EntityObjects;

export type StateDataPromise = (data: StateDataGuaranteed) => Promise<StateDataGuaranteed>;

export type ProcessSet = Record<string, IoProcessDefinition>;

export type LocalLocaleCode = 'en' | 'es' | 'de';

export type LocalLocale = Record<LocalLocaleCode, Promise<Record<string, string>>>;

export type UserInterface = Record<string, any>;

export interface UserInterfacePanel {
  /**
   * Plugin ID this interface panel is from.
   *
   * This is automatically applied.
   */
  pluginId?: string;

  /**
   * The name of the panel.
   */
  name: string;

  /**
   * Description of what the panel offers.
   */
  description: string;

  /**
   * Any user interface panel component to render.
   */
  panel: any;
}

export type UserInterfacePanels = UserInterfacePanel[];

export interface DynamicPlugin {
  /**
   * The identifier of the plugin.
   * Usually the name of the package.
   */
  readonly id: string,

  /**
   * A record of reducers and middleware to be added to a redux store.
   */
  set?: () => Promise<ReduxSet>,

  /**
   * Initial data records to be added to the redux store and database.
   */
  data?: () => Promise<StateDataPromise>,

  /**
   * Initial data records to be added to the redux store and database for testing.
   */
  dataTest?: () => Promise<StateDataPromise>;

  /**
   * An array of schema objects that define the data records.
   */
  schema?: () => Promise<SchemaObject[]>,

  /**
   * Process routes for API services.
   */
  process?: () => Promise<ProcessSet>,

  /**
   * Localization objects for the plugin.
   */
  locale?: () => Promise<LocalLocale>,

  /**
   * Interface components for rendering in various environments.
   */
  ui?: () => Promise<UserInterface>,

  /**
   * Interface panels for administrating the plugin.
   */
  uipanels?: () => Promise<UserInterfacePanels>,
}

export interface Plugin {
  /**
   * The identifier of the plugin.
   * Usually the name of the package.
   */
  readonly id: string;

  /**
   * A record of reducers and middleware to be added to a redux store.
   */
  set?: ReduxSet;

  /**
   * Initial data records to be added to the redux store and database.
   */
  data?: StateDataPromise;

  /**
   * Initial data records to be added to the redux store and database for testing.
   */
  dataTest?: StateDataPromise;

  /**
   * An array of schema objects that define the data records.
   */
  schema?: SchemaObject[];

  /**
   * Process routes for API services.
   */
  process?: ProcessSet;

  /**
   * Localization objects for the plugin.
   */
  locale?: LocalLocale;

  /**
   * Interface components for rendering in various environments.
   */
  ui?: UserInterface;

  /**
   * Interface panels for administrating the plugin.
   */
  uipanels?: UserInterfacePanels;
}
