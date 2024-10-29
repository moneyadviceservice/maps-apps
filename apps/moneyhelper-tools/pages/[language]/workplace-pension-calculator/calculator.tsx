import { WorkplacePensionCalculator, getServerSidePropsDefault } from '.';
import { DataPath } from 'types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { PENSION_CALCULATOR_API } from 'CONSTANTS';
import { PensionCalculator } from 'components/PensionCalculator';
import { StepName } from 'data/workplace-pension-calculator/pension-data';
import { ContributionCalculatorResults } from 'utils/PensionCalculator/contributionCalculator';
import { ErrorObject } from 'data/workplace-pension-calculator/pension-validation';

type Props = {
  lang: string;
  isEmbed: boolean;
  currentStep: StepName;
  dataPath: DataPath;
  storedData: DataFromQuery;
  data: string;
  errors: ErrorObject;
  results: ContributionCalculatorResults;
};

const WorkplacePension = ({
  lang,
  isEmbed,
  currentStep,
  dataPath,
  storedData,
  data,
  results,
  errors,
}: Props) => {
  return (
    <WorkplacePensionCalculator isEmbed={isEmbed} headingLevel={'h2'}>
      <PensionCalculator
        action={PENSION_CALCULATOR_API}
        lang={lang}
        queryData={storedData}
        dataPath={dataPath}
        data={data}
        isEmbed={isEmbed}
        results={results}
        errors={errors}
        currentStep={currentStep}
      />
    </WorkplacePensionCalculator>
  );
};

export default WorkplacePension;

export const getServerSideProps = getServerSidePropsDefault;
