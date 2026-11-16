import { BookingSlotsPayload } from '../api';
import { FlowName, FormFieldName } from '../constants';
import { BookingEntry } from '../types';

/**
 * Builds the payload required for fetching booking slots based on the entry data.
 * @param entry
 * @returns
 */
export const buildBookingSlotsPayload = (
  entry: BookingEntry,
): BookingSlotsPayload => {
  const jurisdiction =
    entry.data.flow === FlowName.DIVORCE_SEPARATION
      ? entry.data[
          FormFieldName.ELIGIBILITY_DIVORCE_JURISDICTION_STATUS
        ].toString()
      : undefined;
  const isBslRequired =
    entry.data[FormFieldName.ACCESS_SUPPORT_REQUEST] === 'bsl-interpreter';
  const isInterpreterRequired =
    entry.data[FormFieldName.ACCESS_SUPPORT_REQUEST] ===
    'foreign-language-interpreter';
  const isDoubleSlot = isInterpreterRequired || isBslRequired;

  return {
    appointmentType: entry.data.flow,
    appointmentLanguage: entry.data.locale,
    ...(jurisdiction && { jurisdiction }),
    medium: 'phone',
    isDoubleSlot,
    ...(isDoubleSlot && {
      isBslRequired,
      isInterpreterRequired,
    }),
  };
};
