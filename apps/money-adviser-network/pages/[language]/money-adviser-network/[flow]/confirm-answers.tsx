import { ChangeAnswers } from 'components/ChangeAnswers';
import { APIS } from 'CONSTANTS';
import { getConfirmQuestions } from 'utils/getConfirmQuestions';
import { FLOW } from 'utils/getQuestions';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const ConfirmAnswers = ({
  storedData,
  cookieData,
  lang,
  currentFlow,
  links,
}: BaseProps) => {
  const { z } = useTranslation();
  const qs = getConfirmQuestions(currentFlow, z, cookieData, lang);
  const submit_api =
    currentFlow === FLOW.TELEPHONE
      ? `/${APIS.SUBMIT_TELEPHONE_FLOW}`
      : `/${APIS.SUBMIT_ONLINE_FLOW}`;

  return (
    <MoneyAdviserNetwork step="refer">
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
      />
    </MoneyAdviserNetwork>
  );
};

export default ConfirmAnswers;

export const getServerSideProps = getServerSidePropsDefault;
