import { createGenerator } from 'ts-json-schema-generator';
import fse from 'fs-extra';
import path from 'path';
import glob from 'glob';

const typeSchemaFiles = glob.sync('./src/**/*.tyma.ts', {
  nodir: true,
  ignore: './**/node_modules/**',
});

typeSchemaFiles.forEach((filePath) => {
  const dir = path.dirname(filePath);
  const prefix = path.basename(filePath).split('.')[0];
  const schema = createGenerator({
    schemaId: prefix,
    path: filePath,
    tsconfig: 'scripts/tsconfig.schema.json',
    type: '*',
  }).createSchema('*');
  fse.writeJSONSync(`${dir}/${prefix}.schema.json`, schema, { spaces: 2 });
});
