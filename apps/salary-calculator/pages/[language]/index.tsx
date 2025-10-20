import { GetServerSideProps } from 'next';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

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

  return (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={[]}
      titleTag="span"
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </ToolPageLayout>
  );
};

export default SalaryCalculatorPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
