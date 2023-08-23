import React from 'react';

import type { DataQuery, Locale } from '@amnis/state';
import { localeSlice } from '@amnis/state';
import { apiCrud } from '@amnis/api/react';
import {
  Box, LinearProgress, Stack, Typography,
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { GridColumnMenu, DataGrid } from '@mui/x-data-grid';
import { useWebDispatch, type QueryResult } from '@amnis/web';
import { useLocaleFetch } from './useLocaleFetch.js';

const localeReadQueryBase = (code: string): DataQuery => ({
  [localeSlice.name]: {
    $query: {
      code: {
        $eq: code,
      },
    },
    $range: {
      limit: 64,
    },
    $order: ['name', 'asc'],
  },
});

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Locale Key (%)',
    minWidth: 150,
    flex: 1,
    editable: false,
  },
  {
    field: 'value',
    headerName: 'Base (EN)',
    flex: 1.5,
    minWidth: 250,
    editable: true,
    sortable: false,
  },
  {
    field: 'value2',
    headerName: 'Translation (DE)',
    flex: 1.5,
    minWidth: 325,
    editable: true,
    sortable: false,
  },
];

export const Localization: React.FC = () => {
  const dispatch = useWebDispatch();
  const [localeBaseEntites, localeTransEntitesPre] = useLocaleFetch();

  const localeTransEntites = React.useMemo(
    () => localeTransEntitesPre.reduce<Record<string, Locale>>(
      (acc, curr) => {
        acc[curr.name] = curr;
        return acc;
      },
      {},
    ),
    [localeTransEntitesPre],
  );

  const rows = React.useMemo(() => localeBaseEntites.reduce<{
    id: string,
    $id: string,
    name: string,
    value: string,
    $id2: string | null,
    name2: string | null,
    value2: string | null,
  }[]>((acc, curr) => {
    acc.push({
      id: curr.$id,
      $id: curr.$id,
      name: curr.name,
      value: curr.value,
      $id2: localeTransEntites[curr.name]?.name ?? null,
      name2: localeTransEntites[curr.name]?.name ?? null,
      value2: localeTransEntites[curr.name]?.value ?? null,
    });
    return acc;
  }, []), [localeBaseEntites, localeTransEntites]);

  // Trigger a read.
  const { data } = apiCrud.useReadQuery(localeReadQueryBase('en')) as QueryResult<Locale>;
  const denied = React.useMemo(() => !!data?.denied?.includes(localeSlice.key), [data]);

  React.useEffect(() => () => {
    dispatch(localeSlice.action.clear());
  }, []);

  return (
    <Box p={2}>
      <Stack gap={1}>
        <Typography variant="h4">Localization</Typography>
        <Box height={400} width="100%" sx={{ overflow: 'auto' }}>
          {rows.length ? (
            <DataGrid
              rows={rows}
              columns={columns}
              sortModel={[{ field: 'name', sort: 'asc' }]}
              slots={{
                loadingOverlay: LinearProgress,
                columnMenu: (props) => (
                  <GridColumnMenu
                    {...props}
                    slots={{
                      columnMenuColumnsItem: null,
                      columnMenuFilterItem: null,
                    }}
                  />
                ),
              }}
            />
          ) : (
            <p>{denied ? 'Access to data denied' : 'loading...' }</p>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default Localization;
