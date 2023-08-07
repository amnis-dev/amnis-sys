import path from 'path';
import { createGenerator } from 'ts-json-schema-generator';
import fse from 'fs-extra';
import { glob } from 'glob';

const typeSchemaFiles = glob.sync('./**/*.tyma.ts', {
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

typeSchemaFiles.forEach((filePath) => {
  try {
    const dir = path.dirname(filePath);
    const prefix = path.basename(filePath).split('.')[0];
    const schema = createGenerator({
      schemaId: prefix,
      path: filePath,
      tsconfig: 'scripts/tsconfig.genschema.json',
      type: '*',
    }).createSchema('*');
    fse.writeJSONSync(`${dir}/${prefix}.schema.json`, schema, { spaces: 2 });
  } catch (error: any) {
    console.error(error.message.slice(0, 255));
  }
});
