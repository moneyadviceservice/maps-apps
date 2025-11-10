import { GetServerSideProps, NextPage } from 'next';

import { Details, Paragraph } from '@maps-digital/shared/ui';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionWisePageProps } from '@maps-react/pwd/layouts/PensionwisePageLayout';

const Page: NextPage<PensionWisePageProps> = ({ ...pageProps }) => {
  const {
    route: { query },
  } = pageProps;

  const { language, error } = query;
  const { z } = useTranslation();
  const borderColour = error ? 'border-red-700' : 'border-gray-400';

  return (
    <ToolPageLayout
      {...pageProps}
      title={z({
        en: 'Pension guidance answers',
        cy: 'Atebion arweiniad ar bensiynau',
      })}
      titleTag="span"
      noMargin={true}
      className="mt-2"
    >
      <Container>
        <H1 className="mt-8 mb-4" data-testid="section-title">
          {z({
            en: 'View Pension Wise online appointment answers',
            cy: 'Gweld atebion apwyntiad ar-lein Pension Wise',
          })}
        </H1>
        <div className="max-w-[840px]">
          <div className="pt-8 mb-6 text-base">
            {z({
              en: 'Enter a unique reference number (URN) to access a customer’s answers from their completed Pension Wise online appointment.',
              cy: "Rhowch rif cyfeirnod unigryw (URN) i gael mynediad at atebion cwsmer o'u hapwyntiad Pension Wise ar-lein sydd wedi’i gwblhau.",
            })}
          </div>
          <form method="POST" noValidate className="mt-8">
            <input type="hidden" name="language" defaultValue={language} />
            <Errors errors={error ? [error] : []} className="mb-2 max-w-[50%]">
              <label className="block text-2xl" htmlFor="urn">
                {z({
                  en: 'Unique Reference Number (URN)',
                  cy: 'Rhif cyfeirnod unigryw (URN)',
                })}
              </label>
              <p id="urn-hint" className=" text-gray-400">
                {z({
                  en: '8 digits starting with P e.g. PAB1-2CDE',
                  cy: '8 digid yn dechrau gyda P e.e. PAB1-2CDE',
                })}
              </p>
              {error && (
                <p
                  id="urn-error"
                  className="mb-1 text-red-700 text-base"
                  data-testid="urn-error"
                >
                  {z({ en: 'Error', cy: 'Gwall' })}:{' '}
                  {error === 'urn' &&
                    z({
                      en: 'The reference number you entered cannot be found, please check and try again',
                      cy: "Ni ellir dod o hyd i'r cyfeirnod a roesoch i mewn, gwiriwch a rhowch gynnig arall arni",
                    })}
                  {error === 'format' &&
                    z({
                      en: 'Enter the reference number in the correct format, like PAB1-2CDE',
                      cy: 'Rhowch y cyfeirnod yn y fformat cywir, er enghraifft, PAB1-2CDE',
                    })}
                  {error !== 'urn' &&
                    error !== 'format' &&
                    z({
                      en: "There's been a problem accessing the customer's answers. Please try again later",
                      cy: 'Bu problem yn cael gafael ar atebion y cwsmer. Rhowch gynnig arall arni yn nes ymlaen.',
                    })}
                </p>
              )}

              <input
                className={`${borderColour} border rounded focus:outline-purple-700 focus:shadow-focus-outline h-10 m-px mt-2 px-3 w-full`}
                id="urn"
                name="urn"
                aria-describedby={`urn-hint ${error ? 'urn-error' : ''}`}
              />
            </Errors>
            <Details
              title={z({
                en: 'Where to find this',
                cy: 'Ble i ddod o hyd i hyn',
              })}
            >
              <Paragraph>
                {z({
                  en: "The customer’s unique reference number can be found on the summary page or save and come back later email after completing an appointment. A unique reference number won't be provided for partially completed appointments",
                  cy: "Gellir dod o hyd i rif cyfeirnod unigryw'r cwsmer ar y dudalen grynodeb neu ar yr e-bost arbed a dychwelyd yn hwyrach ar ôl cwblhau apwyntiad. Ni fydd rhif cyfeirnod unigryw yn cael ei ddarparu ar gyfer apwyntiadau sydd wedi'u cwblhau'n rhannol",
                })}
              </Paragraph>
            </Details>

            <Button
              className="w-full mt-6 md:w-auto"
              formAction="/api/find-appointment"
              data-testid="find-urn"
            >
              {z({ en: 'View answers', cy: 'Gweld yr atebion' })}
            </Button>
          </form>
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      pageTitle: 'Find an appointment - Pension Wise',
      route: {
        query,
        app: process.env.appUrl,
      },
    },
  };
};
