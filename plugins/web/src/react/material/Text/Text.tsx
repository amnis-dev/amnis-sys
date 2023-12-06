import React from 'react';
import { createSelector } from '@amnis/state/rtk';
import type { TypographyProps } from '@mui/material';
import { Skeleton, Typography } from '@mui/material';
import { localeSlice } from '@amnis/state';
// import { useWebSelector } from '@amnis/web/react/hooks';
// import { WebContext } from '@amnis/web/react';

const selectLocaleValue = createSelector(
  [
    (state: any) => localeSlice.select.state(state).names,
    (state, key: string) => key,
  ],
  (names, key) => names[key]?.value,
);

export interface TextProps extends TypographyProps {
  /**
   * Inherit all CSS font/text styles.
   */
  inherit?: boolean;

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
  inherit = false,
  length = 12,
  noSkeleton = false,
  noLocaleSkeleton = false,
  children,
  ...props
}) => {
  // const { localePush } = React.useContext(WebContext);
  // const localeValue = useWebSelector(
  //   (state) => {
  //     if (children && typeof children === 'string' && children.startsWith('%!')) {
  //       return selectLocaleValue(state, children.substring(1));
  //     }
  //     return undefined;
  //   },
  // );

  const text = React.useMemo(
    () => {
      if (!children) {
        return '';
      }

      if (typeof children === 'number') {
        return children.toString();
      }

      // if (localeValue) {
      //   return localeValue;
      // }

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

  const inheritSx = React.useMemo<React.CSSProperties>(() => {
    if (!inherit) {
      return {};
    }

    return {
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      textTransform: 'inherit',
      whiteSpace: 'inherit',
      textAlign: 'inherit',
      textDecoration: 'inherit',
    };
  }, [inherit]);

  // React.useEffect(() => {
  //   if (text?.startsWith('%!')) {
  //     localePush([text.substring(1)]);
  //   }
  // }, [text]);

  const inheritProps = React.useMemo<TypographyProps>(() => {
    if (!inherit) {
      return {};
    }

    return {
      variant: 'inherit',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      sx: {
        ...inheritSx,
        ...props.sx,
      },
    };
  }, [inherit, inheritSx, props.sx]);

  return (
    <Typography {...props} {...inheritProps}>
      {loaded ? text : (
        <Skeleton variant="text" width={length * 8 * (noSkeleton ? 0 : 1)} sx={{ opacity: noSkeleton ? 0 : 1 }} />
      )}
    </Typography>
  );
};

export default Text;
