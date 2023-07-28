/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Io,
  IoProcess,
  DataDeleter,
} from '@amnis/state';
import {
  GrantTask,
} from '@amnis/state';
import { mwAccess, mwValidate, mwState } from '../mw/index.js';

export const process: IoProcess<
Io<DataDeleter, DataDeleter>
> = (context) => (
  async (input, output) => {
    const { database } = context;
    const { body, scope, access } = input;

    if (!access) {
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'No access has not been provided.',
      });
      return output;
    }

    if (!scope) {
      output.status = 500; // Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'Missing Scope',
        description: 'Cannot complete the process without a data scope.',
      });
      return output;
    }

    output.json.result = await database.delete(body, { subject: access.sub, scope });

    return output;
  }
);

export const processCrudDelete = mwAccess()(
  mwValidate('state/DataDeleter')(
    mwState(GrantTask.Delete)(
      process,
    ),
  ),
) as IoProcess<
Io<DataDeleter, DataDeleter>
>;

export default { processCrudDelete };
