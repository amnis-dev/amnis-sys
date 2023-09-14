import type {
  Entity,
  IoContext,
  User,
  Credential,
  Contact,
  Profile,
  Role,
} from '@amnis/state';
import {
  roleSlice,
  databaseMemoryStorage,
  userSlice,
  credentialSlice,
  contactSlice,
  profileSlice,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import {
  findContactById,
  findCredentialById,
  findLocaleByNames,
  findProfileByUserId,
  findRolesByIds,
  findUserByHandle,
} from './find.js';

let context: IoContext;
let userExisting: Entity<User>;
let profileExisting: Entity<Profile>;
let credentialExisting: Entity<Credential>;
let contactExisting: Entity<Contact>;
let rolesExisting: Entity<Role>[];

beforeAll(async () => {
  context = await contextSetup();

  userExisting = Object.values(
    databaseMemoryStorage()[userSlice.key],
  )[0] as Entity<User>;

  profileExisting = Object.values(
    databaseMemoryStorage()[profileSlice.key],
  )[0] as Entity<Profile>;

  credentialExisting = Object.values(
    databaseMemoryStorage()[credentialSlice.key],
  )[0] as Entity<Credential>;

  contactExisting = Object.values(
    databaseMemoryStorage()[contactSlice.key],
  )[0] as Entity<Contact>;

  rolesExisting = Object.values(
    databaseMemoryStorage()[roleSlice.key],
  ) as Entity<Role>[];
});

test('should find user by handle', async () => {
  const found = await findUserByHandle(context, userExisting.handle);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.handle).toBe(userExisting.handle);
});

test('should find profile by user id', async () => {
  const found = await findProfileByUserId(context, profileExisting.$user);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(profileExisting.$id);
});

test('should find credential by id', async () => {
  const found = await findCredentialById(context, credentialExisting.$id);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(credentialExisting.$id);
});

test('should find contact by id', async () => {
  const found = await findContactById(context, contactExisting.$id);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(contactExisting.$id);
});

test('should find roles by ids', async () => {
  const roleIds = rolesExisting.map((role) => role.$id);
  const found = await findRolesByIds(context, roleIds);

  expect(roleIds.length).toBeGreaterThan(0);
  expect(roleIds.length).toBe(found.length);
  expect(found).toEqual(rolesExisting);
});

test('should find locale by names', async () => {
  const names = [
    '_state.UID.title',
    '_state.UID.desc',
    '_state.DateJSON.title',
    '_state.DateJSON.desc',
    '_state.Email.title',
    '_state.Email.desc',
  ];
  const foundEn = await findLocaleByNames(context, names, 'en');

  console.log(JSON.stringify(foundEn, null, 2));

  expect(foundEn).toBeDefined();
  expect(foundEn).toHaveLength(names.length);

  const localeEnUidDesc = foundEn.find((locale) => locale.name === '_state.UID.desc');
  expect(localeEnUidDesc).toBeDefined();
  expect(localeEnUidDesc?.value).toBe('A unique identifier');

  const foundDe = await findLocaleByNames(context, names, 'de');

  expect(foundDe).toBeDefined();
  expect(foundDe).toHaveLength(names.length);

  const localeDeUidDesc = foundDe.find((locale) => locale.name === '_state.UID.desc');
  expect(localeDeUidDesc).toBeDefined();
  expect(localeDeUidDesc?.value).toBe('Ein eindeutiger Bezeichner');
});
