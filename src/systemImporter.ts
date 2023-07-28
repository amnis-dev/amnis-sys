import type { IoProcessDefinition } from '@amnis/state';
import type { SchemaObject, AmnisSys } from './types.js';

async function importer<T>(paths: string[]): Promise<Record<string, T>> {
  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const exports = await import(path) as Record<string, T>;
        delete exports.default;
        return exports;
      } catch (error) {
        return {};
      }
    }),
  );

  const merged = results.reduce(
    (acc, result) => ({
      ...acc,
      ...result,
    }),
    {},
  );

  return merged;
}

/**
 * Imports parts of an amnis system if available.
 *
 * @example ```ts
 * const system = await systemImporter([
 *  '@amnis/state',
 *  '@amnis/api',
 * ]);
 */
export async function systemImporter(imports: string[]) {
  const system: AmnisSys = {
    schemas: [],
    processes: {},
  };

  const schemaPaths = imports.map((path) => `${path}/schema`);
  const schemas = await importer<SchemaObject>(schemaPaths);
  if (schemas) {
    system.schemas = Object.values(schemas);
  }

  const processPaths = imports.map((path) => `${path}/process`);
  const processes = await importer<IoProcessDefinition>(processPaths);
  if (processes) {
    system.processes = processes;
  }

  return system;
}

export default systemImporter;
