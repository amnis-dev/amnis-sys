import React from 'react';
import type { AutocompleteRenderInputParams } from '@mui/material';
import {
  FormControl,
  Box,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  dataNameKey, stateSelect, titleize,
} from '@amnis/state';
import type { UID, Entity } from '@amnis/state';
import { apiCrud } from '@amnis/api/react';
import type { EntryContextProps } from '@amnis/web/react/context';
import { EntryContext } from '@amnis/web/react/context';
import {
  useTranslate, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';
import type { RootStateWeb } from '@amnis/web';
import { Description, Label } from './parts/index.js';

export const EntryFormatReference: React.FC = () => {
  const {
    label,
    labelHide,
    entryId,
    errored,
    optionsFilter,
    value,
    pattern,
    disabled,
    condensed,
    onChange,
    onSelect,
    onBlur,
  } = React.useContext(EntryContext) as EntryContextProps<string>;

  const dispatch = useWebDispatch();

  const sliceKey = React.useMemo(
    () => pattern?.match(/([A-Za-z0-9]+):/)?.[1] as keyof RootStateWeb | undefined,
    [pattern],
  );

  const entity = useWebSelector((state) => {
    if (!value) return undefined;
    if (!sliceKey) return undefined;
    const slice = state[sliceKey];
    if (!slice) return undefined;
    const entities = (slice as any)?.entities;
    if (!entities) return undefined;

    return entities[value] as Entity;
  });

  const entities = useTranslate(useWebSelector<Record<UID, Entity>>(
    (state) => stateSelect.sliceEntities(state, sliceKey ?? '') as Record<UID, Entity>,
  ))!;

  const [inputValue, inputValueSet] = React.useState('');

  const entityIds = React.useMemo<UID[]>(
    () => Object.keys(entities).filter((id) => !optionsFilter.includes(id)) as UID[],
    [entities, optionsFilter],
  );

  const labelKey = React.useMemo<keyof Entity | undefined>(() => {
    if (entityIds.length === 0) return undefined;
    if (!entities[entityIds[0]]) return undefined;
    return dataNameKey(entities[entityIds[0]]) as keyof Entity;
  }, [entityIds[0]]);

  /**
   * Gets the option label for the autocomplete.
   */
  const getOptionLabel = React.useCallback((option: UID) => {
    if (entities[option] === undefined || !labelKey) return '';
    return entities[option][labelKey];
  }, [entities, labelKey]);

  /**
   * Handles the render input option for the autocomplete.
   */
  const renderInput = React.useCallback(
    (params: AutocompleteRenderInputParams) => <TextField
      {...params}
      placeholder={`+ ${sliceKey ? ` ${titleize(sliceKey)}` : ''}...`}
      label={condensed ? label : undefined}
      InputLabelProps={condensed ? {
        ...params.InputLabelProps,
        shrink: true,
      } : undefined}
      size="small"
    />,
    [label, condensed, sliceKey],
  );

  /**
   * Description sx prop memoized.
   */
  const descriptionSx = React.useMemo(() => ({
    m: 0,
  }), []);

  /**
   * Effect to trigger to API CRUD Read when initializing the entry.
   */
  React.useEffect(() => {
    if (!sliceKey) return;

    if (!entity?.$id && value) {
      dispatch(
        apiCrud.endpoints.read.initiate({
          [sliceKey]: {
            $query: {
              $id: {
                $eq: value,
              },
            },
          },
        }),
      );
    }

    dispatch(
      apiCrud.endpoints.read.initiate({
        [sliceKey]: {
          $query: {},
          $range: {
            limit: 10,
          },
        },
      }),
    );
  }, [sliceKey, value, entity?.$id]);

  /**
   * Handle the change of the Autocomplete.
   */
  const handleChange = React.useCallback((event: any, valueNew: string) => {
    if (!entityIds.includes(valueNew as any)) {
      return;
    }
    onChange(valueNew, event);
    onSelect(valueNew, event);
    onBlur(event);
  }, [onChange, onSelect, onBlur, entityIds]);

  /**
   * Handle the selection of the Autocomplete.
   */
  const handleInputChange = React.useCallback((event: any, valueNew: string) => {
    inputValueSet(valueNew);
  }, []);

  // React.useEffect(() => {
  //   if (!entityIds.includes(value as any)) {
  //     inputValueSet('');
  //   }
  // }, [value, entityIds]);

  // console.log('RERENDER');

  return (
    <FormControl
      id={entryId}
      error={errored}
      disabled={disabled}
      variant="outlined"
      size="small"
      fullWidth
    >
      <Box mb={0.5}>
        {(condensed || labelHide) ? null : <Label />}
        <Description sx={descriptionSx} />
      </Box>
      <Autocomplete
        value={entityIds.includes(value as any) ? value : null}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={entityIds}
        getOptionLabel={getOptionLabel}
        renderInput={renderInput}
      />
    </FormControl>
  );
};

export default EntryFormatReference;
