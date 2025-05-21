import { ChangeAnswers } from 'components/ChangeAnswers';
import { APIS } from 'CONSTANTS';
import { MANAnalytics } from 'data/analytics/analytics';
import { confirmStepData } from 'data/analytics/stepData';
import { FORM_FIELDS } from 'data/questions/types';
import { getConfirmQuestions } from 'utils/getConfirmQuestions';
import { FLOW } from 'utils/getQuestions';

import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const ConfirmAnswers = ({
  storedData,
  cookieData,
  lang,
  currentFlow,
  links,
  userId,
  csrfToken,
}: BaseProps) => {
  const { z } = useTranslation();
  const qs = getConfirmQuestions(currentFlow, z, cookieData, lang);

  const submit_api =
    currentFlow === FLOW.TELEPHONE
      ? `/${APIS.SUBMIT_TELEPHONE_FLOW}`
      : `/${APIS.SUBMIT_ONLINE_FLOW}`;

  const currentStep = currentFlow === FLOW.TELEPHONE ? 10 : 4;

  return (
    <MoneyAdviserNetwork step="refer">
      <Analytics
        analyticsData={MANAnalytics(
          z,
          10,
          confirmStepData(z),
          currentFlow,
          userId,
        )}
        currentStep={currentStep}
        formData={storedData}
      >
        <ChangeAnswers
          storedData={{ ...storedData, ...cookieData }}
          urlData={JSON.stringify({ ...storedData })}
          cookieData={JSON.stringify({ ...cookieData })}
          questions={qs}
          text={z({
            en: 'You can change the answers if you need to.',
            cy: 'Gallwch newid yr atebion os oes angen.',
          })}
          actionText={z({ en: 'Submit', cy: 'Cyflwyno' })}
          CHANGE_ANSWER_API={`/${APIS.CHANGE_ANSWER}`}
          SUBMIT_API={submit_api}
          backLink={links.change.backLink}
          lang={lang}
          currentFlow={currentFlow}
          displayImmediateCallbackNotification={
            currentFlow === FLOW.TELEPHONE &&
            cookieData[FORM_FIELDS.whenToSpeak]?.value === '0'
          }
          csrfToken={csrfToken}
        />
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default ConfirmAnswers;

export const getServerSideProps = getServerSidePropsDefault;
