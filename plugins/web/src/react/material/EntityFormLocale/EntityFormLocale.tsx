import React from 'react';
import {
  Box, Button, CircularProgress, Stack, Typography,
} from '@mui/material';
import { systemSlice, localeSlice } from '@amnis/state';
import type { Entity, Locale, UID } from '@amnis/state';
import { Add } from '@mui/icons-material';
import {
  useCrudRead,
  useEntity,
  useWebDispatch,
  useWebSelector,
} from '@amnis/web/react/hooks';
import { Entry, Text } from '@amnis/web/react/material';

export interface EntityFormLocaleProps {
  /**
   * Identifier of the locale entity.
   */
  $id?: UID;
}

export const EntityFormLocale: React.FC<EntityFormLocaleProps> = ({
  $id,
}) => {
  const dispatch = useWebDispatch();
  const { crudRead, crudReadPending } = useCrudRead();

  const system = useWebSelector(systemSlice.select.active);
  const localePrimary = useEntity<Entity<Locale>>($id);
  const localeAll = useWebSelector(localeSlice.select.all);

  const localies = React.useMemo<Record<string, Entity<Locale>>>(() => {
    if (!localePrimary?.name) {
      return {};
    }

    const records = localeAll.filter(({ name }) => name === localePrimary.name);
    return records.reduce((acc, record) => {
      acc[record.code] = record;
      return acc;
    }, {} as Record<string, Entity<Locale>>);
  }, [localePrimary?.name, localeAll]);
  const languages = React.useMemo<string[]>(() => system?.languages ?? [], [system?.languages]);

  /**
   * Fetch all locales for the current localeId
   */
  React.useEffect(() => {
    if (!system || !localePrimary) {
      return;
    }

    crudRead({
      [localeSlice.key]: {
        $query: {
          code: {
            $in: languages,
          },
          name: {
            $eq: localePrimary.name,
          },
        },
      },
    });
  }, [system?.$id, localePrimary?.$id, languages]);

  /**
   * Handler for create a new locale record for a specific language.
   */
  const handleCreate = React.useCallback((code: string) => {
    if (!localePrimary?.name) {
      return;
    }

    dispatch(localeSlice.action.create({
      name: localePrimary.name,
      value: '',
      code,
    }));
  }, [localePrimary?.name]);

  return crudReadPending ? (
    <CircularProgress />
  ) : (
    <Box>
      <Stack gap={2}>
        <Typography variant="h6">
          <span style={{ opacity: 0.5 }}>%</span>
          <Text variant="span">{localePrimary?.name}</Text>
        </Typography>
        {languages.map((language) => {
          const locale = localies[language];
          if (!locale) {
            return (
              <Button
                startIcon={<Add />}
                key={language}
                variant="contained"
                onClick={() => handleCreate(language)}
              >
                {`${language.toUpperCase()}`}
              </Button>
            );
          }

          return <Entry
            key={language}
            label={language.toUpperCase()}
            value={locale.value}
            onChange={(next) => {
              dispatch(localeSlice.action.update({
                ...locale,
                value: next,
              }));
            }}
            required
            multiline={4}
          />;
        })}
      </Stack>
    </Box>
  );
};

export default EntityFormLocale;
