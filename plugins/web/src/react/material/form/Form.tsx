import React from 'react';
import { withTheme } from '@rjsf/core';
import type { ValidatorType, RJSFSchema } from '@rjsf/utils';
import { Theme } from '@rjsf/mui';
import validatorAjv8 from '@rjsf/validator-ajv8';
import { noop, type SchemaObject } from '@amnis/state';

const RJSFForm = withTheme(Theme);

export interface FormProps<T = any> {
  schema: SchemaObject;
  data: T;
  onChange?: (data: T) => void;
}

export const Form = <T = any>({
  schema,
  data,
  onChange = noop,
}: FormProps<T>) => {
  const [formData, setFormData] = React.useState<typeof data>(data);

  return (<RJSFForm
    schema={schema as RJSFSchema}
    validator={(validatorAjv8 as any as ValidatorType<any, RJSFSchema, any>)}
  />);
};

export default Form;
