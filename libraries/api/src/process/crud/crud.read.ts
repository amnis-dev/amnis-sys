/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Io,
  IoInput,
  IoOutput,
  IoProcess,
  EntityObjects,
  DataQuery,
} from '@amnis/state';
import {
  GrantTask,
  stateMerge,
  stateReferenceQuery,
} from '@amnis/state';
import { mwAccess, mwValidate, mwState } from '../../mw/index.js';

export const process: IoProcess<
Io<DataQuery, EntityObjects>
> = (context) => (
  async (input, output) => {
    const { database } = context;
    const { body: dataQuery, scope, access } = input;

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

    /**
     * Loop through each query slice.
     * Each slice has it's own depth, so recursively search when necessary.
     */
    const results = await Promise.all<EntityObjects>(Object.keys(dataQuery).map(async (key) => {
      const depth = dataQuery[key].$depth ?? 0;

      /**
       * Query the single slice.
       */
      const dataQuerySingle = {
        [key]: dataQuery[key],
      };
      const result = await database.read(dataQuerySingle, { subject: access.sub, scope });

      /**
       * Return without recurrsion if we've reached the bottom.
       */
      if (depth < 1) {
        return result;
      }

      /**
       * Create a new query based on the references in the results.
       */
      const dataQueryNext = stateReferenceQuery(result);
      Object.values(dataQueryNext).forEach((query) => { query.$depth = depth - 1; });
      const inputNext: IoInput<DataQuery> = {
        ...input,
        body: dataQueryNext,
      };

      /**
       * Call this process again with the state middleware.
       */
      const outputNext = await mwState(GrantTask.Read)(
        process,
      )(context)(inputNext, output) as IoOutput<EntityObjects>;

      const resultsMerged = stateMerge(result, outputNext.json.result ?? {});

      return resultsMerged;
    }));

    /**
     * Merge all the results.
     */
    output.json.result = results.reduce<EntityObjects>(
      (acc, cur) => stateMerge(acc, cur),
      {},
    );

    return output;
  }
);

export const processCrudRead = mwAccess()(
  mwValidate('state/DataQuery')(
    mwState(GrantTask.Read)(
      process,
    ),
  ),
) as IoProcess<
Io<DataQuery, EntityObjects>
>;

export default { processCrudRead };
