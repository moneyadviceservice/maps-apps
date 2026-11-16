let queue: Promise<unknown> = Promise.resolve();

/**
 * Add function calls to a queue, running in series one at a time, in the order
 * they were requested.
 */
export const enqueue = <T>(functionToQueue: () => Promise<T>): Promise<T> => {
  const newQueue = queue.then(functionToQueue);

  queue = newQueue.catch((error) => {
    console.error(error);
  });

  return newQueue;
};
