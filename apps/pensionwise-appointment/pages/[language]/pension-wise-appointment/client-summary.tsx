import { GetServerSideProps, NextPage } from 'next';

import { ParsedUrlQuery } from 'querystring';
import { v4 as uuv4 } from 'uuid';
import { Callout, Link } from '@maps-digital/shared/ui';

import { H1, H2, H3 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionWisePageProps } from '@maps-react/pwd/layouts/PensionwisePageLayout';

import {
  fetchPensionOption,
  fetchQuestion,
  PensionOptionPage,
  Question,
} from '../../../utils';

type DetailsType = {
  question: string;
  answer: string;
};

type PensionDetailsType = {
  title: string;
  details: DetailsType[];
};

enum PENSION_USER_SECTIONS {
  PENSION_BASICS = 'pensionBasics',
  INCOME_AND_SAVINGS = 'incomeAndSavings',
  DEBT_AND_REPAYMENT = 'debtAndRepayment',
  YOUR_HOME = 'yourHome',
  HEALTH_AND_FAMILY = 'healthAndFamily',
}

const HelpingPlanQuestions = {
  [PENSION_USER_SECTIONS.PENSION_BASICS]: [
    Question.KEEPING_TRACK_OF_PENSIONS,
    Question.TRANSFERRING_PENSION,
  ],
  [PENSION_USER_SECTIONS.INCOME_AND_SAVINGS]: [
    Question.RETIREMENT_BUDGET,
    Question.STATE_PENSION,
    Question.STATE_BENEFITS,
  ],
  [PENSION_USER_SECTIONS.DEBT_AND_REPAYMENT]: [Question.PAY_DEBTS],
  [PENSION_USER_SECTIONS.YOUR_HOME]: [Question.LIVE_OVERSEAS],
  [PENSION_USER_SECTIONS.HEALTH_AND_FAMILY]: [
    Question.MADE_A_WILL,
    Question.POWER_OF_ATTORNEY,
  ],
};

const Page: NextPage<
  PensionWisePageProps & { helpingYourPlan: PensionDetailsType[] } & {
    pensionOptions: string[];
  }
> = ({ helpingYourPlan, pensionOptions, ...pageProps }) => {
  const {
    route: { query, next, app },
  } = pageProps;
  const { urn, language } = query;
  const { z } = useTranslation();
  const hypLength = helpingYourPlan.length;

  return (
    <ToolPageLayout
      {...pageProps}
      title={z({
        en: 'Pension guidance answers',
        cy: 'Atebion arweiniad ar bensiynau',
      })}
      noMargin={true}
      headingLevel="h4"
    >
      <Container>
        <div className="lg:w-[57%] space-y-8">
          <Link href={`/${language}/${app}/find-appointment`}>
            {z({ en: 'Back', cy: 'Yn ôl' })}
          </Link>
          <H1 className=" mb-3" data-testid="section-title">
            {z({
              en: 'Pension Wise online appointment answers summary',
              cy: 'Crynodeb atebion apwyntiadau ar-lein Pension Wise',
            })}
          </H1>
          <Callout className="py-4 pl-10">
            <Paragraph className="mb-0">
              {z({
                en: 'For Pension Wise reference',
                cy: 'Ar gyfer cyfeirnod Pension Wise',
              })}
            </Paragraph>
            <Paragraph
              className="text-4xl font-semibold mb-0"
              data-testid="urn-callout"
            >
              {urn}
            </Paragraph>
            <Link href={`/${language}/${app}/find-appointment`}>
              {z({
                en: 'Enter a different reference number',
                cy: 'Mewnbynnwch rif cyfeirnod gwahanol',
              })}
            </Link>
          </Callout>
          <Paragraph className="mb-0">
            {z({
              en: 'Customer answers from their completed online appointment shown below.',
              cy: "Dangosir atebion cwsmeriaid o'u hapwyntiad ar-lein sydd wedi’i gwblhau isod.",
            })}
          </Paragraph>

          <H2 className="flex align-middle" data-testid="basic-planning-title">
            1. {z({ en: 'Helping you plan', cy: 'Eich helpu i gynllunio' })}
          </H2>
          <div className="space-y-4 text-base">
            {helpingYourPlan?.map((section, idx) => {
              return (
                <div key={uuv4()}>
                  {section.title === PENSION_USER_SECTIONS.PENSION_BASICS && (
                    <H3 className="mb-3 mt-8">
                      {z({ en: 'Pension basics', cy: 'Hanfodion pensiwn' })}
                    </H3>
                  )}

                  {section.title ===
                    PENSION_USER_SECTIONS.INCOME_AND_SAVINGS && (
                    <H3 className="mb-3 mt-8">
                      {z({ en: 'Income and savings', cy: 'Incwm a chynilion' })}
                    </H3>
                  )}

                  {section.title ===
                    PENSION_USER_SECTIONS.DEBT_AND_REPAYMENT && (
                    <H3 className="mb-3 mt-8">
                      {z({
                        en: 'Debt and repayment',
                        cy: 'Dyledion ac ad-daliadau',
                      })}
                    </H3>
                  )}

                  {section.title === PENSION_USER_SECTIONS.YOUR_HOME && (
                    <H3 className="mb-3 mt-8">
                      {z({ en: 'Your home', cy: 'Eich cartref' })}
                    </H3>
                  )}

                  {section.title ===
                    PENSION_USER_SECTIONS.HEALTH_AND_FAMILY && (
                    <H3 className="mb-3 mt-8">
                      {z({ en: 'Health and family', cy: 'Iechyd a theulu' })}
                    </H3>
                  )}

                  {section?.details.map((detail, index) => {
                    return (
                      <div
                        key={uuv4()}
                        className="grid grid-cols-2 gap-8 py-2 border-b border-slate-400"
                      >
                        <Paragraph className="mb-0 font-bold">
                          {detail.question}
                        </Paragraph>
                        <span
                          data-testid={`section-t${idx + 1}q${index + 1}`}
                          className="font-normal"
                        >
                          {detail.answer}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="text-base pb-8">
            <H2
              className="flex align-middle pb-8"
              data-testid="basic-planning-title"
            >
              2.{' '}
              {z({ en: 'Your pension options', cy: 'Eich opsiynau pensiwn' })}
            </H2>
            <div className="grid grid-cols-2 gap-8">
              <span></span>
              <Paragraph className="mb-0">
                {z({ en: 'Interested?', cy: 'Oes gennych ddiddordeb?' })}
              </Paragraph>
            </div>
            {pensionOptions.map((option, idx) => {
              return (
                <div
                  key={uuv4()}
                  className="grid grid-cols-2 gap-8 py-2 border-b border-slate-400"
                >
                  <Paragraph className="mb-0 font-bold">{option}</Paragraph>
                  <span
                    className="font-normal"
                    data-testid={`section-t${hypLength + idx + 1}q1`}
                  >
                    {[
                      z({ en: 'Yes', cy: 'Ydy' }),
                      z({ en: 'No', cy: 'Na' }),
                    ].filter(
                      (t, index) =>
                        Number.parseInt(query[`t${hypLength + idx + 1}q1`]) ===
                        index + 1,
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <Link href={next ?? ''} asButtonVariant="primary">
            {z({
              en: 'View summary document & to-do list',
              cy: "Edrych ar eich dogfen gryno a rhestr o bethau i'w gwneud",
            })}
          </Link>
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;

const fetchPensionDetails = async (
  query: ParsedUrlQuery,
  questionIDs: number[],
  taskId: number,
): Promise<DetailsType[]> => {
  return await Promise.all(
    questionIDs.map(async (type, index) => {
      const q = await fetchQuestion(type, query);
      const option = query[`t${taskId}q${index + 1}`]?.toString() ?? '';

      if (isNaN(parseInt(option))) {
        console.error('The answer is not a valid option');
      }

      return {
        question: q?.title ?? '',
        answer: q.options[parseInt(option) - 1] ?? '',
      };
    }),
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const helpingYourPlan = await Promise.all(
    Object.entries(HelpingPlanQuestions).flatMap(
      async ([key, value], index) => {
        const g = await fetchPensionDetails(query, value, index + 1);
        return {
          title: key,
          details: g,
        };
      },
    ),
  );

  const pensionOptions = await Promise.all(
    Object.values(PensionOptionPage)
      .filter((v) => typeof v === 'number')
      .flatMap(async (t) => {
        const content = await fetchPensionOption(Number(t), query);
        if (!content) {
          console.error('failed to load pension option: ', t);
        }
        return content?.title ?? '';
      }),
  );

  const q = new URLSearchParams(query as Record<string, string>);

  return {
    props: {
      helpingYourPlan,
      pensionOptions,
      pageTitle: 'Client summary - Pension Wise',
      route: {
        query,
        back: '/find-appointment',
        app: process.env.appUrl,
        next: `/[language]/pension-wise-appointment/summary?${q.toString()}`,
      },
    },
  };
};
