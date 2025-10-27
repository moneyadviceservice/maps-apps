import { Analytics } from '@maps-react/core/components/Analytics';
import { ChangeAnswers } from '@maps-react/form/components/ChangeAnswers';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { RedundancyPayCalculator } from '.';
import { CHANGE_ANSWER_API, DATA_PATH } from '../../CONSTANTS';
import { redundancyPayCalculatorAnalytics } from '../../data/form-content/analytics';
import {
  redundancyPayCalculatorText,
  Section,
} from '../../data/form-content/change-options';
import { redundancyPayCalculatorQuestions } from '../../data/form-content/questions';
import { parseStoredData } from '../../utils/parseStoredData';

type Props = {
  storedData: DataFromQuery;
  data: string;
  links: ToolLinks;
  lang: string;
  isEmbed: boolean;
};

const ChangeOptions = ({ storedData, data, links, lang, isEmbed }: Props) => {
  const { z } = useTranslation();

  const qs = redundancyPayCalculatorQuestions(z);

  const currentStep = 'changeOptions';
  const parsedData = parseStoredData(storedData);
  const analyticsData = redundancyPayCalculatorAnalytics(
    z,
    currentStep,
    parsedData,
  );

  return (
    <RedundancyPayCalculator step={currentStep} isEmbed={isEmbed}>
      <Analytics
        analyticsData={analyticsData}
        currentStep={currentStep}
        formData={parsedData}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: false,
          toolCompletion: false,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <ChangeAnswers
          storedData={storedData}
          data={data}
          questions={qs}
          dataPath={DATA_PATH}
          text={redundancyPayCalculatorText(z, Section.CheckAnswers)}
          nextLink={links.change.nextLink}
          CHANGE_ANSWER_API={CHANGE_ANSWER_API}
          backLink={links.change.backLink}
          actionText={redundancyPayCalculatorText(
            z,
            Section.ChangeAnswersNextPageText,
          )}
          lang={lang}
          isEmbed={isEmbed}
          enableFullPageLoad={true}
          glassBoxQuestions={[2]}
          layout="grid"
        />
      </Analytics>
    </RedundancyPayCalculator>
  );
};

export default ChangeOptions;

export { getServerSidePropsDefault as getServerSideProps } from '.';
