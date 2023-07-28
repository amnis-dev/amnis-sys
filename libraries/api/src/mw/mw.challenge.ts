import type { IoMiddleware } from '@amnis/state';
import {
  base64JsonDecode,
} from '@amnis/state';
import { challengeValidate } from '../utility/challenge.js';

/**
 * Ensures a challenge object is valid and set.
 */
export const mwChallenge: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { challengeEncoded } = input;

  if (!challengeEncoded) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Missing Challenge',
      description: 'A challenge must be provided to complete this request.',
    });
    return output;
  }

  /**
   * Decode the challenge.
   */
  input.challenge = base64JsonDecode(challengeEncoded);
  const { challenge } = input;

  if (!challenge) {
    output.status = 500; // 500 Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Challenge',
      description: 'Failed to decode and parse the challenge.',
    });
    return output;
  }

  const outputValid = await challengeValidate(context, challenge);

  if (outputValid !== true) {
    return outputValid;
  }

  // output.json.logs.push({
  //   level: 'info',
  //   title: 'Challenge Validated',
  //   description: 'The provided challenge value has successfully validated.',
  // });

  return next(context)(input, output);
};

export default { mwChallenge };
