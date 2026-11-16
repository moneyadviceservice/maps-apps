import { enqueue } from './enqueue';

const deferredHelper = () => {
  let resolve: () => void = () => {};
  let reject: () => void = () => {};

  const promise = new Promise<void>((resolveInner, rejectInner) => {
    resolve = resolveInner;
    reject = rejectInner;
  });

  return { promise, resolve, reject };
};

describe('enqueue', () => {
  it('runs queued functions, one at a time, in the order they were added', async () => {
    const callsOrder: string[] = [];
    const call1Deferred = deferredHelper();

    const call1 = enqueue(async () => {
      callsOrder.push('1:start');
      await call1Deferred.promise;
      callsOrder.push('1:end');
      return '1:complete';
    });

    const call2 = enqueue(async () => {
      callsOrder.push('2:start');
      return '2:complete';
    });

    expect(callsOrder).toEqual([]);

    // Wait for next tick
    await Promise.resolve();
    expect(callsOrder).toEqual(['1:start']);

    // Wait for queue to complete
    call1Deferred.resolve();
    await Promise.all([call1, call2]);

    expect(callsOrder).toEqual(['1:start', '1:end', '2:start']);
    await expect(call1).resolves.toBe('1:complete');
    await expect(call2).resolves.toBe('2:complete');
  });

  it('continues processing queued functions after a function rejects', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const callMock = jest.fn().mockResolvedValue('Mock result');
    const errorMock = new Error('Mock error');

    const call1 = enqueue(() => Promise.reject(errorMock));
    const call2 = enqueue(callMock);

    try {
      await expect(call1).rejects.toBe(errorMock);
      await expect(call2).resolves.toBe('Mock result');

      expect(consoleErrorSpy).toHaveBeenCalledWith(errorMock);
      expect(callMock).toHaveBeenCalledTimes(1);
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
