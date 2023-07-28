import type {
  Challenge,
  DateNumeric,
  IoContext,
} from '@amnis/state';
import {
  challengeCreate,
  dateNumeric,
  challengeSlice,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { schemaAuth } from '../../schema/index.js';
import { challengeValidate } from './challenge.js';

let context: IoContext;
let challengeValid: Challenge;
let challengeExpired: Challenge;

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth],
  });
  challengeValid = challengeSlice.create({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
  });
  challengeExpired = challengeSlice.create({
    val: await context.crypto.randomString(16),
    exp: dateNumeric() - 1000 as DateNumeric,
  });
  context.store.dispatch(challengeSlice.action.insert(challengeValid));
  context.store.dispatch(challengeSlice.action.insert(challengeExpired));
});

test('should successfully validate a valid challenge', async () => {
  const output = challengeValidate(context, challengeValid);

  expect(output).toBe(true);

  /**
   * Should no longer find the challenge entity in the context store.
   */
  const challenge = challengeSlice.select.byId(
    context.store.getState(),
    challengeValid.$id,
  );

  expect(challenge).toBeUndefined();
});

test('should fail to validate an expired challenge', async () => {
  const output = challengeValidate(context, challengeExpired);

  if (output === true) {
    expect(output).not.toBe(true);
    return;
  }
  expect(output.status).toBe(500);
  expect(output.json.logs.length).toBeGreaterThan(0);
  expect(output.json.logs[0].title).toBe('Invalid Challenge');
});

test('should fail to find a non-existing challenge', async () => {
  const challengeNonExisting = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
  });

  const output = challengeValidate(context, challengeNonExisting);

  if (output === true) {
    expect(output).not.toBe(true);
    return;
  }
  expect(output.status).toBe(500);
  expect(output.json.logs.length).toBeGreaterThan(0);
  expect(output.json.logs[0].title).toBe('Invalid Challenge');
});

test('should fail to find an existing challenge with a wrong value', async () => {
  const challengeNonExisting = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
  });

  const challengeWrong = {
    ...challengeValid,
    val: challengeNonExisting.val,
  };

  const output = challengeValidate(context, challengeWrong);

  if (output === true) {
    expect(output).not.toBe(true);
    return;
  }

  expect(output.status).toBe(500);
  expect(output.json.logs.length).toBeGreaterThan(0);
  expect(output.json.logs[0].title).toBe('Invalid Challenge');
});
