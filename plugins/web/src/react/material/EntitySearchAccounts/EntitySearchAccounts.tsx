import type {
  DataQueryProps, Entity, Profile, UID, User,
} from '@amnis/state';
import { noop, profileSlice, userSlice } from '@amnis/state';
import React from 'react';
import {
  Stack, List, ListItem, ListItemText, LinearProgress, ListItemAvatar, Avatar, Box,
} from '@mui/material';

import { Lock, LockOpen, Person } from '@mui/icons-material';
import { useCrudRead, useLocale, useWebSelector } from '@amnis/web/react/hooks';
import { SearchInput, Skele, Text } from '@amnis/web/react/material';

export interface EntitySearchAccountsProps {
  // Callback when a user is selected.
  onSelect?: (user: Entity<User>, profile: Entity<Profile>) => void;
}

export const EntitySearchAccounts: React.FC<EntitySearchAccountsProps> = ({
  onSelect = noop,
}) => {
  const userRead = useCrudRead({ forceRefetch: true });
  const profileRead = useCrudRead({ forceRefetch: true });

  const pending = userRead.crudReadPending || profileRead.crudReadPending;

  const userActive = useWebSelector(userSlice.select.active);
  const users = useWebSelector((state) => userSlice.select.all(state));
  const profiles = useWebSelector((state) => profileSlice.select.all(state));

  const localeKeys = React.useRef(['!account.lastlogin'] as const);
  const localeValues = useLocale(localeKeys.current);

  const [searchValue, searchValueSet] = React.useState('');

  const usersFiltered = React.useMemo(() => {
    if (!searchValue.length) return users;

    return users.filter((user) => user.handle.includes(searchValue));
  }, [users.length, searchValue]);

  React.useEffect(() => {
    const $query: DataQueryProps = {};

    // If there a search value, we want to search for users with handles that
    // match the search value.
    if (searchValue.length) {
      $query.handle = {
        $inc: searchValue,
      };
    }

    userRead.crudRead({
      [userSlice.key]: {
        $query,
      },
    });
  }, [userActive?.$id, searchValue]);

  React.useEffect(() => {
    profileRead.crudRead({
      [profileSlice.key]: {
        $query: {
          $_user: {
            $in: usersFiltered.map((user) => user.$id),
          },
        },
      },
    });
  }, [usersFiltered]);

  // A memo that maps user ids to profiles.
  const profileMap = React.useMemo(
    () => profiles.reduce((map, profile) => {
      map[profile.$_user] = profile;
      return map;
    }, {} as Record<UID, Entity<Profile>>),
    [profiles],
  );

  const handleSearch = React.useCallback((value: string) => {
    searchValueSet(value);
  }, []);

  return (
    <Stack>
      <SearchInput
        onChangeDebounced={handleSearch}
      />
      <LinearProgress style={{ opacity: pending ? 1 : 0 }} />
      <List>
        {usersFiltered.map((user) => (
          <ListItem
            key={user.$id}
            button
            onClick={() => onSelect(user, profileMap[user.$id])}
            style={{ opacity: user.locked ? 0.5 : undefined }}
          >
            {profileMap[user.$id] ? (
              <>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <Box flex={1}>
                  <ListItemText primary={`${user.handle} (${profileMap[user.$id]?.nameDisplay})`} secondary={user.email} />
                  <Text variant="body2" sx={{ opacity: 0.7 }}>
                    {`${localeValues['!account.lastlogin'].value}: ${user._logged ? new Date(user._logged).toLocaleString() : 'Never'}`}
                  </Text>
                </Box>
                <Box>
                  {user.locked ? <Lock /> : <LockOpen />}
                </Box>
              </>
            ) : (
              <Skele key={user.$id} variant='box' />
            )}

          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default EntitySearchAccounts;
