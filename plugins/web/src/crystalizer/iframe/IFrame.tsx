import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { IframeHTMLAttributes } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@mui/material';

export interface IFrameProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  title: string;
  children: React.ReactNode;
}

const IFrameStyled = styled('iframe')(() => ({
  overflow: 'scroll',
  border: 'none',
  width: '100%',
  height: '100%',
}));

export const IFrame: React.FC<IFrameProps> = ({
  title,
  children,
  ...props
}) => {
  const [contentRef, contentRefSet] = React.useState<HTMLIFrameElement | null>(null);

  const mountNode = React.useMemo(() => (
    contentRef?.contentWindow?.document?.body
  ), [contentRef?.contentWindow?.document]);

  const cache = React.useMemo(() => createCache({
    key: 'website-css',
    container: contentRef?.contentWindow?.document?.head,
    prepend: true,
  }), [contentRef?.contentWindow?.document]);

  return (
    <IFrameStyled
      {...props}
      sx={{
        border: 'none',
      }}
      title={title}
      ref={(element: HTMLIFrameElement) => contentRefSet(element)}
    >
      {mountNode ? createPortal(
        <CacheProvider value={cache}>
          {children}
        </CacheProvider>,
        mountNode,
      ) : null}
    </IFrameStyled>
  );
};

export default IFrame;
