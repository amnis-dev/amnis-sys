import React from 'react';
import { uid } from '@amnis/state';
import type { WebContextIderEntities } from '../WebContext.js';
import { WebContext } from '../WebContext.js';

export function useIder<H extends HTMLElement>(entities: WebContextIderEntities) {
  const { idersAdd, idersRemove } = React.useContext(WebContext);
  const id = React.useMemo(() => uid('web-ider'), []);
  const ref = React.useRef<H>(null);

  React.useEffect(() => {
    if (ref.current) {
      idersRemove(id);
      idersAdd(id, [entities, ref]);
    }
    return () => {
      idersRemove(id);
    };
  }, [!!ref.current, entities]);

  return ref;
}

export default useIder;
