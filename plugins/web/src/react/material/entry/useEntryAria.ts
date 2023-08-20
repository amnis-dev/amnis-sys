import React from 'react';
import { EntryContext } from '../../context/EntryContext.js';

/**
 * Generates HTML aria properties from the entry context.
 */
export function useEntryAria(): React.HTMLProps<HTMLElement> {
  const {
    entryLabelId,
    entryDescriptionId,
    entryErrorId,
    label,
    description,
    errors,
    hasLabelElement,
    hasDescriptionElement,
    hasErrorElement,
  } = React.useContext(EntryContext);

  /**
   * Compiles aria properties
   */
  const ariaProps = React.useMemo(() => {
    const nextProps: React.HTMLProps<HTMLElement> = {};

    if (errors.length > 0) {
      nextProps['aria-invalid'] = true;
      if (hasErrorElement) {
        nextProps['aria-errormessage'] = entryErrorId;
      }
    }

    if (hasLabelElement) {
      nextProps['aria-labelledby'] = entryLabelId;
    } else {
      nextProps['aria-label'] = label;
    }

    if (hasDescriptionElement) {
      nextProps['aria-describedby'] = entryDescriptionId;
    }

    return nextProps;
  }, [
    entryLabelId, label,
    entryDescriptionId, description,
    errors,
    hasLabelElement, hasDescriptionElement, hasErrorElement,
  ]);

  return ariaProps;
}

export default useEntryAria;
