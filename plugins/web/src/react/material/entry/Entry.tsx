import React from 'react';
import type { EntryContextProps } from './EntryContext.js';
import { EntryContext, entryContextDefault } from './EntryContext.js';
import { Text } from './inputs/index.js';

export type EntryProps = {
  label: string;
} & {
  type: 'text';
  onChange: (value: string) => void;
} & {
  type: 'number';
  onChange: (value: number) => void;
}

export const Entry: React.FC<EntryProps> = ({
  label,
  type,
}) => {
  const contextValue = React.useMemo<EntryContextProps<any>>(() => ({
    ...entryContextDefault,
    label,
  }), [
    label,
  ]);

  return (
    <EntryContext.Provider value={contextValue}>
      {((): React.ReactNode => {
        switch (type) {
          case 'text':
            return <Text />;
          default:
            return <span>&nbsp;</span>;
        }
      })()}
    </EntryContext.Provider>
  );
};
