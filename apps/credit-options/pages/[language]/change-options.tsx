import { CHANGE_ANSWER_API } from 'CONSTANTS';
import { creditOptionsText, Section } from 'data/change-options';
import { creditOptionsQuestions } from 'data/questions';

import { ChangeAnswers } from '@maps-react/form/components/ChangeAnswers';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { CreditOptions, getServerSidePropsDefault } from '.';

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
  const qs = creditOptionsQuestions(z);

  addPage([
    {
      page: {
        pageName: 'credit-options--change-options',
        pageTitle: z({
          en: 'Check your answers',
          cy: 'Edrychwch dros eich atebion',
        }),
        categoryLevels: ['Everyday money', 'Credit'],
      },
      tool: {
        toolName: 'Credit Options',
        toolStep: 7,
        stepName: 'Check your answers',
      },
      event: 'pageLoadReact',
    },
  ]);

  return (
    <CreditOptions step="change" isEmbed={isEmbed}>
      <ChangeAnswers
        storedData={storedData}
        data={data}
        questions={qs}
        text={creditOptionsText(z, Section.CheckAnswers)}
        nextLink={links.change.nextLink}
        CHANGE_ANSWER_API={CHANGE_ANSWER_API}
        backLink={links.change.backLink}
        actionText={creditOptionsText(z, Section.ChangeAnswersNextPageText)}
        lang={lang}
        isEmbed={isEmbed}
      />
    </CreditOptions>
  );
};

export default ChangeOptions;

export const getServerSideProps = getServerSidePropsDefault;
