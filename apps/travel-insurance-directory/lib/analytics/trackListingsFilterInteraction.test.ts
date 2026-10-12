import type { ChangeEvent } from 'react';

import { FILTER_SECTIONS } from 'data/components/filterOptions/filterConstants';

import {
  buildSelectedFiltersFromForm,
  getListingsFilterInteractionEventInfo,
} from './trackListingsFilterInteraction';

function changeEvent(
  form: HTMLFormElement,
  target: HTMLElement,
): ChangeEvent<HTMLFormElement> {
  return {
    currentTarget: form,
    target,
  } as unknown as ChangeEvent<HTMLFormElement>;
}

describe('trackListingsFilterInteraction', () => {
  describe('buildSelectedFiltersFromForm', () => {
    it('returns grouped active filters with English category labels', () => {
      const form = document.createElement('form');
      const age = document.createElement('input');
      age.name = 'age';
      age.value = '0-16';
      form.appendChild(age);
      const age2 = document.createElement('input');
      age2.name = 'age';
      age2.value = '17-69';
      form.appendChild(age2);
      const trip = document.createElement('input');
      trip.name = 'trip_type';
      trip.value = 'single_trip';
      form.appendChild(trip);

      expect(buildSelectedFiltersFromForm(form)).toEqual([
        {
          category: FILTER_SECTIONS[0].title.en,
          values: ['0-16', '17-69'],
        },
        {
          category: FILTER_SECTIONS[1].title.en,
          values: ['single_trip'],
        },
      ]);
    });

    it('returns empty array when no filter fields are present', () => {
      const form = document.createElement('form');
      const lang = document.createElement('input');
      lang.name = 'lang';
      lang.value = 'en';
      form.appendChild(lang);
      expect(buildSelectedFiltersFromForm(form)).toEqual([]);
    });
  });

  describe('getListingsFilterInteractionEventInfo', () => {
    it('returns eventInfo for a filter checkbox', () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'trip_type';
      checkbox.value = 'annual_multi_trip';
      checkbox.checked = true;
      form.appendChild(checkbox);

      const info = getListingsFilterInteractionEventInfo(
        changeEvent(form, checkbox),
      );

      expect(info).toEqual({
        interactionType: 'filterSelect',
        filter: {
          category: 'Filter by insurance type',
          value: 'annual_multi_trip',
          selectedFilters: [
            {
              category: 'Filter by insurance type',
              values: ['annual_multi_trip'],
            },
          ],
        },
      });
    });

    it('returns undefined for non-filter inputs', () => {
      const form = document.createElement('form');
      const limit = document.createElement('select');
      limit.name = 'limit';
      const opt = document.createElement('option');
      opt.value = '10';
      limit.appendChild(opt);
      form.appendChild(limit);

      expect(
        getListingsFilterInteractionEventInfo(changeEvent(form, limit)),
      ).toBeUndefined();
    });

    it('returns undefined when target is not an input', () => {
      const form = document.createElement('form');
      const div = document.createElement('div');
      form.appendChild(div);
      expect(
        getListingsFilterInteractionEventInfo(changeEvent(form, div)),
      ).toBeUndefined();
    });

    it('returns undefined for radio buttons (filters are checkboxes only)', () => {
      const form = document.createElement('form');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'trip_type';
      radio.value = 'single_trip';
      form.appendChild(radio);

      expect(
        getListingsFilterInteractionEventInfo(changeEvent(form, radio)),
      ).toBeUndefined();
    });
  });
});
