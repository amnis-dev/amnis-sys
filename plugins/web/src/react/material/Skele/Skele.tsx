import React from 'react';
import { SkeleBox } from './SkeleBox.js';
import { SkeleForm } from './SkeleForm.js';
import { SkeleCardList } from './SkeleCardList.js';

export interface SkeleProps {
  /**
   * The variant to use.
   */
  variant?: 'box' | 'form' | 'card-list';
}

export const Skele: React.FC<SkeleProps> = ({
  variant = 'box',
}) => {
  const SeleVariant = React.useMemo(() => {
    switch (variant) {
      case 'box':
        return SkeleBox;
      case 'form':
        return SkeleForm;
      case 'card-list':
        return SkeleCardList;
      default:
        return SkeleBox;
    }
  }, [variant]);

  return (
    <SeleVariant />
  );
};

export default Skele;
