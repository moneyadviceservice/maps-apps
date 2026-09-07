import { NextApiRequest, NextApiResponse } from 'next/types';

import { confirmDetailsPage } from 'data/pages/account/firm-details/confirm-details';
import {
  amPmRadioField,
  closingAmPmRadioField,
  closingTimeField,
  openingAmPmRadioField,
  openingHoursPage,
  openingTimeField,
  saturdayClosingAmPmRadioField,
  saturdayClosingField,
  saturdayOpeningAmPmRadioField,
  saturdayOpeningField,
  saturdayOpeningRadioField,
  sundayClosingAmPmRadioField,
  sundayClosingField,
  sundayOpeningAmPmRadioField,
  sundayOpeningField,
  sundayOpeningRadioField,
} from 'data/pages/account/firm-details/opening-hours';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { createFormHandler } from 'lib/api/createFormHandler';

const convertTo24Hour = (value: string | boolean, am_pm: string | boolean) => {
  const rawHoursValue =
    typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;

  const baseHour = rawHoursValue % 12;

  return am_pm === 'am' ? baseHour : baseHour + 12;
};

const formatTimeFields = (
  body: Record<string, string | boolean>,
): Record<string, string | boolean> => {
  const transformedData: Record<string, string | boolean> = {};

  for (const key of Object.keys(body)) {
    if (key.endsWith('_hours')) {
      const baseKey = key.replace('_hours', '');

      const am_pm = body[`${baseKey}_${amPmRadioField.key}`];
      const hours = convertTo24Hour(body[key], am_pm);
      const minutes = body[`${baseKey}_minutes`];

      if (hours || minutes) {
        const formattedHours = String(hours).trim().padStart(2, '0');
        const formattedMinutes = String(minutes).trim().padStart(2, '0');

        transformedData[baseKey] = `${formattedHours}:${formattedMinutes}`;
      }
    } else if (!key.endsWith('_hours') && !key.endsWith('_minutes')) {
      if (!(key in transformedData)) {
        transformedData[key] = body[key];
      }
    }
  }

  return transformedData;
};

const routeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const overwrittenFields = formatTimeFields(req.body);

  const dynamicInputs = [
    openingTimeField,
    openingAmPmRadioField,
    closingTimeField,
    closingAmPmRadioField,
    saturdayOpeningRadioField,
    saturdayOpeningField,
    saturdayOpeningAmPmRadioField,
    saturdayClosingField,
    saturdayClosingAmPmRadioField,
    sundayOpeningRadioField,
    sundayOpeningField,
    sundayOpeningAmPmRadioField,
    sundayClosingField,
    sundayClosingAmPmRadioField,
  ];

  const handler = createFormHandler({
    inputs: dynamicInputs,
    currentRoute: openingHoursPage.currentRoute,
    nextRoute: openingHoursPage.nextStep,
    changeAnswerRoute: confirmDetailsPage.currentRoute,
    overwriteFormFields: overwrittenFields,
    preValidate: (body, inputs) =>
      inputs.map((input) => {
        if (
          input.key === saturdayOpeningField.key ||
          input.key === saturdayClosingField.key ||
          input.key === saturdayOpeningAmPmRadioField.key ||
          input.key === saturdayClosingAmPmRadioField.key
        ) {
          const satRadioValue = body[saturdayOpeningRadioField.key];

          // Only required if saturdayOpeningRadioField is 'yes'
          if (satRadioValue?.toLowerCase() !== 'yes') {
            return { ...input, required: false };
          }
        }
        if (
          input.key === sundayOpeningField.key ||
          input.key === sundayClosingField.key ||
          input.key === sundayOpeningAmPmRadioField.key ||
          input.key === sundayClosingAmPmRadioField.key
        ) {
          const sunRadioValue = body[sundayOpeningRadioField.key];

          // Only required if sundayOpeningRadioField is 'yes'
          if (sunRadioValue?.toLowerCase() !== 'yes') {
            return { ...input, required: false };
          }
        }

        return input;
      }),
  });

  return handler(req, res);
};

export default withAccountSession(routeHandler);
