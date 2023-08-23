import React from 'react';
import type { TypographyProps } from '@mui/material';
import { Skeleton, Typography } from '@mui/material';

export interface TextProps extends TypographyProps {
  /**
   * Estimated length of text.
   *
   * @default 16
   */
  length?: number;

  /**
   * String value child.
   */
  children?: string;
}

/**
 * A text component that supports lazy loading skeletons.
 */
export const Text: React.FC<TextProps> = ({
  length = 16,
  children,
  ...props
}) => (
  <Typography {...props}>
    {children?.length ? (children) : (
      <Skeleton variant="text" width={length * 8} />
    )}
  </Typography>
);

export default Text;
