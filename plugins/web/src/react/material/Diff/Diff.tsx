import type {
  DataUpdate, Entity, UID, Data, DataUpdater,
} from '@amnis/state';
import {
  dataActions,
  dataName,
  dataSelectors,
  titleize,
} from '@amnis/state';
import React from 'react';
import {
  Box,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { ArrowRight, Restore } from '@mui/icons-material';
import {
  useEntitySchema, useLocale, useTranslate, useWebDispatch, useWebSelector,
} from '@amnis/web/react/hooks';
import { Text } from '@amnis/web/react/material';

export interface DiffProps {
  /**
   * Entity id to compare.
   */
  $id?: string | UID;
}

type DiffComparisonRecord = {
  key: string;
  label: string;
  original: any;
  current: any;
};

export const Diff: React.FC<DiffProps> = ({
  $id,
}) => {
  const dispatch = useWebDispatch();

  const sliceKey = React.useMemo(() => $id?.split(':')[0], [$id]);
  const selectors = React.useMemo(() => dataSelectors(sliceKey || ''), [sliceKey]);

  const difference = useWebSelector((state) => selectors.difference(state, ($id || '') as UID));

  const currentTranslated = useTranslate(difference?.current);

  const localeKeys = React.useRef(['!diff.restore'] as const);
  const locale = useLocale(localeKeys.current);

  const schema = useEntitySchema($id);

  const comparison = React.useMemo<DiffComparisonRecord[]>(() => {
    if (!difference) return [];

    return difference.keys.map<DiffComparisonRecord>((key) => {
      const label = schema?.properties?.[key].title ?? titleize(key);
      const original = difference.original?.[key];
      const current = difference.current?.[key];
      return {
        key: key as string,
        label,
        original,
        current,
      };
    });
  }, [
    difference.original,
    difference.current,
    difference.keys,
    schema,
  ]);

  const handleRestore = React.useCallback((key: string) => {
    if (!$id || !sliceKey || !difference.original) return;
    const updater: DataUpdate<Entity> = {
      $id: $id as UID,
      [key]: difference.original[key as keyof Data] as any,
    };
    const payload: DataUpdater = {
      [sliceKey]: [updater],
    };
    dispatch(dataActions.update(payload));
  }, [dispatch, difference.original, sliceKey]);

  return $id ? (
    <TableContainer>
      <Box>
        <Text noLocaleSkeleton variant="body2" sx={{
          opacity: 0.64, marginBottom: '-8px',
        }}>
          {schema?.title ?? titleize(sliceKey ?? 'Unknown Entity')}
        </Text>
        <Text noLocaleSkeleton variant="h6">
          {dataName(currentTranslated)}
        </Text>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">
              <strong>Name</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Original</strong>
            </TableCell>
            <TableCell style={{ width: 50 }} align="center">
              &nbsp;
            </TableCell>
            <TableCell align="left">
              <strong>Current</strong>
            </TableCell>
            <TableCell align="right">
              &nbsp;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comparison.map((record) => (
            <TableRow key={record.key}>
              <TableCell align="right">
                {record.label}
              </TableCell>
              <TableCell align="right">
                {record.original}
              </TableCell>
              <TableCell style={{ width: 50 }} align="center">
                <ArrowRight />
              </TableCell>
              <TableCell align="left">
                {record.current}
              </TableCell>
              <TableCell align="right">
                <Tooltip title={locale['!diff.restore']}>
                  <IconButton onClick={() => handleRestore(record.key)}>
                    <Restore />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : <Skeleton variant="rectangular" width="100%" height={118} />;
};

export default Diff;
