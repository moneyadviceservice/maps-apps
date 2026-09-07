declare global {
  var requestLocks: Map<string, Promise<Response>>; //eslint-disable-line no-var
}

const globalLocks = global.requestLocks || new Map<string, Promise<Response>>();
global.requestLocks = globalLocks;

export const withFetchLock = async (
  key: string,
  fetchFn: () => Promise<Response>,
) => {
  if (globalLocks.has(key)) {
    return globalLocks.get(key)!;
  }

  const requestPromise = fetchFn().finally(() => globalLocks.delete(key));

  globalLocks.set(key, requestPromise);

  return requestPromise;
};
