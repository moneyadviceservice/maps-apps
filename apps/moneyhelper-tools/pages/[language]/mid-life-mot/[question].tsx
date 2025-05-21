import { QuestionPage } from 'components/QuestionPage';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { DataPath } from 'types';

import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, MidLifeMot } from '.';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  dataPath: DataPath;
  links: ToolLinks;
  isEmbed: boolean;
};

const Step = ({
  storedData,
  data,
  currentStep,
  dataPath,
  links,
  isEmbed,
}: Props) => {
  const hasError = storedData?.error === QUESTION_PREFIX + currentStep;

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
