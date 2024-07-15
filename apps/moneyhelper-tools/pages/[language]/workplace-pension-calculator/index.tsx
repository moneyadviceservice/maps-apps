import {
  EmbedPageLayout,
  Level,
  ToolPageLayout,
} from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';
import { GetServerSideProps } from 'next';
import WPCCLanding from './wpcc-landing';
import { getToolPath } from 'utils/getToolPath';
import { DataPath } from 'types';
import {
  breadcrumbs,
  validatePensionInputs,
} from 'data/workplace-pension-calculator';
import {
  StepName,
  pageData,
} from 'data/workplace-pension-calculator/pension-data';
import { useMemo } from 'react';
import { navigationRules } from 'pages/api/pensions-calculator';
import {
  ContributionType,
  SalaryFrequency,
  contributionCalculator,
} from 'utils/PensionCalculator/contributionCalculator';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
  headingLevel?: Level;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const WorkplacePensionCalculator = ({
  children,
  isEmbed,
  headingLevel,
}: Props) => {
  const { z } = useTranslation();

  const page = useMemo(() => pageData(z), [z]);

  return isEmbed ? (
    <EmbedPageLayout title={page.title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={page.title}
      className="lg:container-auto pt-4 pb-1.5 lg:max-w-[960px]"
      headingClassName="lg:max-w-[960px]"
      pageTitle={page.title}
      breadcrumbs={!isEmbed ? breadcrumbs(z) : undefined}
      noMargin={true}
      showContactUs={true}
      headingLevel={headingLevel ?? 'h1'}
    >
      {children}
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <WorkplacePensionCalculator isEmbed={isEmbed}>
    <WPCCLanding lang={lang} isEmbed={isEmbed} />
  </WorkplacePensionCalculator>
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
  const urlPath = getToolPath(DataPath.WorkplacePensionCalculator);
  const errors = validatePensionInputs(query);
  const currentStep = query?.currentStep as StepName;
  const stepName = currentStep ?? navigationRules(currentStep, errors);

  const results =
    currentStep === StepName.RESULTS
      ? contributionCalculator({
          salary:
            parseFloat((query.salary as string).replaceAll(',', '')) *
            Number(query.frequency),
          frequency: Number(query.results)
            ? Number(query.results)
            : (12 as SalaryFrequency),
          contributionType: query.contributionType as ContributionType,
          employeeContribution: parseFloat(
            query.employeeContribution as string,
          ),
          employerContribution: parseFloat(
            query.employerContribution as string,
          ),
        })
      : {};

  return {
    props: {
      storedData: query,
      data: JSON.stringify(query) || '',
      errors: errors,
      currentStep: stepName,
      dataPath: DataPath.WorkplacePensionCalculator,
      results: results,
      lang: lang,
      isEmbed: isEmbed,
      urlPath,
    },
  };
};
