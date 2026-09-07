import { Language } from '@maps-react/mhf/utils';

import { AsyncAction, ResponseMessage } from '../constants';
import { SubmissionEntry } from '../types';
import { submitActionHandlerMap } from './submitHandlers';

describe('submitHandlers', () => {
  const ctx = {
    entry: {
      data: {
        flow: 'pw',
        locale: 'en',
      },
      stepIndex: 0,
      steps: [],
      errors: {},
    } as SubmissionEntry,
    locale: 'en' as Language,
  };

  it('BOOKING_CREATE returns mocked booking response', async () => {
    const result = await submitActionHandlerMap[AsyncAction.BOOKING_CREATE](
      ctx,
    );

    expect(result).toEqual({
      status: 'true',
      message: 0,
    });
  });

  it('BOOKING_AVAILABILITY placeholder throws FORM_HANDLER_ERROR', async () => {
    await expect(
      submitActionHandlerMap[AsyncAction.BOOKING_AVAILABILITY](ctx),
    ).rejects.toThrow(ResponseMessage.FORM_HANDLER_ERROR);
  });

  it('BOOKING_LOOKUP returns mocked lookup response and adds access details to the entry', async () => {
    const entry = {
      data: {
        flow: 'ds',
        locale: 'en',
        referenceNumber: 'DS-123456',
        day: '11',
        month: '1',
        year: '1998',
      },
      stepIndex: 0,
      steps: [],
      errors: {},
    } satisfies SubmissionEntry;

    const result = await submitActionHandlerMap[AsyncAction.BOOKING_LOOKUP]({
      entry,
      locale: 'en' as Language,
    });

    expect(result).toEqual({
      status: 'true',
      message: 0,
    });
    expect(entry.data).toEqual({
      flow: 'ds',
      locale: 'en',
      referenceNumber: 'DS-123456',
      day: '11',
      month: '1',
      year: '1998',
      accessSupportStatus: 'yes',
      accessOptionsRequest: 'welsh-speaking-pension-specialist',
      appointmentDate: '2026-07-24',
      appointmentSlotSelection: '886313e1-3b8a-5372-9b90-0c9aee199e5d::12:00',
    });
  });
});
