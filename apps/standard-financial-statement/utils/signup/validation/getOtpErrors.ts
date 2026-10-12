import { QuestionOrg } from 'data/form-data/org_signup';
import { userFormOTP } from 'data/form-data/user_signup';

import useTranslation from '@maps-react/hooks/useTranslation';

export const getOtpErrors = (
  z: ReturnType<typeof useTranslation>['z'],
  response: { error: string; name: string },
  inputs: QuestionOrg[] | null[],
  email: string,
) => {
  const input = [...inputs, ...userFormOTP(z, email)].find(
    (item) => item?.name === response?.name,
  );

  if (response && input) {
    return {
      [response.name]: [`${input?.title} - ${input?.errors?.[response.error]}`],
    };
  }

  return {
    unknown: [
      z({
        en: 'An unknown error occurred',
        cy: 'Digwyddodd gwall anhysbys',
      }),
    ],
  };
};
