import { type Language } from '@maps-react/utils/language';

import { DoubleSlotPayload, SingleSlotPayload } from '../api';
import { FlowName, FormFieldName } from '../constants';
import { BookingEntry } from '../types';
import { buildBookingSlotsPayload } from './buildBookingSlotsPayload';

describe('buildBookingSlotsPayload', () => {
  const createEntry = (data: Partial<BookingEntry['data']>): BookingEntry =>
    ({
      data: {
        flow: FlowName.PENSION_WISE,
        locale: 'en' as Language,
        ...data,
      },
    } as BookingEntry);

  it('builds a single-slot payload for the standard flow', () => {
    const entry = createEntry({
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'none',
    });

    expect(buildBookingSlotsPayload(entry)).toEqual({
      appointmentType: FlowName.PENSION_WISE,
      appointmentLanguage: 'en',
      medium: 'phone',
      isDoubleSlot: false,
    } satisfies SingleSlotPayload);
  });

  it('includes the jurisdiction for the divorce and separation flow', () => {
    const entry = createEntry({
      flow: FlowName.DIVORCE_SEPARATION,
      [FormFieldName.ELIGIBILITY_DIVORCE_JURISDICTION_STATUS]: 'en',
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'none',
    });

    expect(buildBookingSlotsPayload(entry)).toEqual({
      appointmentType: FlowName.DIVORCE_SEPARATION,
      appointmentLanguage: 'en',
      jurisdiction: 'en',
      medium: 'phone',
      isDoubleSlot: false,
    } satisfies SingleSlotPayload);
  });

  it('omits jurisdiction for other appointment types', () => {
    const entry = createEntry({
      flow: FlowName.PENSION_WISE,
      [FormFieldName.ELIGIBILITY_DIVORCE_JURISDICTION_STATUS]: 'en',
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'none',
    });

    expect(buildBookingSlotsPayload(entry)).toEqual({
      appointmentType: FlowName.PENSION_WISE,
      appointmentLanguage: 'en',
      medium: 'phone',
      isDoubleSlot: false,
    } satisfies SingleSlotPayload);
  });

  it('builds a double-slot payload when BSL is required', () => {
    const entry = createEntry({
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'bsl-interpreter',
    });

    expect(buildBookingSlotsPayload(entry)).toEqual({
      appointmentType: FlowName.PENSION_WISE,
      appointmentLanguage: 'en',
      medium: 'phone',
      isDoubleSlot: true,
      isBslRequired: true,
      isInterpreterRequired: false,
    } satisfies DoubleSlotPayload);
  });

  it('builds a double-slot payload when an foreign language interpreter is required', () => {
    const entry = createEntry({
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
    });

    expect(buildBookingSlotsPayload(entry)).toEqual({
      appointmentType: FlowName.PENSION_WISE,
      appointmentLanguage: 'en',
      medium: 'phone',
      isDoubleSlot: true,
      isBslRequired: false,
      isInterpreterRequired: true,
    } satisfies DoubleSlotPayload);
  });
});
