import type {
  IoContext,
  IoInput,
} from '@amnis/state';
import {
  ioOutput,
  challengeSlice,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import type { ApiAuthChallenge } from '../../api.auth.types.js';
import { schemaAuth } from '../../schema/index.js';
import { processAuthChallenge } from './auth.challenge.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth],
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity', async () => {
  const input: IoInput<ApiAuthChallenge> = {
    body: {},
    query: {},
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSlice.select.byId(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
});
