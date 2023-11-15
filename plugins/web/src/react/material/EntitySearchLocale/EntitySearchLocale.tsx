import React from 'react';
import type { SelectChangeEvent, Theme } from '@mui/material';
import {
  Box,
  Card,
  CardActionArea,
  Divider,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import type { Entity, Locale } from '@amnis/state';
import { localeSlice, noop, systemSlice } from '@amnis/state';
import { apiCrud } from '@amnis/api';
import { Add } from '@mui/icons-material';
import { useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
import { SearchInput, Skele, Text } from '@amnis/web/react/material';

export interface EntitySearchLocaleProps {
  /**
   * On select callback.
   */
  onSelect?: (entity: Entity<Locale>) => void;
}

export const EntitySearchLocale: React.FC<EntitySearchLocaleProps> = ({
  onSelect = noop,
}) => {
  const localeMax = React.useRef(25);

  const dispatch = useWebDispatch();

  const system = useWebSelector(systemSlice.select.active);

  const localeCodeActive = useWebSelector(localeSlice.select.activeCode);

  const localeCodes = React.useMemo<string[]>(
    () => system?.languages ?? [],
    [system],
  );

  const localeCodeDefault = React.useMemo<string>(
    () => localeCodeActive ?? 'en',
    [localeCodeActive],
  );

  const [
    localeCodeSelected,
    localeCodeSelectedSet,
  ] = React.useState<string>(localeCodeDefault);

  const [searchText, searchTextSet] = React.useState('');

  const localeEntities = useWebSelector(
    (state) => localeSlice.select.byCode(state, localeCodeSelected)
      .filter(
        ({ value }) => (
          searchText.length ? value.toLowerCase().includes(searchText.toLowerCase()) : true
        ),
      ),
  ).slice(0, localeMax.current);

  const [loadingEntities, loadingEntitiesSet] = React.useState(false);

  /**
   * Memo a rendered component for selecting a locale code.
   */
  const LocaleCodeSelect = React.useMemo(
    () => (
      <FormControl size='small'>
        <Select
          value={localeCodeSelected}
          variant='outlined'
          onChange={
            (event: SelectChangeEvent) => localeCodeSelectedSet(event.target.value as string)
          }
        >
          {localeCodes.map((localeCode) => (
            <MenuItem key={localeCode} value={localeCode}>
              {localeCode.toLocaleUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    [localeCodeSelected, localeCodes],
  );

  /**
   * Memo a rendered component for an icon button that can be pressed to create new entities.
   */
  const LocaleCreateButton = React.useMemo(
    () => (
      <IconButton color="primary">
        <Add />
      </IconButton>
    ),
    [],
  );

  const triggerSearch = React.useCallback(async (includeText: string) => {
    loadingEntitiesSet(true);
    await dispatch(apiCrud.endpoints.read.initiate({
      [localeSlice.key]: {
        $query: {
          code: {
            $eq: localeCodeSelected,
          },
          value: {
            $inc: includeText,
          },
        },

      },
    }));
    loadingEntitiesSet(false);
  }, [loadingEntitiesSet, localeCodeSelected, localeMax]);

  /**
   * Fetch locale records on mount.
   */
  React.useEffect(() => {
    if (localeEntities.length < localeMax.current) {
      triggerSearch(searchText);
    }
  }, [localeCodeSelected, searchText, localeEntities.length, localeMax.current]);

  React.useEffect(() => {
    triggerSearch(searchText);
  }, [localeCodeActive]);

  const handleSearch = React.useCallback((value: string) => {
    searchTextSet(value);
  }, [searchTextSet]);

  return (
    <Stack gap={1} sx={{ height: '100%' }}>
      <Box>
        <SearchInput
          leftComponent={LocaleCodeSelect}
          rightComponent={LocaleCreateButton}
          onChangeDebounced={handleSearch}
          onChangeDebouncedTimeout={500}
        />
      </Box>
      <Box flex={1} sx={{ overflow: 'scroll' }}>
        <Stack gap={1}>
          {<LinearProgress sx={{ opacity: loadingEntities ? 1 : 0 }} />}
          {(localeEntities.length === 0 && loadingEntities) ? (<Skele variant="card-list" />) : null}
          {localeEntities.map((entity) => (
            <Card
              key={entity.$id}
              sx={(t: Theme) => ({
                borderWidth: '2px',
                borderColor: t.palette.divider,
                borderStyle: 'solid',
              })}
            >
              <CardActionArea
                onClick={() => onSelect(entity)}
              >
                <Box p={1} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
                  <span style={{ opacity: 0.5 }}>%</span>
                  <Text component="span" variant="body2" sx={{ opacity: 0.85 }}>
                    {entity.name}
                  </Text>
                </Box>
                <Divider orientation="horizontal" flexItem />
                <Box flex={1} p={1}>
                  <Text variant="body1" noSkeleton={!loadingEntities}>{entity.value.length ? entity.value : ''}</Text>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default EntitySearchLocale;
