import React from 'react';
import {
  Card, CardActionArea, CardContent, Stack,
} from '@mui/material';
import { Text } from '@amnis/web/react/material';
import { ManagerContext } from '../ManagerContext.js';

interface PanelCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  path: string;
}

const PanelCard: React.FC<PanelCardProps> = ({
  icon, title, content, path,
}) => {
  const { locale, locationPush } = React.useContext(ManagerContext);

  return (
    <Card sx={{ flex: 1, minWidth: 200 }}>
      <CardActionArea
        sx={{ height: '100%', verticalAlign: 'top' }}
        onClick={() => locationPush(path)}
      >
        <CardContent sx={{ height: '100%' }}>
          <Stack direction="row" gap={1}>
            <div style={{ textAlign: 'center' }}>
              {icon}
            </div>
            <Text variant="h5" component="div" gutterBottom>
              {locale?.[`manager.route.${title.toLowerCase()}`] ?? title}
            </Text>
          </Stack>
          <Text variant="body2" color="text.secondary">
            {locale?.[`manager.route.${title.toLowerCase()}.description`] ?? content}
          </Text>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PanelCard;
