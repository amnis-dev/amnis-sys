import React from 'react';

export function useUpdateEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList | undefined,
) {
  const initialized = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (initialized.current) {
      return effect();
    }
    initialized.current = true;
    return () => {};
  }, deps);
}

export default useUpdateEffect;
