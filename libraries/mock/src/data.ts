import type {
  Entity, Handle, System, User, Credential, Agent, Profile, Contact,
} from '@amnis/state';
import {
  agentSlice,
  agentLocalGenerate,
  credentialSlice,
  cryptoWeb,
  handleSlice,
  userSlice,
  profileSlice,
  contactSlice,
  stateEntitiesCreate,
} from '@amnis/state';

export type MockData = {
  agent: Agent[];
  user: Entity<User>[];
  handle: Entity<Handle>[];
  contact: Entity<Contact>[];
  profile: Entity<Profile>[];
  credential: Entity<Credential>[];
};

export async function mockData(system: System) {
  const {
    $adminRole, $execRole, $initialRoles, $anonymousRole,
  } = system;
  const password = 'password';

  const agent: Agent[] = [
    {
      ...agentSlice.create(await agentLocalGenerate('Administrator Mock Agent')),
      type: 'mock',
    },
    {
      ...agentSlice.create(await agentLocalGenerate('Executive Mock Agent')),
      type: 'mock',
    },
    {
      ...agentSlice.create(await agentLocalGenerate('User Mock Agent')),
      type: 'mock',
    },
  ];

  const user: Entity<User>[] = [
    userSlice.createEntity({
      handle: 'adminMock',
      password: await cryptoWeb.passHash(password),
      email: 'admin@localhost',
      _emailVerified: true,
      $roles: [$adminRole, $anonymousRole],
      $permits: [],
    }),
    userSlice.createEntity({
      handle: 'execMock',
      password: await cryptoWeb.passHash(password),
      email: 'exec@localhost',
      _emailVerified: true,
      $roles: [$execRole, $anonymousRole],
      $permits: [],
    }),
    userSlice.createEntity({
      handle: 'userMock',
      password: await cryptoWeb.passHash(password),
      email: 'user@localhost',
      _emailVerified: true,
      $roles: $initialRoles,
      $permits: [],
    }),
  ];

  const handle: Entity<Handle>[] = [
    handleSlice.createEntity({
      name: user[0].handle,
      $subject: user[0].$id,
    }),
    handleSlice.createEntity({
      name: user[1].handle,
      $subject: user[1].$id,
    }),
    handleSlice.createEntity({
      name: user[2].handle,
      $subject: user[2].$id,
    }),
  ];

  const contact: Entity<Contact>[] = [
    contactSlice.createEntity({
      name: 'Contact',
    }),
    contactSlice.createEntity({
      name: 'Contact',
    }),
    contactSlice.createEntity({
      name: 'Contact',
    }),
  ];

  const profile: Entity<Profile>[] = [
    profileSlice.createEntity({
      nameDisplay: 'Administrator (Mocked)',
      $_user: user[0].$id,
      $_contact: contact[0].$id,
    }),
    profileSlice.createEntity({
      nameDisplay: 'Executive (Mocked)',
      $_user: user[1].$id,
      $_contact: contact[1].$id,
    }),
    profileSlice.createEntity({
      nameDisplay: 'User (Mocked)',
      $_user: user[2].$id,
      $_contact: contact[2].$id,
    }),
  ];

  const credential: Entity<Credential>[] = [
    credentialSlice.createEntity(
      {
        name: agent[0].name,
        publicKey: agent[0].publicKey,
      },
      { $owner: user[0].$id },
    ),
    credentialSlice.createEntity(
      {
        name: agent[1].name,
        publicKey: agent[1].publicKey,
      },
      { $owner: user[1].$id },
    ),
    credentialSlice.createEntity(
      {
        name: agent[2].name,
        publicKey: agent[2].publicKey,
      },
      { $owner: user[2].$id },
    ),
  ];

  agent[0].$credential = credential[0].$id;
  agent[1].$credential = credential[1].$id;
  agent[2].$credential = credential[2].$id;
  user[0].$credentials = [credential[0].$id];
  user[1].$credentials = [credential[1].$id];
  user[2].$credentials = [credential[2].$id];

  return {
    agent,
    ...stateEntitiesCreate({
      user,
      handle,
      contact,
      profile,
      credential,
    }, { committed: true, new: false }),
  };
}

export default mockData;
