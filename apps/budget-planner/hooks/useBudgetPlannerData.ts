'use client';

import { useEffect, useSyncExternalStore } from 'react';

type BudgetPlannerData = { [key: string]: Record<string, string> };

type StoreState = { data: BudgetPlannerData; hydrated: boolean };

export const STORAGE_KEY = 'budget-planner-data';

const EMPTY: BudgetPlannerData = {};

const isEmbeddedSession = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('isEmbedded') === 'true'
    );
  } catch {
    return false;
  }
};

const readStore = (): BudgetPlannerData => {
  try {
    if (typeof window === 'undefined' || isEmbeddedSession()) return EMPTY;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as BudgetPlannerData)
      : EMPTY;
  } catch {
    return EMPTY;
  }
};

const writeStore = (data: BudgetPlannerData): void => {
  try {
    if (typeof window === 'undefined' || isEmbeddedSession()) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable
  }
};

export const clearBudgetPlannerStore = (): void => {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable - ignore.
  }
};

let state: StoreState = { data: EMPTY, hydrated: false };
const SERVER_STATE: StoreState = { data: EMPTY, hydrated: false };
const listeners = new Set<() => void>();

const emit = (): void => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): StoreState => state;
const getServerSnapshot = (): StoreState => SERVER_STATE;

const hydrate = (): void => {
  if (state.hydrated) return;
  const stored = readStore();
  state = {
    data: Object.keys(stored).length > 0 ? stored : state.data,
    hydrated: true,
  };
  emit();
};

export const setBudgetData = (data: BudgetPlannerData): void => {
  writeStore(data);
  state = { data, hydrated: true };
  emit();
};

export const resetBudgetPlannerStore = (): void => {
  clearBudgetPlannerStore();
  state = { data: EMPTY, hydrated: false };
  emit();
};

export const useBudgetPlannerData = () => {
  const { data, hydrated } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    hydrate();
  }, []);

  return { budgetData: data, setBudgetData, hydrated };
};
