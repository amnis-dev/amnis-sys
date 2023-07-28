import type {
  Contact,
  Credential,
  Entity,
  IoContext,
  Profile,
  User,
} from '@amnis/state';
import {
  contactSlice,
  credentialSlice,
  profileSlice,
  userSlice,
  agentCredential,
  systemSlice,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { ApiAuthRegister } from '../../api.auth.types.js';
import { registerAccount } from './register.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup();
});

test('should register a new account', async () => {
  const credential = await agentCredential();

  const apiAuthRegistration: ApiAuthRegister = {
    handle: 'new_user',
    nameDisplay: 'New User',
    password: 'passwd12',
    credential,
  };

  const result = await registerAccount(
    context,
    apiAuthRegistration,
  );

  expect(result.status).toBe(200);

  const { logs, result: entities } = result.json;

  if (!entities) {
    expect(entities).toBeDefined();
    return;
  }

  const systemActive = systemSlice.select.active(context.store.getState());

  const users = entities[userSlice.key] as Entity<User>[];
  const profiles = entities[profileSlice.key] as Entity<Profile>[];
  const contacts = entities[contactSlice.key] as Entity<Contact>[];
  const credentials = entities[credentialSlice.key] as Entity<Credential>[];

  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0].new).toBe(false);
  expect(users[0].committed).toBe(true);
  expect(users[0].$roles).toEqual(systemActive?.$initialRoles);
  expect(users[0].$owner).toEqual(users[0].$id);

  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0].new).toBe(false);
  expect(profiles[0].committed).toBe(true);
  expect(profiles[0].$owner).toEqual(users[0].$id);

  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0].new).toBe(false);
  expect(contacts[0].committed).toBe(true);
  expect(contacts[0].$owner).toEqual(users[0].$id);

  expect(credentials).toBeDefined();
  expect(credentials).toHaveLength(1);
  expect(credentials[0].new).toBe(false);
  expect(credentials[0].committed).toBe(true);
  expect(credentials[0].$owner).toEqual(users[0].$id);

  expect(logs).toHaveLength(1);
  expect(logs[0].level).toBe('success');
  expect(logs[0].title).toBe('Account Created');
});

test('should not register with an existing handle', async () => {
  const credential = await agentCredential();

  const apiAuthRegistration: ApiAuthRegister = {
    handle: 'new_user',
    nameDisplay: 'New User',
    password: 'passwd12',
    credential,
  };

  const result = await registerAccount(
    context,
    apiAuthRegistration,
  );

  expect(result.status).toBe(500);
  expect(result.json.result).toBeUndefined();
  expect(result.json.logs[0].level).toBe('error');
  expect(result.json.logs[0].title).toBe('Handle Already Registered');
});
