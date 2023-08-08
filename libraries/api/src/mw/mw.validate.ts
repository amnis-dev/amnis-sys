import { type IoMiddleware } from '@amnis/state';
import { validate } from '@amnis/state/context';

/**
 * Middleware that validates the input body with the context validator.
 */
export const mwValidate: IoMiddleware<string> = (
  (validatorKey) => (next) => (context) => async (input, output) => {
    const { language } = input;
    const { validators } = context;
    /**
     * Validate the body.
     */
    const validateOutput = validate(validators[validatorKey], input.body ?? {});
    if (validateOutput) {
      return validateOutput;
    }

    /**
     * Ensure the language header is set and set to a proper code.
     */
    if (!language || typeof language !== 'string') {
      output.json.logs.push({
        level: 'error',
        title: 'Language Missing',
        description: 'The language header is missing.',
      });
      return output;
    }
    if (/^[a-z]{2}(?:-[a-z]{2})?$/.test(language) === false) {
      output.json.logs.push({
        level: 'error',
        title: 'Language Invalid',
        description: 'The language header is invalid.',
      });
      return output;
    }

    return next(context)(input, output);
  }
);

export default { mwValidate };
