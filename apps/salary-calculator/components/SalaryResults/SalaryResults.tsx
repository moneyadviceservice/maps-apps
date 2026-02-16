import { ResultsComparisonSalary } from 'components/ResultsComparisonSalary/ResultsComparisonSalary';
import { ResultsSingleSalary } from 'components/ResultsSingleSalary';
import { FrequencyType } from 'components/ResultsTable';
import { SalaryFormData } from 'components/SalaryForm';
import { TaxYear } from 'utils/rates/types';

type SalaryResultsProps = {
  calculationType: 'single' | 'joint';
  salary1: SalaryFormData;
  salary2?: SalaryFormData;
  taxYear: TaxYear;
  resultsFrequency: FrequencyType;
  normalizeSalary: (salary: SalaryFormData) => any;
};

export const SalaryResults: React.FC<SalaryResultsProps> = ({
  calculationType,
  salary1,
  salary2,
  taxYear,
  resultsFrequency,
  normalizeSalary,
}) => {
  if (calculationType === 'single' && salary1.calculated) {
    return (
      <div className="col-span-12 space-y-6 lg:col-span-6 xl:col-span-5 md:space-y-8 lg:self-start">
        <ResultsSingleSalary
          salary={normalizeSalary(salary1)}
          taxYear={taxYear}
          resultsFrequency={resultsFrequency}
        />
      </div>
    );
  }

  if (
    calculationType === 'joint' &&
    salary1.calculated &&
    salary2?.calculated
  ) {
    return (
      <div className="col-span-12 space-y-6 md:space-y-8">
        <ResultsComparisonSalary
          salary1={normalizeSalary(salary1)}
          salary2={normalizeSalary(salary2)}
          taxYear={taxYear}
          resultsFrequency={resultsFrequency}
        />
      </div>
    );
  }

  return null;
};
