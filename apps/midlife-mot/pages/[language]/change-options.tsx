import { CHANGE_ANSWER_API } from 'CONSTANTS';
import { DataPath } from 'types';

import { ChangeAnswers } from '@maps-react/form/components/ChangeAnswers';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { midLifeMotQuestions } from '../../data/form-content/questions/mid-life-mot';
import {
  midLifeMotText,
  Section,
} from '../../data/form-content/text/mid-life-mot';
import { getServerSidePropsDefault, MidLifeMot } from './';

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
  const { addPage } = useAnalytics();
  const qs = midLifeMotQuestions(z);

  addPage([
    {
      page: {
        pageName: 'midlife-mot--change-options',
        pageTitle: z({
          en: 'Check your answers',
          cy: 'Edrychwch dros eich atebion',
        }),
      },
      tool: {
        toolName: 'Midlife MOT',
        toolStep: 19,
        stepName: 'Check your answers',
      },
      event: 'pageLoadReact',
    },
  ]);

  return (
    <MidLifeMot step="change" isEmbed={isEmbed}>
      <ChangeAnswers
        storedData={storedData}
        data={data}
        questions={qs}
        dataPath={dataPath}
        text={midLifeMotText(z, Section.CheckAnswers)}
        CHANGE_ANSWER_API={CHANGE_ANSWER_API}
        nextLink={links.change.nextLink}
        actionText={midLifeMotText(z, Section.ChangeAnswersNextPageText)}
        backLink={links.change.backLink}
        lang={lang}
        isEmbed={isEmbed}
      />
    </MidLifeMot>
  );
};

export default ChangeOptions;

export const getServerSideProps = getServerSidePropsDefault;
