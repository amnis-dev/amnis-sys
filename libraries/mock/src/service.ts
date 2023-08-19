import {
  schemaState,
} from '@amnis/state/schema';
import {
  contextSetup,
} from '@amnis/state/context';
import type { RequestHandler, SetupWorker } from 'msw';
// import type { SetupServer } from 'msw/node';
import { setupWorker } from 'msw';
import type { Api } from '@amnis/state';
import {
  localStorage,
  systemSlice,
  apiKey,
  dataActions,
  apiCreate,
  agentSlice,
} from '@amnis/state';
import type { MockAgents, MockService } from './types.js';
import { handlersCreate } from './handler.js';
import { mockData } from './data.js';
import { handlerPing } from './handlers/ping.js';

let service: SetupWorker | undefined;
let started = false;
let mockAgents: MockAgents;

export const mockService: MockService = {
  setup: async (options) => {
    if (service) {
      // console.warn('MSW Service has already been setup.');
      return;
    }

    const opt = { ...options };

    const {
      hostname = 'http://localhost',
      baseUrl = '/api',
      processes = {},
      context = await contextSetup({
        schemas: [schemaState],
      }),
      debug = false,
      clearStorage = true,
    } = opt;

    if (clearStorage) {
      localStorage().removeItem('state-entities');
      localStorage().removeItem('state-meta');
    }

    const system = systemSlice.select.active(context.store.getState());
    if (!system) {
      throw new Error('No active system.');
    }

    let systemDomain = hostname;
    if (!options?.hostname && typeof window !== 'undefined') {
      systemDomain = window.location.origin;
    }
    context.store.dispatch(systemSlice.action.update({
      $id: system.$id,
      domain: systemDomain,
    }));

    /**
     * Inject mock data.
     */
    const { agent, ...mockDataCreator } = await mockData(system);
    context.store.dispatch(agentSlice.action.addMany(agent));
    context.database.create(mockDataCreator);
    mockAgents = {
      adminMock: agent[0],
      execMock: agent[1],
      userMock: agent[2],
    };

    const apis: Api[] = [];
    const handlers: RequestHandler[] = [];
    Object.keys(processes).forEach((key) => {
      const definition = processes[key];
      const { meta, endpoints } = definition;

      const slash = baseUrl.startsWith('/') ? '' : '/';
      const combinedUrl = `${systemDomain}${slash}${baseUrl}/${key}`;

      if (debug) {
        // eslint-disable-next-line no-console
        console.debug(`Setting up mock process '${key}' on path '${combinedUrl}'`);
      }

      const apiNext = apiCreate({
        ...meta,
        baseUrl: `${baseUrl}/${key}`,
        $system: system.$id,
      });
      apis.push(apiNext);

      handlers.push(...handlersCreate(combinedUrl, context, endpoints));
    });

    /**
     * Setup a ping handler.
     */
    handlers.push(handlerPing(baseUrl));

    context.store.dispatch(dataActions.create({
      [apiKey]: apis,
    }));

    // On NodeJS
    if (typeof window === 'undefined') {
      const msw = await import('msw/node');
      (service as any) = msw.setupServer(...handlers);
    // On Browser
    } else {
      service = setupWorker(...handlers);
    }
  },
  start: (options) => {
    if (!service) {
      // console.error('Must call mockService.setup() before starting!');
      return;
    }
    if (started) {
      // console.warn('MSW Service has already been started.');
      return;
    }
    // NodeJS uses listen();
    if ('listen' in service) {
      (service as any).listen();
    }
    // Browser uses start();
    if ('start' in service) {
      service.start(options);
    }
    started = true;
  },
  stop() {
    if (!service) {
      // console.error('Must call mockService.setup() before stopping!');
      return;
    }

    // NodeJS uses close.
    if ('close' in service) {
      (service as any).close();
    }
    // Browser uses stop().
    if ('stop' in service) {
      service.stop();
    }

    service = undefined;
    started = false;
  },
  agents: () => mockAgents,
};

export default mockService;
