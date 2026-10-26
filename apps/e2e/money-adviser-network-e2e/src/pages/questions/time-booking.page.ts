import { mixedBookingSlots } from '@data/mock-data';
import { PageFactory } from '@lib/page-factory.lib';
import { formatSlot } from '@utils/dates.util';

export const TimeBookingPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: "Select customer's preferred time slot",
  endpoint: '/telephone/t-5',

  /**
   * For each slot in the mock booking slot data.
   * Parse it to the expected frontend text.
   */
  options: mixedBookingSlots.map((slot) => ({
    text: formatSlot(slot),
  })),
});

export type TimeBookingPageInstance = InstanceType<typeof TimeBookingPage>;
