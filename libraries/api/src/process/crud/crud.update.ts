/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Io,
  IoProcess,
  DataCreator,
  DataUpdater,
} from '@amnis/state';
import {
  GrantTask,
} from '@amnis/state';
import { mwAccess, mwState, mwValidate } from '../mw/index.js';

export const process: IoProcess<
Io<DataUpdater, DataCreator>
> = (context) => (
  async (input, output) => {
    const { database } = context;
    const { body, access, scope } = input;

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

    const result = await database.update(body, { subject: access.sub, scope });

    /**
     * Output the result.
     */
    output.json.result = result;

    return output;
  }
);

export const processCrudUpdate = mwAccess()(
  mwValidate('state/DataUpdater')(
    mwState(GrantTask.Update)(
      process,
    ),
  ),
) as IoProcess<
Io<DataUpdater, DataCreator>
>;

export default processCrudUpdate;
