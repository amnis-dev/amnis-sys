import type {
  DataQueryProps, Entity, Profile, UID,
} from '@amnis/state';
import { profileSlice, userSlice } from '@amnis/state';
import React from 'react';
import {
  Stack, List, ListItem, ListItemText, LinearProgress, ListItemAvatar, Avatar,
} from '@mui/material';

import { Person } from '@mui/icons-material';
import { useCrudRead, useWebSelector } from '@amnis/web/react/hooks';
import { SearchInput } from '@amnis/web/react/material';

export const EntitySearchAccounts: React.FC = () => {
  const userRead = useCrudRead({ forceRefetch: true });
  const profileRead = useCrudRead({ forceRefetch: true });

  const pending = userRead.crudReadPending || profileRead.crudReadPending;

  const userActive = useWebSelector(userSlice.select.active);
  const users = useWebSelector((state) => userSlice.select.all(state));
  const profiles = useWebSelector((state) => profileSlice.select.all(state));

  const [searchValue, searchValueSet] = React.useState('');

  const usersFiltered = React.useMemo(() => {
    if (!searchValue.length) return users;

    return users.filter((user) => user.handle.includes(searchValue));
  }, [users, searchValue]);

  React.useEffect(() => {
    if (userRead.crudReadPending) return;

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
    if (profileRead.crudReadPending) return;

    profileRead.crudRead({
      [profileSlice.key]: {
        $query: {
          $user: {
            $in: usersFiltered.map((user) => user.$id),
          },
        },
      },
    });
  }, [usersFiltered]);

  // A memo that maps user ids to profiles.
  const profileMap = React.useMemo(
    () => profiles.reduce((map, profile) => {
      map[profile.$user] = profile;
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
        {users.map((user) => (
          <ListItem key={user.$id} button>
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${user.handle} (${profileMap[user.$id]?.nameDisplay})`} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default EntitySearchAccounts;
