import type { IoMiddleware } from '@amnis/state';
import {
  base64JsonDecode,
} from '@amnis/state';
import { otpValidate } from '../utility/otp.js';

/**
 * Ensures an OTP object is valid and set.
 */
export const mwOtp: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { otpEncoded } = input;

  if (!otpEncoded) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Missing One-Time Password',
      description: 'A one-time password (OTP) is required to complete the request.',
    });
    return output;
  }

  /**
   * Decode the challenge.
   */
  input.otp = base64JsonDecode(otpEncoded);
  const { otp } = input;

  if (!otp) {
    output.status = 500; // 500 Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Invaid One-Time Password',
      description: 'Failed to decode and parse the one-time password (OTP).',
    });
    return output;
  }

  const outputValid = await otpValidate(context, otp);

  if (outputValid !== true) {
    return outputValid;
  }

  // output.json.logs.push({
  //   level: 'info',
  //   title: 'One-Time Password Validated',
  //   description: 'The provided one-time password (OTP) value is valid.',
  // });

  return next(context)(input, output);
};

export default { mwOtp };
