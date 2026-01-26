declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Record<string, unknown>[];
  // eslint-disable-next-line no-var
  var gtag: (...args: unknown[]) => void;
}

export {};
