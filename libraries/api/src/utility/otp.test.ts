import type {
  DateNumeric,
  Entity,
  IoContext,
  Otp,
  System,
  User,
} from '@amnis/state';
import {
  userSlice,
  otpSlice,
  databaseMemoryStorage,
  dateNumeric,
  OtpMethod,
  emailerboxStorage,
  uid,
  systemSlice,
} from '@amnis/state';
import { contextSetup } from '@amnis/state/context';
import { schemaAuth } from '../../schema/index.js';
import { otpNew, otpPasswordCreate, otpValidate } from './otp.js';

let context: IoContext;
let system: System;
let otpValid: Otp;
let otpExpired: Otp;
let userUser: Entity<User>;

const $subject = uid('subject');

beforeAll(async () => {
  context = await contextSetup({
    schemas: [schemaAuth],
  });
  system = systemSlice.select.active(context.store.getState()) as System;
  otpValid = otpSlice.create({
    $sub: $subject,
    val: await otpPasswordCreate(context),
    exp: dateNumeric('5m'),
    mth: OtpMethod.Email,
  });
  otpExpired = otpSlice.create({
    $sub: $subject,
    val: await otpPasswordCreate(context),
    exp: 0 as DateNumeric,
    mth: OtpMethod.Email,
  });

  context.store.dispatch(otpSlice.action.insert(otpValid));
  context.store.dispatch(otpSlice.action.insert(otpExpired));

  const storage = databaseMemoryStorage();
  const storageUsers = Object.values(storage[userSlice.key]) as Entity<User>[];

  userUser = storageUsers.find((u) => u.handle === 'user') as Entity<User>;
});

test('should successfully validate a valid OTP', async () => {
  const output = await otpValidate(context, otpValid);

  expect(output).toBe(true);

  /**
   * Should no longer find the OTP object in the context store.
   */
  const otp = otpSlice.select.byId(
    context.store.getState(),
    otpValid.$id,
  );
  expect(otp).toBeUndefined();
});

test('should fail validate a valid OTP a second time', async () => {
  const output = await otpValidate(context, otpValid);

  if (output === true) {
    expect(output).not.toBe(true);
    return;
  }

  expect(output.status).toBe(401);
});

test('should fail to validate an expired OTP', async () => {
  const output = await otpValidate(context, otpExpired);

  if (output === true) {
    expect(output).not.toBe(true);
    return;
  }

  expect(output.status).toBe(401);

  /**
   * Should not find the expired OTP object in the context store.
   */
  const otp = otpSlice.select.byId(
    context.store.getState(),
    otpExpired.$id,
  );
  expect(otp).toBeUndefined();
});

test('should fail to validate an incorrect OTP value', async () => {
  context.store.dispatch(otpSlice.action.insert(otpValid));
  const otpInvalidVal = {
    ...otpValid,
    val: await otpPasswordCreate(context),
  };

  const output = await otpValidate(context, otpInvalidVal);

  if (output === true) {
    expect(output).not.toBe(true);
    return;
  }

  expect(output.status).toBe(401);

  /**
   * Should not find the valid OTP object in the context store anymore.
   */
  const otp = otpSlice.select.byId(
    context.store.getState(),
    otpValid.$id,
  );
  expect(otp).toBeUndefined();
});

test('should create a new OTP and validate against it', async () => {
  const outputOtpNew = await otpNew(
    context,
    {
      $subject: userUser.$id,
    },
  );

  const otpNewObject = outputOtpNew.json.result;

  if (!otpNewObject) {
    expect(otpNewObject).toBeDefined();
    return;
  }

  expect(Object.keys(otpNewObject)).toHaveLength(5);
  expect(otpNewObject).toMatchObject({
    $id: expect.any(String),
    $sub: userUser.$id,
    len: system.otpLength,
    exp: expect.any(Number),
    mth: OtpMethod.Email,
  });
  expect(otpNewObject.val).toBeUndefined();

  /**
   * Get the OTP value from the memory mailbox.
   */
  const mailbox = emailerboxStorage();
  const message = mailbox[userUser.email as string][0];
  const messageOtp = message.body.match(/one-time passcode is (\w+)/m)?.[1];

  if (!messageOtp) {
    expect(messageOtp).toBeDefined();
    return;
  }

  expect(messageOtp.length).toBe(system.otpLength);

  const otpCompete: Otp = {
    ...otpNewObject,
    val: messageOtp,
  };

  const output = await otpValidate(context, otpCompete);
  expect(output).toBe(true);
});
