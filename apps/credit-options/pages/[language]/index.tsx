import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

type Props = {
  children: JSX.Element;
  step: string | number;
  isEmbed: boolean;
};

export const pageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: t({
      en: 'How much do you need to borrow?',
      cy: 'Faint sydd angen i chi ei fenthyca?',
    }),
    2: t({
      en: 'What do you need the money for?',
      cy: 'Ar gyfer beth ydych chi angen yr arian?',
    }),
    3: t({
      en: 'How long could you wait for the money?',
      cy: 'Pa mor hir allwch chi ddisgwyl am yr arian?',
    }),
    4: t({
      en: 'How quickly could you repay the money?',
      cy: "Pa mor gyflym y gallwch chi dalu'r arian ôl?",
    }),
    5: t({
      en: 'Have you ever been refused credit? ',
      cy: 'A ydych erioed wedi cael credyd wedi’i wrthod?',
    }),
    6: t({
      en: 'How good is your credit score?',
      cy: 'Pa mor dda yw eich sgôr credyd?',
    }),
    change: t({
      en: 'Check your answers',
      cy: 'Edrychwch dros eich atebion',
    }),
    result: t({
      en: 'Borrowing options to consider',
      cy: "Opsiynau benthyca i'w hystyried",
    }),
    error: t({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    }),
  };
};

export const CreditOptions = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const pageTitle = pageTitles(z)[step];

  const title = z({
    en: 'Your options for borrowing money',
    cy: 'Eich opsiynau ar gyfer benthyg arian',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      noMargin={true}
      headingLevel={step === 'landing' ? 'h1' : 'h4'}
    >
      {children}
    </ToolPageLayout>
  );
};

export const getServerSidePropsDefault: GetServerSideProps = async ({
  query,
  params,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = '/';
  const filter = pageFilter(query, urlPath, isEmbed);
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = getToolLinks(saveddata, filter, currentStep, false);

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      lang: lang ?? null,
      links: links,
      isEmbed: isEmbed,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    publicRuntimeConfig: { ENVIRONMENT },
  } = getConfig();

  if (ENVIRONMENT === 'production') {
    return {
      redirect: {
        destination: '/en/question-1',
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};

export default CreditOptions;
