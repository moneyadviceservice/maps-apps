import { GetServerSideProps } from 'next';

import { decrypt } from 'lib/token';
import { twMerge } from 'tailwind-merge';
import { formatBookingSlotText } from 'utils/api/formatBookingSlotText';
import { generatePageTitle } from 'utils/generatePageTitle';
import { generateToolLinks, ToolLinks } from 'utils/generateToolLinks';
import { getCurrentPath } from 'utils/getCurrentPath';
import { getPageTitle } from 'utils/getPageTitle';
import { FLOW } from 'utils/getQuestions';
import { pageFilter } from 'utils/pageFilter';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PATHS } from '../../../CONSTANTS';
import { CookieData } from '../../../data/questions/types';

type Props = {
  step: string | number;
  currentFlow?: FLOW;
  isEmbed?: boolean;
  children: JSX.Element;
};

export const MoneyAdviserNetwork = ({
  step,
  currentFlow,
  isEmbed,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const pageStepTitle = getPageTitle(step, z, currentFlow);
  const pageTitle = generatePageTitle(pageStepTitle, z);
  const title = z({
    en: 'Debt Advice Referral',
    cy: 'Atgyfeiriad am gyngor ar ddyledion',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      titleTag={step === 'landing' ? 'default' : 'span'}
      title={title}
      pageTitle={pageTitle}
      showContactUs={false}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
    >
      {children}
    </ToolPageLayout>
  );
};

const LandingPage = () => (
  <MoneyAdviserNetwork step="landing">
    <Container className="pb-16">
      <div className={twMerge('lg:max-w-[840px] space-y-8')}>
        <H2>Money Adviser Network</H2>

        <Paragraph>Login form here...</Paragraph>
        <div className="space-y-4">
          <Button
            variant="primary"
            type="button"
            as="a"
            href={`${PATHS.START}/1`}
            data-testid="landing-page-button"
            data-cy="landing-page-button"
            className="w-full sm:w-auto"
          >
            Start tool
          </Button>
        </div>
      </div>
    </Container>
  </MoneyAdviserNetwork>
);

export default LandingPage;

export type BaseProps = {
  storedData: DataFromQuery;
  cookieData: CookieData;
  data: string;
  currentStep: number;
  currentFlow: FLOW;
  links: ToolLinks;
  lang: string;
  bookingSlot: string;
};

export const getServerSidePropsDefault: GetServerSideProps<BaseProps> = async ({
  req,
  params,
  query,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';
  if (!req.cookies.accessToken) {
    return {
      redirect: {
        destination: `/${lang}`,
        permanent: false,
      },
    };
  }

  const currentFlow = `${query?.flow}` as FLOW;
  const currentPath = getCurrentPath(currentFlow);
  let cookieData: CookieData = {};
  if (req.cookies.data) {
    cookieData = (await decrypt(req.cookies.data)).payload as CookieData;
  }
  const bookingSlot = cookieData.timeSlot
    ? formatBookingSlotText(cookieData.timeSlot.value, lang)
    : '';

  const filter = pageFilter(query, `/${currentPath}/`, false, undefined, 'q');
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = generateToolLinks(
    saveddata,
    cookieData,
    filter,
    currentStep,
    currentFlow,
    req?.url,
  );

  return {
    props: {
      storedData: saveddata,
      cookieData: cookieData,
      data: JSON.stringify(saveddata) || '',
      currentStep,
      currentFlow,
      lang,
      links,
      bookingSlot,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsDefault(context);
};
