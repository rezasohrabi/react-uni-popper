import { useEffect } from 'react';

/**
 * A custom React hook that listens for the "Escape" key press and triggers a callback function
 * when the key is pressed, provided the `isOpen` flag is true.
 *
 * @param callback - A function to be executed when the "Escape" key is pressed.
 * @param isOpen - A boolean indicating whether the listener should be active.
 *
 * @example
 * ```tsx
 * useOnEscape(() => {
 *   console.log('Escape key pressed!');
 * }, isOpen);
 * ```
 */
function useOnEscape(callback: () => void, isOpen: boolean) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, isOpen]);
}

export default useOnEscape;
