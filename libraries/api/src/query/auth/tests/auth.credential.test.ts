import type { MockAgents } from '@amnis/mock';
import { mockService } from '@amnis/mock';
import type {
  Entity,
  User,
} from '@amnis/state';
import {
  credentialSlice,
  otpSlice,
  userSlice,
  databaseMemoryStorage,
  emailerboxStorage,
  agentSlice,
} from '@amnis/state';
import { apiSys } from '../../sys/index.js';
import { apiAuth } from '../index.js';
import {
  serviceConfig,
} from './config.js';
import { clientStore } from './store.js';
import type { ApiError } from '../../query.types.js';

let adminUser: Entity<User>;
let agents: MockAgents;

beforeAll(async () => {
  await mockService.setup(await serviceConfig());
  mockService.start();

  const storage = databaseMemoryStorage();
  const storageUsers = Object.values(storage[userSlice.key]) as Entity<User>[];

  adminUser = storageUsers.find((u) => u.handle === 'adminMock') as Entity<User>;

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

test('should NOT login as an administrator without matching credentials', async () => {
  /**
   * Login
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'adminMock',
    password: 'password',
  }));

  if ('data' in response) {
    expect(response.data).toBeUndefined();
    return;
  }

  const error = response.error as ApiError;
  const { data: { logs, result } } = error;

  expect(error.status).toBe(401);
  expect(result).toBeUndefined();
  expect(logs[0].title).toBe('Unknown Agent');
});

test('should add the user agent credential to the admin account and login', async () => {
  const { userMock } = agents;
  clientStore.dispatch(agentSlice.action.activeSet(userMock.$id));

  /**
   * Need to start with obtaining a one-time password
   */
  const responseOtp = await clientStore.dispatch(apiAuth.endpoints.otp.initiate({
    $subject: '@adminMock',
  }));

  if ('error' in responseOtp) {
    expect(responseOtp.error).toBeUndefined();
    return;
  }

  const { data: { result: otpResult } } = responseOtp;

  if (!otpResult) {
    expect(otpResult).toBeDefined();
    return;
  }

  /**
   * Get the OTP value from the memory mailbox.
   */
  const mailbox = emailerboxStorage();
  const message = mailbox[adminUser.email as string][0];
  const messageOtp = message.body.match(/one-time passcode is (\w+)/m)?.[1];

  if (!messageOtp) {
    expect(messageOtp).toBeDefined();
    return;
  }

  /**
   * Set the OTP value.
   */
  clientStore.dispatch(otpSlice.action.set(messageOtp));

  /**
   * With the latest OTP stored and value set in the clientStore,
   * attempt to add the new credential using the admin password.
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.credential.initiate({
    password: 'password',
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { result } } = response;

  if (!result) {
    expect(response).toBeDefined();
    return;
  }

  /**
   * Test the client store to ensure data is updated properly
   */
  const credential = credentialSlice.select.byId(
    clientStore.getState(),
    result[credentialSlice.key][0].$id,
  );
  const user = userSlice.select.byId(
    clientStore.getState(),
    result[userSlice.key][0].$id,
  );

  if (!credential || !user) {
    expect(credential).toBeDefined();
    expect(user).toBeDefined();
    return;
  }

  expect(credential).toEqual(result[credentialSlice.key][0]);
  expect(credential.$id).toBe(userMock.$credential);
  expect(user).toEqual(result[userSlice.key][0]);
  expect(user.$credentials.includes(credential.$id)).toBe(true);

  /**
   * Should now be able to login
   */
  const responseLogin = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: 'adminMock',
    password: 'password',
  }));

  if ('error' in responseLogin) {
    expect(responseLogin.error).toBeUndefined();
    return;
  }

  const resultLogin = responseLogin.data.result;

  if (!resultLogin) {
    expect(resultLogin).toBeDefined();
    return;
  }

  expect(Object.keys(resultLogin).length).toBeGreaterThan(3);
});
