import { DATA_PATH } from 'CONSTANTS';

import { Analytics } from '@maps-react/core/components/Analytics';
import { Questions } from '@maps-react/form/components/Questions';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, MidLifeMot } from '.';
import { midLifeMotAnalytics } from '../../../data/form-content/analytics';
import { midLifeMotErrorMessages } from '../../../data/form-content/errors';
import { midLifeMotQuestions } from '../../../data/form-content/questions/mid-life-mot';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const { z } = useTranslation();
  const QUESTION_PREFIX = 'q-';
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const dataPath = DATA_PATH;
  const lang = useLanguage();
  const questions = midLifeMotQuestions(z);
  const errors = midLifeMotErrorMessages(z);
  const analyticsData = midLifeMotAnalytics(z, currentStep);

  const linkToLandingPage = `https://www.moneyhelper.org.uk/${lang}/everyday-money/midlife-mot`;

  return (
    <MidLifeMot step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <Analytics
        analyticsData={analyticsData}
        currentStep={currentStep}
        formData={storedData}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: true,
          toolCompletion: true,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Questions
          storedData={storedData}
          data={data}
          questions={questions}
          errors={errors}
          currentStep={currentStep}
          backLink={
            currentStep === 1 ? linkToLandingPage : links.question.backLink
          }
          dataPath={dataPath}
          apiCall="/api/form-actions/submit-answer"
          isEmbed={isEmbed}
        />
      </Analytics>
    </MidLifeMot>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
