import { DATA_PATH } from 'CONSTANTS';

import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, MidLifeMot } from '.';
import { QuestionPage } from '../../../components/QuestionPage';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, links, isEmbed }: Props) => {
  const QUESTION_PREFIX = 'q-';
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;
  const dataPath = DATA_PATH;

  return (
    <MidLifeMot step={hasError ? 'error' : currentStep} isEmbed={isEmbed}>
      <QuestionPage
        storedData={storedData}
        data={data}
        currentStep={currentStep}
        links={links}
        dataPath={dataPath}
        isEmbed={isEmbed}
      />
    </MidLifeMot>
  );
};

export default Step;

export const getServerSideProps = getServerSidePropsDefault;
