import type { ChangeEvent } from 'react';

import { FILTER_SECTIONS } from 'data/components/filterOptions/filterConstants';

const FILTER_INPUT_NAMES = new Set(FILTER_SECTIONS.map((s) => s.name));

export type ListingsSelectedFilter = {
  category: string;
  values: string[];
};

/**
 * Active directory filter groups from the listings form (English category labels).
 */
export function buildSelectedFiltersFromForm(
  form: HTMLFormElement,
): ListingsSelectedFilter[] {
  const fd = new FormData(form);
  const selected: ListingsSelectedFilter[] = [];

  for (const section of FILTER_SECTIONS) {
    const raw = fd
      .getAll(section.name)
      .filter((v): v is string => typeof v === 'string' && v !== '');
    if (raw.length === 0) continue;
    selected.push({
      category: section.title.en,
      values: raw,
    });
  }

  return selected;
}

/**
 * Builds Adobe `eventInfo` when a directory filter checkbox toggles.
 */
export function getListingsFilterInteractionEventInfo(
  e: ChangeEvent<HTMLFormElement>,
):
  | {
      interactionType: 'filterSelect';
      filter: {
        category: string;
        value: string;
        selectedFilters: ListingsSelectedFilter[];
      };
    }
  | undefined {
  const form = e.currentTarget;
  const target = e.target;

  if (!(target instanceof HTMLInputElement)) return undefined;
  if (target.type !== 'checkbox') return undefined;
  if (!FILTER_INPUT_NAMES.has(target.name)) return undefined;

  const section = FILTER_SECTIONS.find((s) => s.name === target.name);
  if (!section) return undefined;

  return {
    interactionType: 'filterSelect',
    filter: {
      category: section.title.en,
      value: target.value,
      selectedFilters: buildSelectedFiltersFromForm(form),
    },
  };
}
