import type { MockAgents } from '@amnis/mock';
import { mockService } from '@amnis/mock';
import {
  entityStrip,
  contactSlice,
  userSlice,
  agentSlice,
} from '@amnis/state';
import { apiAuth } from '../../auth/index.js';
import { apiSys } from '../../sys/index.js';
import { apiCrud } from '../index.js';
import { serviceConfig } from './config.js';
import { clientStore } from './store.js';

let agents: MockAgents;

beforeAll(async () => {
  await mockService.setup(await serviceConfig());
  mockService.start();

  agents = mockService.agents();
  clientStore.dispatch(agentSlice.action.insertMany(Object.values(agents)));

  await clientStore.dispatch(
    apiSys.endpoints.system.initiate({
      url: 'http://localhost/api/sys/system',
      set: true,
    }),
  );
});

afterAll(() => {
  mockService.stop();
});

test('should be able to create a new contact', async () => {
  /**
   * Set the user account information.
   */
  clientStore.dispatch(agentSlice.action.activeSet(agents.adminMock.$id));

  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'adminMock',
    password: 'password',
  }));

  const contactCreatorAction = contactSlice.action.create({
    name: 'New Contact',
    emails: ['new@email.com'],
    phones: [],
    socials: [],
  });
  const contactActionEntityId = contactCreatorAction.payload[contactSlice.key][0].$id;

  /**
   * Locally create the entity.
   */
  clientStore.dispatch(contactCreatorAction);

  /**
   * Select the newly created entity.
   */
  const contactLocal = contactSlice.select.byId(clientStore.getState(), contactActionEntityId);
  if (!contactLocal) {
    expect(contactLocal).toBeDefined();
    return;
  }
  expect(contactLocal.committed).toBe(false);
  expect(contactLocal.new).toBe(true);

  const contactStripped = entityStrip(contactLocal);
  const result = await clientStore.dispatch(apiCrud.endpoints.create.initiate({
    [contactSlice.key]: [contactStripped],
  }));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;
  const contactResult = data.result?.[contactSlice.key]?.[0];

  expect(contactResult).toBeDefined();

  const state = clientStore.getState();
  const user = userSlice.select.active(state);
  const contact = contactSlice.select.byId(state, contactResult?.$id || '');

  expect(contact).toMatchObject({
    name: 'New Contact',
    emails: ['new@email.com'],
    $creator: user?.$id,
    $owner: user?.$id,
    committed: true,
    new: false,
  });
});
