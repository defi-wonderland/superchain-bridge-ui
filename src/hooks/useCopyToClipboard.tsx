import { useCallback, useState } from 'react';

/**
 * A map of item identifiers to the text copied.
 * If nothing has been copied yet for a given identifier, the value is `null`.
 */

type CopiedStates = {
  [key: string]: string | null;
};

/**
 * Function to copy text to the clipboard.
 * @param text The text to copy to the clipboard.
 * @param id The id assigned to the text to copy to the clipboard.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the text was copied successfully, or `false` otherwise.
 */

type CopyFn = (id: string, text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedStates, CopyFn] {
  const [copiedStates, setCopiedStates] = useState<CopiedStates>({});
  const copiedTextTimeout = 800;

  const copy: CopyFn = useCallback(async (id, text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prevStates) => ({ ...prevStates, [id]: text }));
      setTimeout(() => {
        setCopiedStates((prevStates) => ({ ...prevStates, [id]: null }));
      }, copiedTextTimeout);

      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      return false;
    }
  }, []);

  return [copiedStates, copy];
}
