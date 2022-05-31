let nextSubscriptionId = 0;
const subscriptions: Map<number, (e: KeyboardEvent) => void> = new Map();

/**
 * Listens to keydown events.
 * 
 * @param key Key to listen for
 * @param callback Function to call when key is pressed
 * @param options Options for key event
 * @returns Function that can be called to unsubscribe this listener
 */
export function subscribeToKey(
  key: string,
  callback: () => void,
  options?: Partial<{
    ctrlOrMeta: boolean;
    preventDefault: boolean;
  }>
): () => void {
  const id = nextSubscriptionId++;

  const fn = (e: KeyboardEvent) => {
    if (options?.ctrlOrMeta && !(e.ctrlKey || e.metaKey)) return;
    if (e.key === key) {
      if (options?.preventDefault) e.preventDefault();
      callback();
    }
  };

  subscriptions.set(id, fn);

  return () => subscriptions.delete(id);
}

function handleKeydown(e: KeyboardEvent) {
  subscriptions.forEach(fn => {
    fn(e);
  });
}

document.addEventListener("keydown", handleKeydown);
