import type { ButtonProps } from './Button.types.js';

/**
 * A button for selecting the preferred application language.
 */
export interface LanguageButtonProps extends ButtonProps {
  /**
   * Hide language text in the button.
   */
  hideText?: boolean;
}
