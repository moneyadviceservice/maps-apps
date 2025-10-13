import { GetServerSideProps } from 'next';

import { PATHS } from 'CONSTANTS';
import Cookies from 'cookies';
import { CookieData } from 'data/questions/types';
import { decrypt } from 'lib/token';
import { generateAndSetCsrfToken } from 'pages/api/auth';
import { twMerge } from 'tailwind-merge';
import { formatBookingSlotText } from 'utils/formatBookingSlotText';
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
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  step: string | number;
  currentFlow?: FLOW;
  children: JSX.Element;
};

export const MoneyAdviserNetwork = ({
  step,
  currentFlow,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const pageStepTitle = getPageTitle(step, z, currentFlow);
  const pageTitle = generatePageTitle(pageStepTitle, z);
  const title = z({
    en: 'Debt Advice Referral',
    cy: 'Atgyfeiriad am gyngor ar ddyledion',
  });

  return (
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
  <MoneyAdviserNetwork step="0">
    <Container className="pb-16">
      <div className={twMerge('lg:max-w-[840px] space-y-8')}>
        <H2>Money Adviser Network</H2>

        <Paragraph>
          If you are not redirected click &apos;Start tool&apos; below...
        </Paragraph>
        <div className="space-y-4">
          <Button
            variant="primary"
            type="button"
            as="a"
            href={`${PATHS.START}/q-1`}
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
  test?: string | string[];
  userId?: string;
  csrfToken?: string;
};

type CookieFlowData = { [flow in FLOW]: CookieData };

export const getServerSidePropsDefault: GetServerSideProps<BaseProps> = async ({
  req,
  res,
  params,
  query,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const loggedOut = () => {
    return {
      redirect: {
        destination: `/${lang}/login`,
        permanent: false,
      },
    };
  };

  try {
    // check if cookies exist
    if (!req.cookies.accessToken && !req.cookies.refreshToken) {
      return loggedOut();
    }

    // validate cookie encryption
    await decrypt(req.cookies.accessToken as string);
    await decrypt(req.cookies.refreshToken as string);
  } catch (error) {
    return loggedOut();
  }

  const currentFlow = `${query?.flow}` as FLOW;
  const currentPath = getCurrentPath(currentFlow);

  let data = {} as CookieFlowData;
  if (req.cookies.data) {
    data = (await decrypt(req.cookies.data)).payload as CookieFlowData;
  }
  const cookieData: CookieData = { ...data?.[currentFlow] } as CookieData;

  const userId = (req.cookies.userId as string) ?? '';

  const generateNewCsrfToken = async () => {
    const cookies = new Cookies(req, res);

    return await generateAndSetCsrfToken(cookies);
  };

  const csrfToken =
    (req.cookies.csrfToken as string) ?? (await generateNewCsrfToken());

  const bookingSlot = cookieData?.timeSlot
    ? formatBookingSlotText(cookieData.timeSlot.value, true, lang)
    : '';

  const filter = pageFilter(query, `/${currentPath}/`, 'q');
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
      test: query?.test ?? '',
      userId: userId,
      csrfToken: csrfToken,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.cookies.accessToken) {
    const lang = Array.isArray(context.params?.language)
      ? context.params?.language[0]
      : context.params?.language ?? 'en';
    let testQuery = '';

    if (Array.isArray(context.query?.test)) {
      testQuery = `?test=${context.query?.test[0]}`;
    } else if (context.query?.test) {
      testQuery = `?test=${context.query?.test}`;
    }

    return {
      redirect: {
        destination: `/${lang}/${PATHS.START}/q-1${testQuery}`,
        permanent: false,
      },
    };
  }

  return getServerSidePropsDefault(context);
};
