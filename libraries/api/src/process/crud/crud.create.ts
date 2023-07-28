/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Io,
  IoProcess,
  DataCreator,
  EntityObjects,
} from '@amnis/state';
import {
  GrantTask,
  stateEntitiesCreate,
} from '@amnis/state';
import { mwAccess, mwValidate, mwState } from '../../mw/index.js';

const process: IoProcess<
Io<DataCreator, EntityObjects>
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

    const stateEntities = stateEntitiesCreate(
      body,
      {
        $owner: access.sub,
        $creator: access.sub,
        committed: true,
        new: false,
      },
    );

    const result = await database.create(stateEntities, { subject: access.sub, scope });

    output.json.result = result;

    return output;
  }
);

export const processCrudCreate = mwAccess()(
  mwValidate('state/DataCreator')(
    mwState(GrantTask.Create)(
      process,
    ),
  ),
) as IoProcess<
Io<DataCreator, EntityObjects>
>;

export default { processCrudCreate };
