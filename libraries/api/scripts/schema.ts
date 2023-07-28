import path from 'node:path';
import { createGenerator } from 'ts-json-schema-generator';
import fse from 'fs-extra';
import { globSync } from 'glob';

const typeSchemaFiles = globSync('./src/**/*.tyma.ts', {
  nodir: true,
  ignore: './**/node_modules/**',
});

typeSchemaFiles.forEach((filePath) => {
  const dir = path.dirname(filePath);
  const prefix = path.basename(filePath).split('.')[0];
  const schema = createGenerator({
    schemaId: prefix,
    path: filePath,
    tsconfig: 'scripts/tsconfig.json',
    type: '*',
  }).createSchema('*');
  fse.writeJSONSync(`${dir}/${prefix}.schema.json`, schema, { spaces: 2 });
});
