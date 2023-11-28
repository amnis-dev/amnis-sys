import path from 'path';
import { createGenerator } from 'ts-json-schema-generator';
import fse from 'fs-extra';
import { glob } from 'glob';
import type { SchemaObject } from 'ajv';

const args = process.argv.slice(2);
const [filePath = '.'] = args;

const typeSchemaFiles = glob.sync(`${filePath}/**/*.tyma.ts`, {
  nodir: true,
  ignore: [
    './**/node_modules/**',
    './.github/**',
    './.storybook/**',
    './.vscode/**',
    './**/dist/**',
    './**/types/**',
    './public/**',
    './res/**',
    './scripts/**',
    './websites/**',
  ],
});

type LocaleRecords = Record<string, Record<string, string>>;

/**
 * Fixes a JSON object to be parsed by JSON.parse().
 *
 * Ensures that all keys are double quoted and that all values are not single quoted.
 *
 * @param json JSON object to fix.
 * @returns Fixed JSON object.
 */
function fixJSON(json: string) {
  return json
    .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/(?:\r\n|\r|\n)/g, ' ');
}

/**
 * Assignes titles and descriptions to schema objects.
 */
function defineTitlesAndDescriptions(prefix: string, name: string, schema: SchemaObject) {
  const locale: LocaleRecords = {};
  const prefixKey = `_${prefix}.${name}`;
  const titleKey = `${prefixKey}.title`;
  const descriptionKey = `${prefixKey}.desc`;

  if (!name.startsWith('DataUpdate')) {
    if (schema?.title?.startsWith('{')) {
      try {
        const titleLocale = JSON.parse(fixJSON(schema.title)) as Record<string, string>;
        Object.keys(titleLocale).forEach((key) => {
          const value = titleLocale[key] || '';
          locale[key] = { ...locale[key], [titleKey]: value };
        });
      } catch (error: any) {
        console.error('[ERROR]: SCHEMA LOCALE GENERATION');
        console.error(name);
        console.error(schema.title);
        console.error(error.message);
        process.exit(1);
      }
    } else {
      locale.en = { ...locale.en, [titleKey]: schema.title || '' };
    }

    if (schema?.description?.startsWith('{')) {
      try {
        const descriptionLocale = JSON.parse(fixJSON(schema.description));
        Object.keys(descriptionLocale).forEach((key) => {
          const value = descriptionLocale[key] || '';
          locale[key] = { ...locale[key], [descriptionKey]: value };
        });
      } catch (error: any) {
        console.error('[ERROR]: SCHEMA LOCALE GENERATION');
        console.error(name);
        console.error(schema.description);
        console.error(error.message);
        process.exit(1);
      }
    } else {
      locale.en = { ...locale.en, [descriptionKey]: schema.description || '' };
    }
  }

  schema.title = `%${titleKey}`;
  schema.description = `%${descriptionKey}`;
  if (schema.type === 'object' && schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      const subname = `${name}.${key}`;
      const property = { ...schema.properties[key] };

      const [nextSchema, nextLocale] = defineTitlesAndDescriptions(prefix, subname, property);
      schema.properties[key] = nextSchema;

      /**
       * Merge locale records.
       */
      Object.keys(nextLocale).forEach((i) => {
        if (!locale[i]) {
          locale[i] = {};
        }

        locale[i] = {
          ...locale[i],
          ...nextLocale[i],
        };
      });
    });
  }

  return [schema, locale];
}

typeSchemaFiles.forEach((filePath) => {
  try {
    const dir = path.dirname(filePath);
    const prefix = path.basename(filePath).split('.')[0];
    const schema = createGenerator({
      schemaId: prefix,
      path: filePath,
      tsconfig: 'scripts/tsconfig.genschema.json',
      type: '*',
    }).createSchema('*') as any;

    const definitionKeys = Object.keys(
      schema.definitions || {},
    ) || [];
    const locale: LocaleRecords = {};
    definitionKeys.forEach((key) => {
      const definition: SchemaObject = { ...schema.definitions[key] };
      const [nextSchema, nextLocale] = defineTitlesAndDescriptions(prefix, key, definition);
      schema.definitions[key] = nextSchema;
      Object.keys(nextLocale).forEach((i) => {
        if (!locale[i]) {
          locale[i] = {};
        }

        locale[i] = {
          ...locale[i],
          ...nextLocale[i],
        };
      });
    });

    fse.writeJSONSync(`${dir}/${prefix}.schema.json`, schema, { spaces: 2 });

    const localePath = path.resolve(dir, '../locale');
    if (fse.existsSync(localePath)) {
      Object.keys(locale).forEach((key) => {
        const localeFile = `${localePath}/locale.${key}.json`;
        const localeGenFile = `${localePath}/locale.${key}.gen.json`;
        const prevLocale = fse.readJSONSync(localeFile, { throws: false }) || {};
        fse.writeJSONSync(localeGenFile, { ...locale[key], ...prevLocale }, { spaces: 2 });
      });
    }
  } catch (error: any) {
    console.error(error.message.slice(0, 255));
  }
});
