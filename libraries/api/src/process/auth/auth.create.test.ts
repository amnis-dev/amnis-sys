import type {
  Contact,
  Entity,
  Handle,
  IoContext,
  IoInput,
  Profile,
  User,
} from '@amnis/state';
import {
  contactSlice,
  handleSlice,
  profileSlice,
  userSlice,

  accountsGet,
  accountsSign,
  base64JsonEncode,
  ioOutput,
  uid,
  systemSlice,
  ioInput,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { ApiAuthCreate } from '../../api.auth.types.js';
import { schemaAuth } from '../../schema/index.js';
import { generateSession } from '../../utility/generate.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthCreate } from './auth.create.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth],
  });
});

test('should create a new account as an admin', async () => {
  const { admin } = await accountsGet();

  /**
   * Create an administrative session with the admin public key.
   */
  const system = systemSlice.select.active(context.store.getState());
  if (!system) {
    expect(system).toBeDefined();
    return;
  }
  const session = await generateSession(system, uid('user'), admin.credential.$id);
  session.prv = true;
  session.adm = true;
  const sessionEncrypted = await context.crypto.sessionEncrypt(session);

  /**
   * Get a challenge.
   */
  const outputChallenge = await processAuthChallenge(context)(ioInput({ body: {} }), ioOutput());

  const challenge = outputChallenge.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Prepare the create request.
   */
  const apiAuthCreate: ApiAuthCreate = {
    handle: 'new_user',
    password: 'passwd12',
    email: 'account@email.addr',
    nameDisplay: 'New User',
  };

  const signatureEncoded = await accountsSign(admin.privateKey, apiAuthCreate);

  const input: IoInput<ApiAuthCreate> = ioInput({
    body: apiAuthCreate,
    sessionEncrypted,
    signatureEncoded,
    challengeEncoded,
  });
  const output = await processAuthCreate(context)(input, ioOutput());

  expect(output.status).toBe(200);

  const handles = output.json.result?.[handleSlice.key] as Entity<Handle>[];
  const users = output.json.result?.[userSlice.key] as Entity<User>[];
  const profiles = output.json.result?.[profileSlice.key] as Entity<Profile>[];
  const contact = output.json.result?.[contactSlice.key] as Entity<Contact>[];

  expect(users).toHaveLength(1);
  expect(users[0].new).toBe(false);
  expect(users[0].committed).toBe(true);
  expect(users[0].email).toBe(apiAuthCreate.email);
  expect(users[0].emailVerified).toBeFalsy();
  expect(users[0].$roles).toEqual(system.$initialRoles);

  expect(handles).toHaveLength(1);
  expect(handles[0].new).toBe(false);
  expect(handles[0].committed).toBe(true);
  expect(handles[0].name).toBe(apiAuthCreate.handle);
  expect(handles[0].$subject).toBe(users[0].$id);

  expect(profiles).toHaveLength(1);
  expect(profiles[0].new).toBe(false);
  expect(profiles[0].committed).toBe(true);
  expect(profiles[0].$user).toBe(users[0].$id);
  expect(profiles[0].nameDisplay).toBe(apiAuthCreate.nameDisplay);

  expect(contact).toHaveLength(1);
  expect(contact[0].new).toBe(false);
  expect(contact[0].committed).toBe(true);
  expect(contact[0].name).toBe(handles[0].name);
  expect(profiles[0].nameDisplay).toBe(apiAuthCreate.nameDisplay);
});
