import React from 'react';
import {
  Box, ButtonBase, Card, Divider, Stack,
} from '@mui/material';
import { localeSlice, systemSlice } from '@amnis/state';
import { apiCrud } from '@amnis/api';
import { useWebDispatch, useWebSelector } from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';

export const PanelLocalization: React.FC = () => {
  const localeMax = React.useRef(25);

  const dispatch = useWebDispatch();

  const system = useWebSelector(systemSlice.select.active);

  const [localeCodeDefault, localeCodeOthers] = React.useMemo<[string, string[]]>(() => [
    system?.languages?.[0] ?? 'en',
    system?.languages?.slice(1) ?? [],
  ], [system]);

  const [
    localeCodeSelected,
    localeCodeSelectedSet,
  ] = React.useState<string | undefined>(localeCodeOthers[0]);

  const localeDefault = useWebSelector(
    (state) => localeSlice.select.byCode(state, localeCodeDefault),
  ).slice(0, localeMax.current);

  const localeDefaultNames = React.useMemo(
    () => localeDefault.map(({ name }) => name),
    [localeDefault],
  );

  const localeOther = useWebSelector(
    (state) => {
      const locales = localeSlice.select.byCode(state, localeCodeSelected ?? '');
      return locales.filter(({ name }) => localeDefaultNames.includes(name));
    },
  ).slice(0, localeMax.current);

  const [loadingDefault, loadingDefaultSet] = React.useState(false);
  const [loadingOther, loadingOtherSet] = React.useState(false);

  /**
   * Fetch locale records on mount.
   */
  React.useEffect(() => {
    if (localeDefault.length < localeMax.current) {
      loadingDefaultSet(true);
      (async () => {
      /**
       * Get default locale.
       */
        await dispatch(apiCrud.endpoints.read.initiate({
          [localeSlice.key]: {
            $query: {
              code: {
                $eq: localeCodeDefault,
              },
            },
            $range: {
              start: 0,
              limit: localeMax.current,
            },
          },
        }));
        loadingDefaultSet(false);
      })();
    }

    if (localeOther.length < localeMax.current) {
      loadingOtherSet(true);

      (async () => {
        /**
         * Get other locale.
         */
        await dispatch(apiCrud.endpoints.read.initiate({
          [localeSlice.key]: {
            $query: {
              code: {
                $eq: localeCodeSelected,
              },
              name: {
                $in: localeDefaultNames,
              },
            },
            $range: {
              start: 0,
              limit: localeMax.current,
            },
          },
        }));

        loadingOtherSet(false);
      })();
    }
  }, [localeDefault.length, localeOther.length]);

  /**
   * A memo that returns an array of tuples of the default
   * locale with the other locale that has the same name.
   */
  const localeMatches = React.useMemo<
  [typeof localeDefault[0], typeof localeOther[0] | undefined][]
  >(
    () => localeDefault.map((defaultLocale) => {
      const otherLocale = localeOther.find(({ name }) => name === defaultLocale.name);
      return [defaultLocale, otherLocale];
    }),
    [localeDefault, localeOther],
  );

  return (
    <Stack gap={1} sx={{ height: '100%' }}>
      <Box>
        <Card>
          <Stack direction="row">
            <Box flex={1} p={1} sx={{ textAlign: 'center' }}>
              <Text variant="body2">{localeCodeDefault.toLocaleUpperCase()}</Text>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box flex={1} p={1} sx={{ textAlign: 'center' }}>
              <Text variant="body2">{localeCodeSelected?.toLocaleUpperCase()}</Text>
            </Box>
          </Stack>
        </Card>
      </Box>
      <Box flex={1} sx={{ overflow: 'scroll' }}>
        <Stack gap={1}>
          {localeMatches.map(([d, o]) => (
            <Card key={d.$id} square>
              <Divider />
              <Box p={1}>
                <Text>{d.name}</Text>
              </Box>
              <Divider orientation="horizontal" flexItem />
              <Stack direction="row">
                <Box flex={1}>
                  <ButtonBase sx={{
                    p: 1,
                    width: '100%',
                    height: '100%',
                    textAlign: 'left',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}>
                    <Text variant="body2" noSkeleton={loadingDefault}>{d.value.length ? d.value : ''}</Text>
                  </ButtonBase>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box flex={1}>
                  <ButtonBase sx={{
                    p: 1,
                    width: '100%',
                    height: '100%',
                    textAlign: 'left',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}>
                    <Text variant="body2" noSkeleton={loadingOther}>{o?.value?.length ? o.value : ''}</Text>
                  </ButtonBase>
                </Box>
              </Stack>
              <Divider />
            </Card>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default PanelLocalization;
