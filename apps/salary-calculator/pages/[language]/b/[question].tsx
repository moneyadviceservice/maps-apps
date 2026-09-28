import { SalaryCalculatorQuestions } from 'data/b/questions';

import { Questions } from '@maps-react/form/components/Questions';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { SalaryCalculator, SalaryCalculatorStep } from './index';

type Props = {
  storedData: DataFromQuery;
  data: string;
  currentStep: number;
  isEmbed: boolean;
};

const Step = ({ storedData, data, currentStep, isEmbed }: Props) => {
  const { z } = useTranslation();
  const locale = useLanguage();
  const questions = SalaryCalculatorQuestions(z);

  return (
    <SalaryCalculator
      step={currentStep as SalaryCalculatorStep}
      isEmbed={isEmbed}
    >
      <Questions
        displayQuestionNumber={false}
        alwaysDisplaySubText={true}
        storedData={storedData}
        data={data}
        questions={questions}
        errors={[]}
        currentStep={currentStep}
        backLink={`${locale}/work/employment/salary-calculator`}
        dataPath={'/'}
        useValue={true}
        apiCall={'/api/b/submit-answer'}
        isEmbed={isEmbed}
        layout="grid"
      />
    </SalaryCalculator>
  );
};

export default Step;

export { getServerSidePropsDefault as getServerSideProps } from './index';
