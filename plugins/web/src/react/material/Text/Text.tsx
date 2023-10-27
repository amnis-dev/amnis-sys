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
      let result = !!text.length;
      if (!noLocaleSkeleton) {
        result = text.charAt(0) !== '%';
      }
      return result;
    },
    [text, noLocaleSkeleton],
  );

  return (
    <Typography {...props}>
      {loaded ? (children) : (
        <Skeleton variant="text" width={length * 8} />
      )}
    </Typography>
  );
};

export default Text;
