import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { buildUpdatePayloadFromInputs } from 'lib/account/buildUpdatePayloadFromInputs';
import { isCustomerContactConfirmed } from 'lib/account/firmSectionStatus';
import { buildDraftOfficeUpdatePatch } from 'lib/account/selfServeEditDraft';
import { parseIsChangeAnswer } from 'lib/account/shared/parseIsChangeAnswer';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared/resolveAccountFirmById';
import { updateFirm } from 'lib/firms/updateFirm';
import { IronSessionObject } from 'types/iron-session';
import { CustomInputValidation, FieldType } from 'types/register';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { errorFormat } from 'utils/api/errorFormat/errorFormat';
import { respond } from 'utils/api/respond/respond';
import { validateFormFields } from 'utils/validation/validateFormFields';
import { ValidationInput } from 'utils/validation/validateFormFields/validateFormFields';

export interface FormHandlerConfig {
  inputs: {
    key: string;
    type: FieldType;
    dataPath?: string;
    required?: boolean;
    customValidation?: CustomInputValidation;
  }[];
  currentRoute: string;
  nextRoute: string;
  changeAnswerRoute: string;
  overwriteFormFields?: Record<string, string | boolean>;
  preValidate?: (
    body: Record<string, string>,
    inputs: FormHandlerConfig['inputs'],
  ) => FormHandlerConfig['inputs'];
}

const resolveRoute = (route: string, firmId: string): string => {
  return firmId ? `${route}/${firmId}` : route;
};

const buildValidationPayload = (
  body: Record<string, string>,
  inputs: FormHandlerConfig['inputs'],
) => {
  return inputs.reduce((acc: ValidationInput, input) => {
    const compareToField = input.customValidation?.compareTo;
    const customValidation = input.customValidation
      ? {
          ...input.customValidation,
          compareToValue: compareToField && body[compareToField],
        }
      : undefined;

    acc[input.key] = {
      value: body[input.key],
      type: input.type,
      required: input.required ?? true, // true as default
      customValidation,
    };
    return acc;
  }, {});
};

type ApplyFirmUpdateArgs = {
  req: NextApiRequest;
  res: NextApiResponse;
  session: IronSessionObject;
  firmId: string;
  updateRecord: Record<string, unknown>;
  currentRoute: string;
  stageInDraft: boolean;
  resolvedFirm: TravelInsuranceFirmDocument | null;
};

async function applyFirmUpdate({
  req,
  res,
  session,
  firmId,
  updateRecord,
  currentRoute,
  stageInDraft,
  resolvedFirm,
}: ApplyFirmUpdateArgs): Promise<boolean> {
  let targetDbId = session.db_id;

  if (firmId) {
    if (!resolvedFirm) {
      respond(req, res, {
        status: 404,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: '/account',
      });
      return false;
    }
    targetDbId = firmId;
  }

  if (!targetDbId) {
    respond(req, res, {
      status: 400,
      data: errorFormat({ apiError: { error: 'general_error' } }),
      redirect: `${currentRoute}?error=apiError`,
    });
    return false;
  }

  let patch: Record<string, unknown> = updateRecord;

  if (stageInDraft) {
    if (!resolvedFirm) {
      respond(req, res, {
        status: 400,
        data: errorFormat({ apiError: { error: 'general_error' } }),
        redirect: `${currentRoute}?error=apiError`,
      });
      return false;
    }
    patch = buildDraftOfficeUpdatePatch(resolvedFirm, updateRecord);
  }

  const updateResult = await updateFirm(targetDbId, patch);

  if (!updateResult.success) {
    respond(req, res, {
      status: 500,
      data: errorFormat({ apiError: { error: 'general_error' } }),
      redirect: currentRoute,
    });
    return false;
  }

  return true;
}

export const createFormHandler = ({
  inputs,
  currentRoute,
  nextRoute,
  changeAnswerRoute,
  overwriteFormFields,
  preValidate, // allows custom validation override
}: FormHandlerConfig): NextApiHandler => {
  return async (
    req: NextApiRequest & { session: IronSessionObject },
    res: NextApiResponse,
  ) => {
    if (req.method !== 'POST') return res.status(405).end();

    const session = req.session;
    const isChangeAnswer = parseIsChangeAnswer(req);

    try {
      const { firmId, ...formFields } = req.body;

      const resolvedCurrentRoute = resolveRoute(currentRoute, firmId);
      const successRoute = isChangeAnswer ? changeAnswerRoute : nextRoute;
      const resolvedNextRoute = resolveRoute(successRoute, firmId);

      const formBodyFields = overwriteFormFields ?? req.body;

      const activeInputs = preValidate
        ? preValidate(formBodyFields, inputs)
        : inputs;

      const validationPayload = buildValidationPayload(
        formBodyFields,
        activeInputs,
      );

      const fcaNumber = session?.fcaData?.frnNumber;
      const report = await validateFormFields(validationPayload, fcaNumber);

      if (!report.ok) {
        return respond(req, res, {
          status: 400,
          data: { ...report },
          redirect: resolvedCurrentRoute,
        });
      }

      const updateRecord = buildUpdatePayloadFromInputs(
        overwriteFormFields ?? formFields,
        inputs,
      );

      if (updateRecord) {
        let resolvedFirm: TravelInsuranceFirmDocument | null = null;

        if (firmId) {
          const resolved = await resolveAccountFirmById(session, firmId);
          if (!resolved) {
            respond(req, res, {
              status: 404,
              data: errorFormat({ page: { error: 'general_error' } }),
              redirect: '/account',
            });
            return;
          }
          resolvedFirm = resolved.firm;
        }

        const stageInDraft =
          resolvedFirm != null && isCustomerContactConfirmed(resolvedFirm);

        const isUpdateSuccessful = await applyFirmUpdate({
          req,
          res,
          session,
          firmId,
          updateRecord,
          currentRoute: resolvedCurrentRoute,
          stageInDraft,
          resolvedFirm,
        });

        if (!isUpdateSuccessful) {
          return respond(req, res, {
            status: 500,
            data: errorFormat({ apiError: { error: 'general_error' } }),
            redirect: resolvedCurrentRoute,
          });
        }
      }

      return respond(req, res, {
        data: {
          success: true,
          nextPath: resolvedNextRoute,
          data: session.firmData,
        },
        redirect: resolvedNextRoute,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
