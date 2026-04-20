type GenesysFn = (...args: unknown[]) => void;

export const useLiveChat = () => {
  const toggleChat = () => {
    try {
      const g = (window as Window & { Genesys?: GenesysFn }).Genesys;
      g?.('command', 'Messenger.open', {}, null, () => {
        g?.('command', 'Messenger.close');
      });
    } catch {
      // Genesys unavailable, fail silently
      return;
    }
  };

  return { toggleChat };
};
