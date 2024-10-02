import { GetServerSideProps } from 'next';
import { breadcrumbs } from 'data/savings-calculator';
import SavingsCalculatorLanding from './landing';
import { SavingsCalculatorType } from 'components/SavingsCalculator/SavingsCalculator';
import { savingsValidateInputs } from 'utils/SavingsCalculator/savingsCalculatorValidationInputs';
import { pageData } from 'data/savings-calculator/landing';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Level } from '@maps-digital/shared/ui';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
  headingLevel?: Level;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const SavingsCalculatorWrapper = ({
  children,
  isEmbed,
  headingLevel,
}: Props) => {
  const { z } = useTranslation();
  const page = pageData(z);

  return isEmbed ? (
    <EmbedPageLayout title={page.title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      className="lg:container-auto pt-4 pb-1.5 lg:max-w-[960px]"
      headingClassName="lg:max-w-[960px]"
      pageTitle={page.title}
      breadcrumbs={!isEmbed ? breadcrumbs(z) : undefined}
      showContactUs={true}
      headingLevel={headingLevel ?? 'h1'}
    >
      {children}
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <SavingsCalculatorWrapper isEmbed={isEmbed}>
    <SavingsCalculatorLanding lang={lang} isEmbed={isEmbed} />
  </SavingsCalculatorWrapper>
);

export default Landing;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;

  return {
    props: {
      lang: lang,
      isEmbed: isEmbed,
    },
  };
};

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const calculatorType = query?.calculator as SavingsCalculatorType;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const errors = savingsValidateInputs({
    inputs: {
      savingGoal: getValue(query['savingGoal']),
      amount: getValue(query['amount']),
      amountDuration: getValue(query['amountDuration']),
      durationMonth: getValue(query['durationMonth']),
      durationYear: getValue(query['durationYear']),
      saved: getValue(query['saved']),
      interest: getValue(query['interest']),
    },
    type: calculatorType,
  });

  return {
    props: {
      lang,
      isEmbed,
      calculatorType,
      queryData: query,
      errors,
    },
  };
};
