import { saveIncomeExpensesApi } from './saveToMemory';

globalThis.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  }),
);

describe('Save to memory api call', () => {
  it('should call save-to-memory api', async () => {
    const mockFetch = jest.fn();
    (globalThis.fetch as jest.Mock).mockImplementation(mockFetch);

    await saveIncomeExpensesApi({ test: 'test' });
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should nost call save-to-memory api when data are empty', async () => {
    const res = await saveIncomeExpensesApi({});
    expect(res).toBeNull();
  });

  it('should throw an error when the fetch call fail', () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue({});
    expect(
      async () => await saveIncomeExpensesApi({ test: 'test' }),
    ).rejects.toThrow();
  });
});
