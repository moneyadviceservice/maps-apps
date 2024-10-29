import { SavingsCalculatorWrapper, getServerSidePropsDefault } from '.';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { SavingsCalculator } from 'components/SavingsCalculator';
import {
  ErrorField,
  SavingsCalculatorType,
} from 'components/SavingsCalculator/SavingsCalculator';
import {
  savingsCalculatorHowLongAnalytics,
  savingsCalculatorHowMuchAnalytics,
} from 'data/form-content/analytics/savings-calculator';
import { pageData } from 'data/savings-calculator/landing';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataPath } from 'types';

type Props = {
  lang: string;
  isEmbed: boolean;
  calculatorType: SavingsCalculatorType;
  queryData: DataFromQuery;
  errors: ErrorField[];
};

const Calculator = ({
  lang,
  isEmbed,
  calculatorType,
  queryData,
  errors,
}: Props) => {
  const { z } = useTranslation();
  const page = pageData(z);
  const analyticsData =
    calculatorType === SavingsCalculatorType.HOW_MUCH
      ? savingsCalculatorHowMuchAnalytics
      : savingsCalculatorHowLongAnalytics;

  return (
    <SavingsCalculatorWrapper isEmbed={isEmbed}>
      <SavingsCalculator
        lang={lang}
        dataPath={DataPath.SavingsCalculator}
        queryData={queryData}
        isEmbed={isEmbed}
        calculatorType={calculatorType}
        errors={errors}
        analyticsData={{
          ...analyticsData,
          pageTitle: page.title,
        }}
      />
    </SavingsCalculatorWrapper>
  );
};

export default Calculator;

export const getServerSideProps = getServerSidePropsDefault;
