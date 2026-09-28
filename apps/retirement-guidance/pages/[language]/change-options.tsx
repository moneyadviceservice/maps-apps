import { retirementGuidanceQuestions } from 'data/questions';
import { PAGE_NAME_PREFIX, PAGE_TITLE_PREFIX } from 'lib/constants';

import { ChangeAnswers } from '@maps-react/form/components/ChangeAnswers';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { RetirementGuidance } from '.';
import { useRetirementGuidanceAnalytics } from '../../lib/hooks';

type Props = {
  storedData: DataFromQuery;
  data: string;
  links: ToolLinks;
  isEmbed: boolean;
};

const CheckAnswers = ({ storedData, data, links, isEmbed }: Props) => {
  const { t, locale } = useTranslation();
  const questions = retirementGuidanceQuestions(t);

  useRetirementGuidanceAnalytics({
    pageName: `${PAGE_NAME_PREFIX}change-options`,
    pageTitle: `${PAGE_TITLE_PREFIX}Change Options`,
    toolStep: '13',
    stepName: 'Change Options',
    fireToolStart: false,
    fireToolComplete: false,
  });
  return (
    <RetirementGuidance step={'checkAnswers'} isEmbed={isEmbed}>
      <ChangeAnswers
        storedData={storedData}
        data={data}
        questions={questions}
        dataPath={'/'}
        text={t('checkAnswers.description')}
        CHANGE_ANSWER_API={'/api/check-answers'}
        nextLink={links.change.nextLink}
        actionText={t('seeYourResultsButton')}
        backLink={links.change.backLink}
        lang={locale}
        isEmbed={isEmbed}
        layout="grid"
      />
    </RetirementGuidance>
  );
};

export default CheckAnswers;

export { getServerSidePropsDefault as getServerSideProps } from '.';
