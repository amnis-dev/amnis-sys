import type {
  IoContext,
  System,
} from '@amnis/state';
import {
  agentFingerprint,
  accountsGet,
  systemSlice,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { authenticateLogin } from './authenticate.js';
import type { ApiAuthLogin } from '../api.auth.types.js';

let context: IoContext;
let system: System;

beforeAll(async () => {
  context = await contextSetup();

  system = systemSlice.select.active(context.store.getState()) as System;
});

test('should authenticate as normal user account', async () => {
  const { user: userAccount } = await accountsGet();

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body: ApiAuthLogin = {
    handle: userAccount.handle,
    password: userAccount.password,
    credential: userAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(userAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(200);
  expect(output.cookies[system.sessionKey]).toBeDefined();
  expect(output.cookies[system.sessionKey]).toEqual(expect.any(String));
  expect(output.json.bearers).toBeDefined();
  expect(output.json.bearers).toHaveLength(1);
  expect(output.json.bearers?.[0]).toMatchObject({
    $id: system.handle,
    exp: expect.any(Number),
    access: expect.any(String),
  });

  const {
    user: users,
    profile: profiles,
    contact: contacts,
    session: sessions,
  } = output.json.result;

  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    handle: 'user',
    $credentials: [
      userAccount.credential.$id,
    ],
    committed: true,
    new: false,
  });

  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    $user: users[0].$id,
  });

  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    $id: profiles[0].$contact,
  });

  expect(sessions).toBeDefined();
  expect(sessions).toHaveLength(1);
  expect(sessions[0]).toMatchObject({
    $subject: users[0].$id,
    $credential: userAccount.credential.$id,
    prv: false,
    exc: false,
    adm: false,
  });
});

test('should authenticate as executive account', async () => {
  const { exec: execAccount } = await accountsGet();

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body: ApiAuthLogin = {
    handle: execAccount.handle,
    password: execAccount.password,
    credential: execAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(execAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(200);

  const {
    user: users,
    session: sessions,
  } = output.json.result;

  expect(sessions).toBeDefined();
  expect(sessions).toHaveLength(1);
  expect(sessions[0]).toMatchObject({
    $subject: users[0].$id,
    $credential: execAccount.credential.$id,
    prv: true,
    exc: true,
    adm: false,
  });
});

test('should authenticate as administrator account', async () => {
  const { admin: adminAccount } = await accountsGet();

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body: ApiAuthLogin = {
    handle: adminAccount.handle,
    password: adminAccount.password,
    credential: adminAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(adminAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(200);

  const {
    user: users,
    session: sessions,
  } = output.json.result;

  expect(sessions).toBeDefined();
  expect(sessions).toHaveLength(1);
  expect(sessions[0]).toMatchObject({
    $subject: users[0].$id,
    $credential: adminAccount.credential.$id,
    prv: true,
    exc: false,
    adm: true,
  });
});

test('should not authenticate with non-existing user', async () => {
  const { user: userAccount } = await accountsGet();

  const handle = 'i-dont-exist';

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body: ApiAuthLogin = {
    handle,
    password: userAccount.password,
    credential: userAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(userAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Authentication Failed: User Not Found');
});

test('should not authenticate using different credentials', async () => {
  const { user: userAccount, exec: execAccount } = await accountsGet();

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body: ApiAuthLogin = {
    handle: userAccount.handle,
    password: userAccount.password,
    credential: execAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(execAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Unknown Agent');
});

test('should not authenticate using a wrong password', async () => {
  const { user: userAccount } = await accountsGet();

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body: ApiAuthLogin = {
    handle: userAccount.handle,
    password: userAccount.password.slice(-1),
    credential: userAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(userAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Authentication Failed: Wrong Password');
});

test('should not authenticate using different credentials and wrong password', async () => {
  const { user: userAccount, exec: execAccount } = await accountsGet();

  const fingerprint = await context.crypto.hashData(agentFingerprint());
  const body = {
    handle: userAccount.handle,
    password: userAccount.password.slice(-1),
    credential: execAccount.credential,
  };
  const privateKey = await context.crypto.keyUnwrap(userAccount.privateKey, fingerprint);
  const signature = await context.crypto.asymSign(JSON.stringify(body), privateKey);

  const output = await authenticateLogin(
    context,
    signature,
    body,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Authentication Failed: Invalid Credential');
});
