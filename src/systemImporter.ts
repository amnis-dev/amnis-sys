import type { IoProcessDefinition } from '@amnis/state';
import { AmnisSysModule } from './types.js';
import type { SchemaObject, AmnisSys, AmnisSet } from './types.js';

async function importerNamed<T>(paths: string[], name: string): Promise<T[]> {
  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const exports = await import(path) as Record<string, T>;
        return exports[name];
      } catch (error) {
        return undefined;
      }
    }),
  );

  const returnResult = results.filter((result) => result !== undefined) as T[];

  return returnResult;
}

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

export interface SystemImporterOptions {
  /**
   * Modules to import from the packages.
   */
  modules?: AmnisSysModule;
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
export async function systemImporter(imports: string[], options: SystemImporterOptions = {}) {
  const { modules } = {
    modules: AmnisSysModule.Set | AmnisSysModule.Schema | AmnisSysModule.Process,
    ...options,
  };

  const system: AmnisSys = {
    sets: [],
    schemas: [],
    processes: {},
  };

  if (modules & AmnisSysModule.Set) {
    const setPaths = imports.map((path) => `${path}/set`);
    const sets = await importerNamed<AmnisSet>(setPaths, 'set');
    if (sets) {
      system.sets = sets;
    }
  }

  if (modules & AmnisSysModule.Schema) {
    const schemaPaths = imports.map((path) => `${path}/schema`);
    const schemas = await importer<SchemaObject>(schemaPaths);
    if (schemas) {
      system.schemas = Object.values(schemas);
    }
  }

  if (modules & AmnisSysModule.Process) {
    const processPaths = imports.map((path) => `${path}/process`);
    const processes = await importer<IoProcessDefinition>(processPaths);
    if (processes) {
      system.processes = processes;
    }
  }

  return system;
}

export default systemImporter;
