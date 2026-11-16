import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import {
  clearBudgetPlannerStore,
  resetBudgetPlannerStore,
  STORAGE_KEY,
  useBudgetPlannerData,
} from './useBudgetPlannerData';

const Consumer = () => {
  const { budgetData, setBudgetData, hydrated } = useBudgetPlannerData();
  return (
    <div>
      <span data-testid="hydrated">{String(hydrated)}</span>
      <span data-testid="value">{budgetData.income?.pay ?? ''}</span>
      <button
        type="button"
        onClick={() => setBudgetData({ income: { pay: '2000' } })}
      >
        update
      </button>
    </div>
  );
};

const Display = ({ id }: { id: string }) => {
  const { budgetData } = useBudgetPlannerData();
  return (
    <span data-testid={`value-${id}`}>{budgetData.income?.pay ?? ''}</span>
  );
};

describe('useBudgetPlannerData', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState({}, '', '/');
    resetBudgetPlannerStore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.sessionStorage.clear();
    window.history.replaceState({}, '', '/');
    resetBudgetPlannerStore();
  });

  it('marks the store as hydrated after mount', async () => {
    render(<Consumer />);
    await waitFor(() =>
      expect(screen.getByTestId('hydrated').textContent).toBe('true'),
    );
  });

  it('mirrors updates to sessionStorage', async () => {
    render(<Consumer />);

    fireEvent.click(screen.getByText('update'));

    await waitFor(() =>
      expect(window.sessionStorage.getItem(STORAGE_KEY)).toBe(
        JSON.stringify({ income: { pay: '2000' } }),
      ),
    );
    expect(screen.getByTestId('value').textContent).toBe('2000');
  });

  it('shares reactive updates across components without a provider', async () => {
    render(
      <>
        <Display id="a" />
        <Display id="b" />
        <Consumer />
      </>,
    );

    fireEvent.click(screen.getByText('update'));

    await waitFor(() =>
      expect(screen.getByTestId('value-a').textContent).toBe('2000'),
    );
    expect(screen.getByTestId('value-b').textContent).toBe('2000');
  });

  it('hydrates from a pre-seeded sessionStorage entry on mount', async () => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ income: { pay: '1500' } }),
    );

    render(<Consumer />);

    await waitFor(() =>
      expect(screen.getByTestId('value').textContent).toBe('1500'),
    );
  });

  it('ignores a valid-JSON non-object stored value without crashing', async () => {
    // e.g. a corrupt entry or foreign writer leaving `null` on the same origin
    window.sessionStorage.setItem(STORAGE_KEY, 'null');

    expect(() => render(<Consumer />)).not.toThrow();

    await waitFor(() =>
      expect(screen.getByTestId('hydrated').textContent).toBe('true'),
    );
    expect(screen.getByTestId('value').textContent).toBe('');
  });

  it('does not read or write sessionStorage when embedded', async () => {
    window.history.replaceState({}, '', '/?isEmbedded=true');
    const seeded = JSON.stringify({ income: { pay: '999' } });
    window.sessionStorage.setItem(STORAGE_KEY, seeded);

    render(<Consumer />);

    // hydration must ignore the pre-seeded entry while embedded
    await waitFor(() =>
      expect(screen.getByTestId('hydrated').textContent).toBe('true'),
    );
    expect(screen.getByTestId('value').textContent).toBe('');

    // updates must not be written to sessionStorage while embedded
    fireEvent.click(screen.getByText('update'));
    await waitFor(() =>
      expect(screen.getByTestId('value').textContent).toBe('2000'),
    );
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBe(seeded);
  });

  it('no-ops without throwing when sessionStorage is unavailable', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });

    render(<Consumer />);

    await waitFor(() =>
      expect(screen.getByTestId('hydrated').textContent).toBe('true'),
    );

    expect(() => fireEvent.click(screen.getByText('update'))).not.toThrow();
    expect(screen.getByTestId('value').textContent).toBe('2000');
  });

  it('clearBudgetPlannerStore removes the stored entry', () => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ a: { b: 'c' } }),
    );
    clearBudgetPlannerStore();
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
