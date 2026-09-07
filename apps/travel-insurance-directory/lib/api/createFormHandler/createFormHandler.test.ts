import { NextApiRequest, NextApiResponse } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { buildUpdatePayloadFromInputs } from 'lib/account/buildUpdatePayloadFromInputs';
import { isCustomerContactConfirmed } from 'lib/account/firmSectionStatus';
import { buildDraftOfficeUpdatePatch } from 'lib/account/selfServeEditDraft';
import { parseIsChangeAnswer } from 'lib/account/shared/parseIsChangeAnswer';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond/respond';
import { validateFormFields } from 'utils/validation/validateFormFields';

import { createFormHandler, FormHandlerConfig } from './createFormHandler';

// --- Mocks ---

jest.mock('utils/validation/validateFormFields');
jest.mock('utils/api/respond/respond');
jest.mock('lib/account/buildUpdatePayloadFromInputs');
jest.mock('lib/account/shared/parseIsChangeAnswer');
jest.mock('lib/account/tripCover/shared/resolveAccountFirmById');
jest.mock('lib/firms/updateFirm');

// New Draft Dependency Mocks
jest.mock('lib/account/firmSectionStatus', () => ({
  isCustomerContactConfirmed: jest.fn(),
}));
jest.mock('lib/account/selfServeEditDraft', () => ({
  buildDraftOfficeUpdatePatch: jest.fn(),
}));

const mockContainer = {};
const mockDatabase = {
  container: jest.fn().mockReturnValue(mockContainer),
};
const mockClient = {
  database: jest.fn().mockReturnValue(mockDatabase),
};

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => mockClient),
}));

const mockedValidateFormFields = validateFormFields as jest.MockedFunction<
  typeof validateFormFields
>;
const mockedRespond = respond as jest.MockedFunction<typeof respond>;
const mockedBuildUpdatePayload =
  buildUpdatePayloadFromInputs as jest.MockedFunction<
    typeof buildUpdatePayloadFromInputs
  >;
const mockedParseIsChangeAnswer = parseIsChangeAnswer as jest.MockedFunction<
  typeof parseIsChangeAnswer
>;
const mockedResolveAccountFirmById =
  resolveAccountFirmById as jest.MockedFunction<typeof resolveAccountFirmById>;
const mockedUpdateFirm = updateFirm as jest.MockedFunction<typeof updateFirm>;

const mockedIsCustomerContactConfirmed =
  isCustomerContactConfirmed as jest.MockedFunction<
    typeof isCustomerContactConfirmed
  >;
const mockedBuildDraftOfficeUpdatePatch =
  buildDraftOfficeUpdatePatch as jest.MockedFunction<
    typeof buildDraftOfficeUpdatePatch
  >;

// --- Helper Types & Factories ---

type MockRequestOptions = {
  method?: string;
  body?: Record<string, unknown>;
  session?: Partial<IronSessionObject>;
};

const createMockRequest = ({
  method = 'POST',
  body = { name: 'Test Firm' },
  session = {},
}: MockRequestOptions = {}): NextApiRequest & { session: IronSessionObject } =>
  ({
    method,
    body,
    session: {
      db_id: 'user-db-123',
      firmData: { firmName: 'Test Firm Ltd' },
      fcaData: { frnNumber: 'FRN123456' },
      ...session,
    },
  } as unknown as NextApiRequest & { session: IronSessionObject });

const createMockResponse = (): NextApiResponse => {
  const res = {} as NextApiResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

// --- Test Suite ---

describe('createFormHandler', () => {
  const defaultConfig: FormHandlerConfig = {
    inputs: [{ key: 'name', type: 'text', required: true }],
    currentRoute: '/current',
    nextRoute: '/next',
    changeAnswerRoute: '/confirm',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedParseIsChangeAnswer.mockReturnValue(false);
    mockedIsCustomerContactConfirmed.mockReturnValue(false);
    // Pass-through behavior by default
    mockedBuildDraftOfficeUpdatePatch.mockImplementation(
      (firm, patch) => patch,
    );
  });

  describe('HTTP Method Guard', () => {
    test.each`
      method
      ${'GET'}
      ${'PUT'}
      ${'DELETE'}
      ${'PATCH'}
    `(
      'returns 405 Method Not Allowed for non-POST method $method',
      async ({ method }) => {
        const handler = createFormHandler(defaultConfig);
        const req = createMockRequest({ method });
        const res = createMockResponse();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.end).toHaveBeenCalled();
        expect(mockedValidateFormFields).not.toHaveBeenCalled();
      },
    );
  });

  describe('Route Resolution & Success Navigation', () => {
    test.each`
      isChangeAnswer | firmId       | expectedNextRoute     | expectedCurrentRoute
      ${false}       | ${undefined} | ${'/next'}            | ${'/current'}
      ${true}        | ${undefined} | ${'/confirm'}         | ${'/current'}
      ${false}       | ${'firm-99'} | ${'/next/firm-99'}    | ${'/current/firm-99'}
      ${true}        | ${'firm-99'} | ${'/confirm/firm-99'} | ${'/current/firm-99'}
    `(
      'routes correctly when isChangeAnswer=$isChangeAnswer and firmId=$firmId',
      async ({ isChangeAnswer, firmId, expectedNextRoute }) => {
        mockedParseIsChangeAnswer.mockReturnValue(isChangeAnswer);
        mockedValidateFormFields.mockResolvedValue({
          ok: true,
          fields: {},
          error: false,
        });
        mockedBuildUpdatePayload.mockReturnValue({ name: 'Test Firm' });
        mockedUpdateFirm.mockResolvedValue({ success: true, response: {} });

        if (firmId) {
          mockedResolveAccountFirmById.mockResolvedValue({
            firm: { id: firmId }, // Ensure .firm exists so it doesn't fail the !resolvedFirm check
            isTrading: false,
          } as unknown as Awaited<ReturnType<typeof resolveAccountFirmById>>);
        }

        const handler = createFormHandler(defaultConfig);
        const req = createMockRequest({
          body: { name: 'Test Firm', ...(firmId && { firmId }) },
        });
        const res = createMockResponse();

        await handler(req, res);

        expect(mockedRespond).toHaveBeenCalledWith(
          req,
          res,
          expect.objectContaining({
            data: expect.objectContaining({
              success: true,
              nextPath: expectedNextRoute,
            }),
            redirect: expectedNextRoute,
          }),
        );
      },
    );
  });

  describe('Validation Flow', () => {
    it('passes fcaNumber and constructed payload to validateFormFields', async () => {
      mockedValidateFormFields.mockResolvedValue({
        ok: true,
        fields: {},
        error: false,
      });

      const handler = createFormHandler(defaultConfig);
      const req = createMockRequest({
        body: { name: 'New Name' },
        session: { fcaData: { frnNumber: 'FRN999888' } },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(mockedValidateFormFields).toHaveBeenCalledWith(
        {
          name: {
            value: 'New Name',
            type: 'text',
            required: true,
            customValidation: undefined,
          },
        },
        'FRN999888',
      );
    });

    it('responds with 400 when validation fails', async () => {
      const validationError = {
        ok: false,
        fields: { name: { error: 'required' as const } },
        error: true,
      };
      mockedValidateFormFields.mockResolvedValue(validationError);

      const handler = createFormHandler(defaultConfig);
      const req = createMockRequest({ body: { name: '' } });
      const res = createMockResponse();

      await handler(req, res);

      expect(mockedRespond).toHaveBeenCalledWith(req, res, {
        status: 400,
        data: validationError,
        redirect: '/current',
      });

      expect(mockedBuildUpdatePayload).not.toHaveBeenCalled();
    });

    it('applies custom compareToValue during payload construction', async () => {
      mockedValidateFormFields.mockResolvedValue({
        ok: true,
        fields: {},
        error: false,
      });

      const configWithComparison: FormHandlerConfig = {
        ...defaultConfig,
        inputs: [
          {
            key: 'endDate',
            type: 'text',
            customValidation: { compareTo: 'startDate' },
          },
        ],
      };

      const handler = createFormHandler(configWithComparison);
      const req = createMockRequest({
        body: { startDate: '2026-01-01', endDate: '2026-01-02' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(mockedValidateFormFields).toHaveBeenCalledWith(
        expect.objectContaining({
          endDate: expect.objectContaining({
            customValidation: expect.objectContaining({
              compareToValue: '2026-01-01',
            }),
          }),
        }),
        'FRN123456',
      );
    });

    it('executes preValidate modifier when provided in config', async () => {
      mockedValidateFormFields.mockResolvedValue({
        ok: true,
        fields: {},
        error: false,
      });

      const preValidateSpy = jest
        .fn()
        .mockImplementation((body, inputs) => [
          ...inputs,
          { key: 'extraField', type: 'text', required: false },
        ]);

      const handler = createFormHandler({
        ...defaultConfig,
        preValidate: preValidateSpy,
      });

      const req = createMockRequest({
        body: { name: 'Test', extraField: 'Bonus' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(preValidateSpy).toHaveBeenCalled();
      expect(mockedValidateFormFields).toHaveBeenCalledWith(
        expect.objectContaining({
          extraField: expect.objectContaining({ value: 'Bonus' }),
        }),
        'FRN123456',
      );
    });
  });

  describe('Firm Resolution & Database Update Failures', () => {
    test.each`
      scenario                     | resolveFirmResult               | updateResult          | dbId          | expectedStatus | expectedRedirect
      ${'firm not found'}          | ${null}                         | ${null}               | ${'firm-123'} | ${404}         | ${'/account'}
      ${'update database failure'} | ${{ firm: { id: 'firm-123' } }} | ${{ success: false }} | ${'firm-123'} | ${500}         | ${'/current/firm-123'}
    `(
      'handles $scenario correctly',
      async ({
        resolveFirmResult,
        updateResult,
        dbId,
        expectedStatus,
        expectedRedirect,
      }) => {
        mockedValidateFormFields.mockResolvedValue({
          ok: true,
          fields: {},
          error: false,
        });
        mockedBuildUpdatePayload.mockReturnValue({ name: 'Updated Name' });

        if (dbId) {
          mockedResolveAccountFirmById.mockResolvedValue(resolveFirmResult);
        }

        if (updateResult) {
          mockedUpdateFirm.mockResolvedValue(updateResult);
        }

        const handler = createFormHandler(defaultConfig);
        const req = createMockRequest({
          body: { name: 'Updated Name', ...(dbId && { firmId: dbId }) },
          session: { db_id: dbId ? '' : 'session-user-id' },
        });
        const res = createMockResponse();

        await handler(req, res);

        expect(mockedRespond).toHaveBeenCalledWith(
          req,
          res,
          expect.objectContaining({
            status: expectedStatus,
            redirect: expectedRedirect,
          }),
        );
      },
    );
  });

  describe('Overrides and Edge Cases', () => {
    it('uses overwriteFormFields if configured', async () => {
      mockedValidateFormFields.mockResolvedValue({
        ok: true,
        fields: {},
        error: false,
      });
      mockedBuildUpdatePayload.mockReturnValue({ name: 'Overridden Value' });
      mockedUpdateFirm.mockResolvedValue({ success: true, response: {} });

      const overwriteFormFields = { name: 'Overridden Value' };
      const handler = createFormHandler({
        ...defaultConfig,
        overwriteFormFields,
      });

      const req = createMockRequest({
        body: { name: 'Original Request Body' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(mockedBuildUpdatePayload).toHaveBeenCalledWith(
        overwriteFormFields,
        defaultConfig.inputs,
      );
      expect(mockedUpdateFirm).toHaveBeenCalledWith('user-db-123', {
        name: 'Overridden Value',
      });
    });

    it('skips updateFirm execution if buildUpdatePayloadFromInputs returns null/empty', async () => {
      mockedValidateFormFields.mockResolvedValue({
        ok: true,
        fields: {},
        error: false,
      });
      mockedBuildUpdatePayload.mockReturnValue(
        null as unknown as Record<string, string>,
      );

      const handler = createFormHandler(defaultConfig);
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedRespond).toHaveBeenCalledWith(
        req,
        res,
        expect.objectContaining({
          data: expect.objectContaining({ success: true }),
        }),
      );
    });

    it('catches thrown exceptions and responds with 500 JSON error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockedValidateFormFields.mockRejectedValue(
        new Error('Unexpected Fatal Error'),
      );

      const handler = createFormHandler(defaultConfig);
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

      consoleErrorSpy.mockRestore();
    });

    it('stages office updates in self_serve_edit_draft when confirmed and isChangeAnswer is set', async () => {
      const changeReq = createMockRequest({
        body: {
          firmId: 'firm-123',
          isChangeAnswer: 'true',
          name: 'Test',
        },
      });
      const res = createMockResponse();

      mockedParseIsChangeAnswer.mockReturnValue(true);
      mockedValidateFormFields.mockResolvedValue({
        ok: true,
        fields: {},
        error: false,
      });

      mockedBuildUpdatePayload.mockReturnValue({
        'office/contact/email_address': 'new@example.com',
      });

      mockedResolveAccountFirmById.mockResolvedValue({
        firm: createMockFirm({
          id: 'firm-123',
          customer_contact_confirmed_at: '2026-07-21T12:00:00.000Z',
        }),
        isTrading: false,
      } as unknown as Awaited<ReturnType<typeof resolveAccountFirmById>>);

      // Tell our new mock that this firm IS confirmed
      mockedIsCustomerContactConfirmed.mockReturnValue(true);

      // Force the builder to return a draft payload
      mockedBuildDraftOfficeUpdatePatch.mockReturnValue({
        self_serve_edit_draft: {
          office: {
            contact: {
              email_address: 'new@example.com',
            },
          },
        },
      });

      mockedUpdateFirm.mockResolvedValue({ success: true, response: {} });

      const handler = createFormHandler(defaultConfig);
      await handler(changeReq, res);

      // Validate it uses the modified payload returned by buildDraftOfficeUpdatePatch
      expect(mockedUpdateFirm).toHaveBeenCalledWith(
        'firm-123',
        expect.objectContaining({
          self_serve_edit_draft: expect.objectContaining({
            office: expect.objectContaining({
              contact: expect.objectContaining({
                email_address: 'new@example.com',
              }),
            }),
          }),
        }),
      );

      expect(mockedRespond).toHaveBeenCalledWith(
        changeReq,
        res,
        expect.objectContaining({
          data: expect.objectContaining({
            nextPath: '/confirm/firm-123',
          }),
        }),
      );
    });
  });
});
