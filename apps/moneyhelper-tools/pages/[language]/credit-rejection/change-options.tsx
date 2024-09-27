import { ChangeAnswers } from 'components/ChangeAnswers';
import { CreditRejection, getServerSidePropsDefault } from '.';
import { creditRejectionAnalytics as analyticsData } from 'data/form-content/analytics';
import {
  creditRejectionText,
  Section,
} from 'data/form-content/text/credit-rejection';
import { DataPath } from 'types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { useAnalytics } from 'hooks/useAnalytics';
import { CHANGE_ANSWER_API } from 'CONSTANTS';
import { getQuestions } from 'utils/getQuestions';
import { DataFromQuery } from 'utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';

type Props = {
  storedData: DataFromQuery;
  data: string;
  dataPath: DataPath;
  links: ToolLinks;
  lang: string;
  isEmbed: boolean;
};

const ChangeOptions = ({
  storedData,
  data,
  dataPath,
  links,
  lang,
  isEmbed,
}: Props) => {
  const { z } = useTranslation();
  const { addStepPage } = useAnalytics();

  const qs = getQuestions(z, dataPath);

  addStepPage(analyticsData, 'change', 'Check your answers');

  return (
    <CreditRejection step="change" isEmbed={isEmbed}>
      <ChangeAnswers
        storedData={storedData}
        data={data}
        questions={qs}
        dataPath={dataPath}
        text={creditRejectionText(z, Section.CheckAnswers)}
        nextLink={links.change.nextLink}
        CHANGE_ANSWER_API={CHANGE_ANSWER_API}
        backLink={links.change.backLink}
        actionText={creditRejectionText(z, Section.ChangeAnswersNextPageText)}
        lang={lang}
        isEmbed={isEmbed}
      />
    </CreditRejection>
  );
};

export default ChangeOptions;

export const getServerSideProps = getServerSidePropsDefault;
