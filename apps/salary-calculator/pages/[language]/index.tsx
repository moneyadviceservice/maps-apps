import { GetServerSideProps } from 'next';

import { convertToAnnualSalary } from 'utils/calculations/convertToAnnualSalary/convertToAnnualSalary';

import { GridContainer } from '@maps-react/core/components/GridContainer';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { calculateNetSalary } from '../../utils/calculations/calculateNetSalary/calculateNetSalary';

const SalaryCalculatorPage = () => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();
  const title = z({ en: 'Salary calculator', cy: 'Cyfrifiannell cyflog' });

  const initialPageData = {
    page: {
      pageName: 'salary-calculator',
      pageTitle: title,
    },
    tool: {
      toolName: 'Salary Calculator',
      toolStep: 1,
      stepName: 'Calculate',
    },
  };

  addPage([{ ...initialPageData, event: 'pageLoadReact' }]);

  // Example user input (these will later come from query params / props)
  const amount = 79000;
  const frequency = 'yearly';
  const daysPerWeek = undefined;
  const hoursPerWeek = undefined;

  // Convert to annual salary
  const annualSalary = convertToAnnualSalary({
    amount,
    frequency,
    daysPerWeek,
    hoursPerWeek,
  });

  // Calculate tax, NI, and net salary based on gross annual salary
  const { incomeTax, nationalInsurance, netSalary } = calculateNetSalary({
    grossSalary: annualSalary,
    country: 'England/NI/Wales',
    taxYear: '2025/26',
  });

  return (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={[]}
      titleTag="span"
      layout="grid"
    >
      <GridContainer>
        <div className="col-span-12 space-y-1 lg:col-span-10 xl:col-span-8">
          {/* Main content / component will go here */}

          <h1 className="text-lg font-bold">Example Calculation</h1>
          <p>Annual salary: £{annualSalary.toLocaleString()}</p>
          <p>Country: England</p>
          <p>Tax Code: 1257L</p>
          <p>Income tax: £{incomeTax}</p>
          <p>National Insurance: £{nationalInsurance}</p>
          <p>Net annual salary: £{netSalary}</p>
        </div>
      </GridContainer>
    </ToolPageLayout>
  );
};

export default SalaryCalculatorPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    // Get user input values from query and perform calculations, and return props
    props: {},
  };
};
