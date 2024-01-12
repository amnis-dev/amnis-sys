import { logSlice } from '@amnis/state';
import React from 'react';
import { createSelector } from '@amnis/state/rtk';
import { enqueueSnackbar } from 'notistack';
import { useWebSelector } from '@amnis/web';

interface UtilityLogSnacksProps {
  // Add any props you need here
}

/**
 * A function using createSelector that returns all logs sorted by latest first.
 */
const selectLogsSorted = createSelector(
  logSlice.select.all,
  (logs) => logs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()),
);

export const UtilityLogSnacks: React.FC<UtilityLogSnacksProps> = () => {
  const logs = useWebSelector(selectLogsSorted);

  React.useEffect(() => {
    const latest = logs[0];

    if (latest && latest.title.length > 0) {
      if (!['error', 'success'].includes(latest.level)) {
        return;
      }

      // Convert log.level to notistack variant type
      const variant = (() => {
        switch (latest.level) {
          case 'error':
            return 'error';
          case 'warn':
            return 'warning';
          case 'info':
            return 'info';
          case 'success':
            return 'success';
          default:
            return 'default';
        }
      })();

      enqueueSnackbar(latest.title, { variant });
    }
  }, [logs.length]);

  return (
    <></>
  );
};

export default UtilityLogSnacks;
