import { mockSessionId } from '@maps-react/mhf/mocks';
import { Language } from '@maps-react/mhf/utils';

import { AsyncAction, ResponseMessage, SubmissionState } from '../constants';
import { SubmissionEntry } from '../types';
import {
  getSubmissionStateMeta,
  isSubmissionStateStale,
  runSubmissionStateMachine,
} from './submissionStateMachine';
import { submitActionHandlerMap } from './submitHandlers';

// Minimal mocks for dependencies
const mockSetStoreEntry = jest.fn();
const mockSubmitFlowArgs = {
  key: mockSessionId,
  locale: 'en' as Language,
  entry: {} as SubmissionEntry,
};

jest.mock('@maps-react/mhf/store', () => ({
  setStoreEntry: (...args: SubmissionEntry[]) => mockSetStoreEntry(...args),
}));

const originalBookingCreateHandler =
  submitActionHandlerMap[AsyncAction.BOOKING_CREATE];

describe('submission state machine utils', () => {
  beforeEach(() => {
    mockSetStoreEntry.mockClear();
    submitActionHandlerMap[AsyncAction.BOOKING_CREATE] =
      originalBookingCreateHandler;
  });

  describe('getSubmissionStateMeta', () => {
    it('returns meta or default', () => {
      expect(
        getSubmissionStateMeta({
          meta: { submissionState: SubmissionState.SUCCEEDED },
        } as SubmissionEntry),
      ).toEqual({ submissionState: SubmissionState.SUCCEEDED });
      expect(getSubmissionStateMeta({} as SubmissionEntry)).toEqual({
        submissionState: SubmissionState.IDLE,
      });
    });
  });

  describe('isSubmissionStateStale', () => {
    it('returns true if stale', () => {
      expect(isSubmissionStateStale('')).toBe(false);
      expect(isSubmissionStateStale('invalid')).toBe(false);
      expect(
        isSubmissionStateStale(new Date(Date.now() - 31_000).toISOString()),
      ).toBe(true);
      expect(isSubmissionStateStale(new Date().toISOString())).toBe(false);
    });
  });

  describe('runSubmissionStateMachine', () => {
    describe('success redirects', () => {
      it('redirects to the success step if already succeeded', async () => {
        const entry = {
          meta: { submissionState: SubmissionState.SUCCEEDED },
          data: {},
          steps: ['find-appointment', 'loading/booking-lookup'],
          stepIndex: 1,
        } as SubmissionEntry;
        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          action: AsyncAction.BOOKING_LOOKUP,
          entry,
        });
        expect(result.redirect.destination).toContain('appointment-found');
        expect(entry.steps).toEqual([
          'find-appointment',
          'loading/booking-lookup',
          'appointment-found',
        ]);
        expect(entry.stepIndex).toBe(2);
      });

      it('does not advance again when already on the success step', async () => {
        const entry = {
          meta: { submissionState: SubmissionState.SUCCEEDED },
          data: {},
          steps: ['find-appointment', 'appointment-found'],
          stepIndex: 1,
        } as SubmissionEntry;

        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          action: AsyncAction.BOOKING_LOOKUP,
          entry,
        });

        expect(result.redirect.destination).toContain('appointment-found');
        expect(entry.steps).toEqual(['find-appointment', 'appointment-found']);
        expect(entry.stepIndex).toBe(1);
        expect(mockSetStoreEntry).not.toHaveBeenCalled();
      });

      it('submits successfully from idle and redirects to the configured success step', async () => {
        const entry = {
          meta: { submissionState: SubmissionState.IDLE },
          data: {},
          steps: ['confirm-details', 'loading/booking-create'],
          stepIndex: 1,
        } as SubmissionEntry;
        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          entry,
          action: AsyncAction.BOOKING_CREATE,
        });
        expect(result.redirect.destination).toContain('confirmation');
        expect(entry.steps).toEqual([
          'confirm-details',
          'loading/booking-create',
          'confirmation',
        ]);
        expect(entry.stepIndex).toBe(2);
        expect(mockSetStoreEntry).toHaveBeenCalledWith(
          mockSessionId,
          expect.objectContaining({
            meta: expect.objectContaining({
              submissionState: SubmissionState.SUCCEEDED,
            }),
          }),
        );
      });
    });

    describe('in-progress redirects', () => {
      it('redirects to loading if in progress and not stale', async () => {
        const entry = {
          meta: {
            submissionState: SubmissionState.IN_PROGRESS,
            submissionStartedAt: new Date().toISOString(),
          },
        } as SubmissionEntry;
        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          entry,
          action: AsyncAction.BOOKING_CREATE,
        });
        expect(result.redirect.destination).toContain('loading');
      });
    });

    describe('error redirects', () => {
      it('redirects to error if failed', async () => {
        const entry = {
          meta: { submissionState: SubmissionState.FAILED },
        } as SubmissionEntry;
        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          entry,
          action: AsyncAction.BOOKING_CREATE,
        });
        expect(result.redirect.destination).toContain('error');
        expect(result.redirect.destination).toContain(
          `status=${ResponseMessage.SUBMISSION_FAILED}`,
        );
      });

      it('marks stale in-progress as failed and redirects to error', async () => {
        const entry = {
          meta: {
            submissionState: SubmissionState.IN_PROGRESS,
            submissionStartedAt: new Date(Date.now() - 31_000).toISOString(),
          },
        } as SubmissionEntry;
        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          entry,
          action: AsyncAction.BOOKING_CREATE,
        });
        expect(result.redirect.destination).toContain('error');
        expect(result.redirect.destination).toContain(
          `status=${ResponseMessage.SUBMISSION_FAILED}`,
        );
        expect(mockSetStoreEntry).toHaveBeenCalledWith(
          mockSessionId,
          expect.objectContaining({
            meta: expect.objectContaining({
              submissionState: SubmissionState.FAILED,
            }),
          }),
        );
      });

      it('redirects to generic error for unexpected handler errors', async () => {
        // Override the BOOKING_CREATE handler to throw an unexpected error
        submitActionHandlerMap[AsyncAction.BOOKING_CREATE] = async () => {
          throw new Error('unexpected failure');
        };

        const entry = {
          meta: { submissionState: SubmissionState.IDLE },
          data: {},
        } as SubmissionEntry;

        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          entry,
          action: AsyncAction.BOOKING_CREATE,
        });

        expect(result.redirect.destination).toContain('error');
        expect(result.redirect.destination).toContain(
          `status=${ResponseMessage.GENERIC_ERROR}`,
        );
      });

      it('redirects to form handler error when action is missing', async () => {
        const entry = {
          meta: { submissionState: SubmissionState.IDLE },
          data: {},
        } as SubmissionEntry;

        const result = await runSubmissionStateMachine({
          ...mockSubmitFlowArgs,
          entry,
        });

        expect(result.redirect.destination).toContain('error');
        expect(result.redirect.destination).toContain(
          `status=${ResponseMessage.FORM_HANDLER_ERROR}`,
        );
      });
    });
  });
});
