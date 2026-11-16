import { ResponseMessage, SubmissionState } from '@maps-react/mhf/constants';
import { resolveNextSteps } from '@maps-react/mhf/form';
import { mockEntry, mockSessionId } from '@maps-react/mhf/mocks';
import { setStoreEntry } from '@maps-react/mhf/store';
import { runSubmissionStateMachine } from '@maps-react/mhf/submission/runSubmissionStateMachine';
import { Entry } from '@maps-react/mhf/types';
import { Language } from '@maps-react/utils/language';

import { mockAppointmentResponse } from '../api/getAppointment.test';
import { AsyncAction, StepName } from '../constants';
import {
  advanceStepAndRedirect,
  mergeAppointmentIntoEntryData,
  runSubmitFlow,
} from './submitFlow';
import { submitActionHandlerMap } from './submitHandlers';

jest.mock('@maps-react/mhf/form', () => ({
  resolveNextSteps: jest.fn(),
}));
jest.mock('@maps-react/mhf/store', () => ({
  setStoreEntry: jest.fn(),
}));
jest.mock('@maps-react/mhf/submission/runSubmissionStateMachine', () => ({
  runSubmissionStateMachine: jest.fn(),
}));
jest.mock('./submitHandlers', () => ({
  submitActionHandlerMap: {
    'booking-create': jest.fn(),
    'appointment-availability': jest.fn(),
  },
}));

describe('submit flow', () => {
  let entry: Entry;
  const mockSubmitFlow = {
    key: mockSessionId,
    locale: 'en' as Language,
    action: AsyncAction.BOOKING_CREATE,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    entry = {
      ...mockEntry,
      data: { ...mockEntry.data },
      steps: [StepName.CONFIRM_DETAILS, StepName.LOADING_BOOKING_CREATE],
      stepIndex: 1,
    };
  });
  describe('runSubmitFlow', () => {
    it('configures the shared runner and returns its result', async () => {
      const result = {
        redirect: {
          destination: '/en/${Step.CONFIRMATION}',
          permanent: false as const,
        },
      };
      jest.mocked(runSubmissionStateMachine).mockResolvedValue(result);

      await expect(runSubmitFlow({ ...mockSubmitFlow, entry })).resolves.toBe(
        result,
      );

      expect(runSubmissionStateMachine).toHaveBeenCalledWith({
        entry,
        key: mockSessionId,
        locale: 'en',
        submissionKey: AsyncAction.BOOKING_CREATE,
        loadingDestination: '/en/loading/booking-create',
        errorDestination: expect.any(Function),
        resolveErrorStatus: expect.any(Function),
        submit: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });

    it('supplies a submit callback that calls the booking handler', async () => {
      const response = { status: true, message: 'booking-reference' };
      const handler = submitActionHandlerMap[AsyncAction.BOOKING_CREATE];
      jest.mocked(handler).mockResolvedValue(response);

      await runSubmitFlow({ ...mockSubmitFlow, entry });
      const { submit } = jest.mocked(runSubmissionStateMachine).mock
        .calls[0][0];

      await expect(submit(entry)).resolves.toBe(response);
      expect(handler).toHaveBeenCalledWith({ entry, payload: undefined });
    });

    it('builds an error destination with an encoded status', async () => {
      await runSubmitFlow({ ...mockSubmitFlow, entry });
      const { errorDestination } = jest.mocked(runSubmissionStateMachine).mock
        .calls[0][0];

      expect(errorDestination('status & detail')).toBe(
        '/en/error?status=status%20%26%20detail',
      );
    });

    it('supplies a success callback that advances to confirmation and saves the entry', async () => {
      await runSubmitFlow({ ...mockSubmitFlow, entry });
      const { onSuccess } = jest.mocked(runSubmissionStateMachine).mock
        .calls[0][0];

      const result = await onSuccess(entry, mockSessionId, 'en');

      expect(resolveNextSteps).toHaveBeenCalledWith(
        entry,
        StepName.CONFIRMATION,
      );
      expect(entry.stepIndex).toBe(2);
      expect(setStoreEntry).toHaveBeenCalledWith(mockSessionId, entry);
      expect(result).toEqual({
        redirect: { destination: '/en/confirmation', permanent: false },
      });
    });

    it('builds a booking availability payload and UUID-based submission key', async () => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid');

      await runSubmitFlow({
        ...mockSubmitFlow,
        action: AsyncAction.BOOKING_AVAILABILITY,
        entry,
      });

      const { submissionKey } = jest.mocked(runSubmissionStateMachine).mock
        .calls[0][0];

      expect(submissionKey).toBe(
        `${AsyncAction.BOOKING_AVAILABILITY}-test-uuid`,
      );
    });

    it('builds an appointment lookup payload and UUID-based submission key', async () => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid');

      await runSubmitFlow({
        ...mockSubmitFlow,
        action: AsyncAction.APPOINTMENT_LOOKUP,
        entry: {
          ...entry,
          data: {
            ...entry.data,
            appointmentId: 'APT-000000008',
            day: '5',
            month: '3',
            year: '1980',
          },
        },
      });

      const { submissionKey } = jest.mocked(runSubmissionStateMachine).mock
        .calls[0][0];

      expect(submissionKey).toBe(`${AsyncAction.APPOINTMENT_LOOKUP}-test-uuid`);
    });

    it.each([
      {
        description: 'preserves a recognised error status',
        error: new Error(ResponseMessage.FORM_HANDLER_ERROR),
        expectedStatus: ResponseMessage.FORM_HANDLER_ERROR,
      },
      {
        description: 'maps an unrecognised error to the generic status',
        error: new Error('unexpected failure'),
        expectedStatus: ResponseMessage.GENERIC_ERROR,
      },
      {
        description: 'maps a non-Error rejection to the generic status',
        error: 'unexpected failure',
        expectedStatus: ResponseMessage.GENERIC_ERROR,
      },
    ])('$description', async ({ error, expectedStatus }) => {
      await runSubmitFlow({ ...mockSubmitFlow, entry });
      const { resolveErrorStatus } = jest.mocked(runSubmissionStateMachine).mock
        .calls[0][0];

      expect(resolveErrorStatus(error)).toBe(expectedStatus);
    });
  });
  describe('advanceStepAndRedirect', () => {
    it('does not advance or save when the current step is the successStep ', async () => {
      entry.steps[entry.stepIndex] = StepName.CONFIRMATION;

      const result = await advanceStepAndRedirect(
        entry,
        mockSessionId,
        'en',
        AsyncAction.BOOKING_CREATE,
      );

      expect(entry.stepIndex).toBe(1);
      expect(resolveNextSteps).not.toHaveBeenCalled();
      expect(setStoreEntry).not.toHaveBeenCalled();
      expect(result).toEqual({
        redirect: {
          destination: `/en/${StepName.CONFIRMATION}`,
          permanent: false,
        },
      });
    });

    it('runs mergeAppointmentIntoEntryData when action is APPOINTMENT_LOOKUP and appointment is found', async () => {
      entry.meta = {
        submissionState: SubmissionState.SUCCEEDED,
        responseData: {
          appointment: mockAppointmentResponse.appointment,
        },
      };

      await advanceStepAndRedirect(
        entry,
        mockSessionId,
        'en',
        AsyncAction.APPOINTMENT_LOOKUP,
      );

      expect(entry.data).toEqual(
        mergeAppointmentIntoEntryData(
          entry,
          mockAppointmentResponse.appointment,
        ),
      );
      expect(setStoreEntry).toHaveBeenCalledWith(mockSessionId, entry);
    });
  });
  describe('mergeAppointmentIntoEntryData', () => {
    it('merges appointment details into entry data correctly', () => {
      const result = mergeAppointmentIntoEntryData(
        entry,
        mockAppointmentResponse.appointment,
      );

      expect(result).toEqual({
        ...entry.data,
        ...mockAppointmentResponse.appointment,
        isDoubleSlot: 'false',
        isBslRequired: 'false',
        isInterpreterRequired: 'false',
        flow: 'pw',
      });
    });
  });
});
