import { ENV } from '@lib/env.lib';
import {
  TAppointmentResponseOption,
  TBookingSlotOption,
} from '@lib/mock-api.lib';
import { Page } from '@lib/test.lib';

export class MockServerUtils {
  private readonly mockApi = ENV.APPOINTMENTS_API + 'mock/config';

  constructor(private readonly page: Page) {}

  async toggleBookingSlots(slotOption: TBookingSlotOption) {
    await this.page.request.patch(this.mockApi + '/toggle-slots', {
      data: { value: slotOption },
    });
  }

  async toggleAppointmentResponse(slotOption: TAppointmentResponseOption) {
    await this.page.request.patch(this.mockApi + '/toggle-appointment', {
      data: { value: slotOption },
    });
  }

  async reset() {
    await this.page.request.patch(this.mockApi + '/reset');
  }
}
