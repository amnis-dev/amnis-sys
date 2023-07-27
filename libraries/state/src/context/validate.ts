/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SchemaObject, AnyValidateFunction } from 'ajv/dist/types';
import Ajv from 'ajv';
import type { IoOutput, Validator, Validators } from '../io/io.types.js';

/**
 * Common method of validating json that returns an errored output if invalid.
 * Returns an error output if failed.
 */
export function validate(
  validator: Validator | undefined,
  json: Record<string, any>,
): IoOutput | undefined {
  const ajvValidator = validator as AnyValidateFunction;
  if (!ajvValidator) {
    const output: IoOutput = {
      status: 200, // 200 OK
      cookies: {},
      json: {
        logs: [],
        result: undefined,
      },
    };
    output.status = 503; // 503 Service Unavailable
    output.json.logs.push({
      level: 'error',
      title: 'Validator Missing',
      description: 'The service cannot handle the request without validation.',
    });
    return output;
  }
  /**
   * Validate the body.
   */
  ajvValidator(json);

  if (ajvValidator.errors !== undefined && ajvValidator.errors !== null) {
    const output: IoOutput = {
      status: 200, // 200 OK
      cookies: {},
      json: {
        logs: [],
        result: undefined,
      },
    };
    output.status = 400; // 400 Bad Request

    ajvValidator.errors.forEach((verror) => {
      const details = [];
      if (verror.instancePath) {
        details.push(`${verror.instancePath.split('/').slice(-1)[0]}`);
      }
      if (verror.message) {
        details.push(`${verror.message}.`);
      }
      if (verror.params) {
        const paramString = Object.keys(verror.params).map((k) => `${k}: ${verror.params[k]}`).join(', ');
        details.push(`(${paramString})`);
      }
      output.json.logs.push({
        level: 'error',
        title: 'Validation Failed',
        description: details.join(' ') || 'The request is not valid.',
      });
    });
    return output;
  }

  return undefined;
}

function validateCompile(schema: SchemaObject): Validators {
  if (typeof schema === 'boolean') {
    throw new Error('Cannot create validators from a boolean schema');
  }

  const id = schema?.$id;
  if (!id) {
    throw new Error('Schema must have an $id.');
  }

  const definitions = schema?.definitions;

  if (!definitions) {
    throw new Error(`Schema, with id of ${id}, must have definitions to create validators from.`);
  }
  const validatorKeys = Object.keys(definitions);

  /** @ts-ignore */
  const ajv = new Ajv({ schemas: [schema], code: { esm: true } });

  const validators = validatorKeys.reduce<Validators>(
    (record, key) => {
      record[`${id}/${key}`] = ajv.getSchema(`${id}#/definitions/${key}`) as AnyValidateFunction;
      return record;
    },
    {},
  );

  return validators;
}

/**
 * Configures validators from one or more schemas. The validators are created from the definitions
 * object within each schema.
 */
export function validateSetup(schemas: SchemaObject | SchemaObject[]) {
  const validators: Validators = {};

  if (Array.isArray(schemas)) {
    schemas.forEach((schema) => {
      const validatorsNext = validateCompile(schema);
      Object.assign(validators, validatorsNext);
    });
  } else {
    const validatorsNext = validateCompile(schemas);
    Object.assign(validators, validatorsNext);
  }

  return validators;
}

export default validate;
