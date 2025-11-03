import { CHANGE_ANSWER_API } from 'CONSTANTS';
import { creditRejectionText, Section } from 'data/change-options';
import { creditRejectionQuestions } from 'data/questions';

import { ChangeAnswers } from '@maps-react/form/components/ChangeAnswers';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { CreditRejection, getServerSidePropsDefault } from '.';

type Props = {
  storedData: DataFromQuery;
  data: string;
  links: ToolLinks;
  lang: string;
  isEmbed: boolean;
};

const ChangeOptions = ({ storedData, data, links, lang, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();
  const qs = creditRejectionQuestions(z);

  addPage([
    {
      page: {
        pageName: 'credit-rejection--change-options',
        pageTitle: z({
          en: 'Check your answers',
          cy: 'Edrychwch dros eich atebion',
        }),
        categoryLevels: ['Everyday money', 'Credit'],
      },
      tool: {
        toolName: 'Credit Rejection',
        toolStep: 9,
        stepName: 'Check your answers',
      },
      event: 'pageLoadReact',
    },
  ]);

  return (
    <CreditRejection step="change" isEmbed={isEmbed}>
      <ChangeAnswers
        storedData={storedData}
        data={data}
        questions={qs}
        dataPath=""
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
