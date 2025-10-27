import { GetServerSideProps } from 'next';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import {
  constructURL,
  getAppConfig,
  getNumberConfigValue,
} from '@maps-react/netlify-functions/utils/getAppConfig';

import {
  MortgageCalculator,
  MortgageCalculatorProps,
} from '../../components/MortgageCalculator/MortgageCalculator';
import { calculateInterestonly } from '../../utils/MortgageCalculator/calculateInterestonly';
import { calculateRepayment } from '../../utils/MortgageCalculator/calculateRepayment';
type BalanceBreakdown = {
  year: number;
  presentValue: number;
};

export type CalculationResult = {
  debt: number;
  monthlyPayment: number;
  changedPayment: number;
  totalAmount: number;
  capitalSplit: number;
  interestSplit: number;
  balanceBreakdown: BalanceBreakdown[];
};

interface PageProps extends MortgageCalculatorProps {
  isEmbed: boolean;
}

const MortgageCalculatorPage = ({
  calculationType,
  price,
  deposit,
  termYears,
  rate,
  calculationResult,
  isEmbed,
}: PageProps) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();
  const title = z({ en: 'Mortgage calculator', cy: 'Cyfrifiannell morgais' });

  const initialPageData = {
    page: {
      pageName: `mortgage-calculator${
        calculationResult && Number(price) > 0 ? ' results' : ''
      }`,
      pageTitle: title,
    },
    tool: {
      toolName: 'Mortgage Calculator',
      toolStep: calculationResult?.totalAmount ? 2 : 1,
      stepName:
        calculationResult && Number(price) > 0 ? 'Results' : 'Calculate',
    },
  };

  addPage([{ ...initialPageData, event: 'pageLoadReact' }]);

  const children = (
    <MortgageCalculator
      calculationType={calculationType}
      price={price}
      deposit={deposit}
      termYears={termYears}
      rate={rate}
      calculationResult={calculationResult}
      analyticsData={initialPageData}
      isEmbedded={isEmbed}
    />
  );

  return isEmbed ? (
    <div className="pb-5">
      <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
    </div>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={[]}
      titleTag="span"
    >
      {children}
    </ToolPageLayout>
  );
};

export default MortgageCalculatorPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;
  const isEmbed = query.isEmbedded === 'true';
  const calculationType = String(query.calculationType || '');
  const price = Number(query.price?.toString().replace(/,/g, '')) || '';
  const deposit = Number(query.deposit?.toString().replace(/,/g, '')) || '';
  const termYears = Number(query.termYears) || 25;

  const baseUrl = constructURL(req);
  const appConfig = await getAppConfig(baseUrl);

  const rate =
    query.rate !== undefined && !isNaN(+query.rate)
      ? +query.rate
      : getNumberConfigValue(appConfig, 'interestRateValue', 4.0);
  let calculationResult = null;

  if (calculationType === 'repayment') {
    calculationResult = calculateRepayment(
      Number(price),
      Number(deposit),
      termYears,
      0,
      Number(rate),
    );
  } else if (calculationType === 'interestonly') {
    calculationResult = calculateInterestonly(
      Number(price),
      Number(deposit),
      termYears,
      0,
      Number(rate),
    );
  }

  return {
    props: {
      calculationType,
      price,
      deposit,
      termYears,
      rate,
      calculationResult,
      isEmbed,
    },
  };
};
