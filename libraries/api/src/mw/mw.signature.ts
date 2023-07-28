import type { IoMiddleware } from '@amnis/state';
import {
  base64Decode,
} from '@amnis/state';

/**
 * Ensures a valid signature.
 * Must be used AFTER mwSession and mwAccess!
 */
export const mwSignature: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { signatureEncoded, credential } = input;

  if (!signatureEncoded || typeof signatureEncoded !== 'string') {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'A cryptographic signature is required to complete this request.',
    });
    return output;
  }

  if (!credential) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'A valid credential is required to sign this request.',
    });
    return output;
  }

  /**
   * Decode the signature.
   */
  input.signature = base64Decode(signatureEncoded).buffer;

  /**
   * Get the public key. to verify the signature.
   */
  const publicKey = await context.crypto.keyImport(credential.publicKey);

  if (!publicKey) {
    output.status = 500; // 500 Internal Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Invalid Key',
      description: 'There was a problem importing the authorized public key.',
    });
    return output;
  }

  /**
   * Verify the signature.
   */
  const verified = await context.crypto.asymVerify(
    JSON.stringify(input.body),
    input.signature,
    publicKey,
  );

  if (!verified) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invalid Signature',
      description: 'Provided signature could not be verified.',
    });
    return output;
  }

  // output.json.logs.push({
  //   level: 'info',
  //   title: 'Signature Validated',
  //   description: 'The provided signature matched the authenticated client.',
  // });

  return next(context)(input, output);
};

export default { mwSignature };
