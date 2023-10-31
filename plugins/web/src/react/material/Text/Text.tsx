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
   * Disable skeleton.
   */
  noSkeleton?: boolean;

  /**
   * Disable locale key skeleton.
   */
  noLocaleSkeleton?: boolean;

  /**
   * String value child.
   */
  children?: string | number;
}

/**
 * A text component that supports lazy loading skeletons.
 */
export const Text: React.FC<TextProps> = ({
  length = 12,
  noSkeleton = false,
  noLocaleSkeleton = false,
  children,
  ...props
}) => {
  const text = React.useMemo(
    () => {
      if (!children) {
        return '';
      }

      if (typeof children === 'number') {
        return children.toString();
      }

      return children;
    },
    [children],
  );
  const loaded = React.useMemo(
    () => {
      let result = text.length > 0;
      if (!noLocaleSkeleton) {
        result = result && text.charAt(0) !== '%';
      }
      return result;
    },
    [text, noLocaleSkeleton],
  );

  return (
    <Typography {...props}>
      {loaded ? text : (
        <Skeleton variant="text" width={length * 8 * (noSkeleton ? 1 : 0)} sx={{ opacity: noSkeleton ? 0 : 1 }} />
      )}
    </Typography>
  );
};

export default Text;
