import { NextApiRequest, NextApiResponse } from 'next';

import {
  createFormHandler,
  FormHandlerConfig,
} from 'lib/api/createFormHandler';
import routeHandler from 'pages/api/account/firm-details/opening-hours';

// --- Mocks ---

jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: <T>(handler: T): T => handler,
}));

const mockInnerHandler = jest.fn();

jest.mock('lib/api/createFormHandler', () => ({
  createFormHandler: jest.fn(() => mockInnerHandler),
}));

jest.mock('data/pages/account/firm-details/confirm-details', () => ({
  confirmDetailsPage: { currentRoute: '/confirm-details' },
}));

jest.mock('data/pages/account/firm-details/opening-hours', () => ({
  amPmRadioField: { key: 'am_pm' },
  openingHoursPage: {
    currentRoute: '/opening-hours',
    nextStep: '/firm-summary',
  },
  openingTimeField: { key: 'opening_time', type: 'hour_min', required: true },
  openingAmPmRadioField: {
    key: 'opening_time_am_pm',
    type: 'radio',
    required: true,
  },
  closingTimeField: { key: 'closing_time', type: 'hour_min', required: true },
  closingAmPmRadioField: {
    key: 'closing_time_am_pm',
    type: 'radio',
    required: true,
  },
  saturdayOpeningRadioField: {
    key: 'saturday_opening',
    type: 'radio',
    required: true,
  },
  saturdayOpeningField: {
    key: 'saturday_opening_time',
    type: 'hour_min',
    required: true,
  },
  saturdayOpeningAmPmRadioField: {
    key: 'saturday_opening_time_am_pm',
    type: 'radio',
    required: true,
  },
  saturdayClosingField: {
    key: 'saturday_closing_time',
    type: 'hour_min',
    required: true,
  },
  saturdayClosingAmPmRadioField: {
    key: 'saturday_closing_time_am_pm',
    type: 'radio',
    required: true,
  },
  sundayOpeningRadioField: {
    key: 'sunday_opening',
    type: 'radio',
    required: true,
  },
  sundayOpeningField: {
    key: 'sunday_opening_time',
    type: 'hour_min',
    required: true,
  },
  sundayOpeningAmPmRadioField: {
    key: 'sunday_opening_time_am_pm',
    type: 'radio',
    required: true,
  },
  sundayClosingField: {
    key: 'sunday_closing_time',
    type: 'hour_min',
    required: true,
  },
  sundayClosingAmPmRadioField: {
    key: 'sunday_closing_time_am_pm',
    type: 'radio',
    required: true,
  },
}));

// --- Helper Functions ---

const createMockRequest = (
  body: Record<string, unknown> = {},
): NextApiRequest => ({ body } as NextApiRequest);

const createMockResponse = (): NextApiResponse => ({} as NextApiResponse);

// --- Test Suite ---

describe('Opening Hours Route Handler', () => {
  const mockedCreateFormHandler = createFormHandler as jest.MockedFunction<
    typeof createFormHandler
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInnerHandler.mockResolvedValue(undefined);
  });

  describe('Form Handler Initialization & Route Binding', () => {
    it('initializes createFormHandler with correct route parameters', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await routeHandler(req, res);

      expect(mockedCreateFormHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          currentRoute: '/opening-hours',
          nextRoute: '/firm-summary',
          changeAnswerRoute: '/confirm-details',
        }),
      );
      expect(mockInnerHandler).toHaveBeenCalledWith(req, res);
    });
  });

  describe('Time Formatting & 24-Hour Conversion', () => {
    test.each`
      hourInput | minInput | amPmInput | expectedFormatted
      ${'9'}    | ${'00'}  | ${'am'}   | ${'09:00'}
      ${'9'}    | ${'30'}  | ${'pm'}   | ${'21:30'}
      ${'12'}   | ${'00'}  | ${'am'}   | ${'00:00'}
      ${'12'}   | ${'15'}  | ${'pm'}   | ${'12:15'}
      ${'1'}    | ${'5'}   | ${'pm'}   | ${'13:05'}
    `(
      'formats $hourInput:$minInput $amPmInput to 24-hour time "$expectedFormatted"',
      async ({ hourInput, minInput, amPmInput, expectedFormatted }) => {
        const req = createMockRequest({
          opening_time_hours: hourInput,
          opening_time_minutes: minInput,
          opening_time_am_pm: amPmInput,
        });
        const res = createMockResponse();

        await routeHandler(req, res);

        const config = mockedCreateFormHandler.mock.calls[0][0];
        const overwriteFields = config.overwriteFormFields;

        expect(overwriteFields?.['opening_time']).toBe(expectedFormatted);
      },
    );

    it('retains non-time body fields untouched in overwriteFormFields', async () => {
      const req = createMockRequest({
        firmName: 'My Advisory Firm',
        satRadio: 'no',
        opening_time_hours: '9',
        opening_time_minutes: '00',
        opening_time_am_pm: 'am',
      });
      const res = createMockResponse();

      await routeHandler(req, res);

      const config = mockedCreateFormHandler.mock.calls[0][0];
      const overwriteFields = config.overwriteFormFields;

      expect(overwriteFields?.['firmName']).toBe('My Advisory Firm');
      expect(overwriteFields?.['satRadio']).toBe('no');
      expect(overwriteFields?.['opening_time']).toBe('09:00');
    });
  });

  describe('Weekend Dynamic Requirement Rules (preValidate)', () => {
    test.each`
      day           | radioKey              | radioValue   | targetFieldKey             | expectedRequired
      ${'Saturday'} | ${'saturday_opening'} | ${'yes'}     | ${'saturday_opening_time'} | ${true}
      ${'Saturday'} | ${'saturday_opening'} | ${'YES'}     | ${'saturday_opening_time'} | ${true}
      ${'Saturday'} | ${'saturday_opening'} | ${'no'}      | ${'saturday_opening_time'} | ${false}
      ${'Saturday'} | ${'saturday_opening'} | ${''}        | ${'saturday_opening_time'} | ${false}
      ${'Saturday'} | ${'saturday_opening'} | ${undefined} | ${'saturday_opening_time'} | ${false}
      ${'Sunday'}   | ${'sunday_opening'}   | ${'yes'}     | ${'sunday_closing_time'}   | ${true}
      ${'Sunday'}   | ${'sunday_opening'}   | ${'no'}      | ${'sunday_closing_time'}   | ${false}
    `(
      'sets $targetFieldKey required=$expectedRequired when $day radio ($radioKey) is "$radioValue"',
      async ({ radioKey, radioValue, targetFieldKey, expectedRequired }) => {
        const req = createMockRequest({ [radioKey]: radioValue });
        const res = createMockResponse();

        await routeHandler(req, res);

        const config: FormHandlerConfig =
          mockedCreateFormHandler.mock.calls[0][0];
        const preValidateFn = config.preValidate;

        expect(preValidateFn).toBeDefined();

        if (preValidateFn) {
          const processedInputs = preValidateFn(
            req.body as Record<string, string>,
            config.inputs,
          );

          const targetInput = processedInputs.find(
            (input: FormHandlerConfig['inputs'][number]) =>
              input.key === targetFieldKey,
          );

          expect(targetInput?.required).toBe(expectedRequired);
        }
      },
    );

    it('leaves standard weekday input requirements unchanged in preValidate', async () => {
      const req = createMockRequest({
        saturday_opening: 'no',
        sunday_opening: 'no',
      });
      const res = createMockResponse();

      await routeHandler(req, res);

      const config: FormHandlerConfig =
        mockedCreateFormHandler.mock.calls[0][0];
      const preValidateFn = config.preValidate;

      if (preValidateFn) {
        const processedInputs = preValidateFn(
          req.body as Record<string, string>,
          config.inputs,
        );

        const openingTimeInput = processedInputs.find(
          (input: FormHandlerConfig['inputs'][number]) =>
            input.key === 'opening_time',
        );

        expect(openingTimeInput?.required).toBe(true);
      }
    });
  });
});
