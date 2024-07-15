import { Metadata, NextPage } from 'next';
import { twMerge } from 'tailwind-merge';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { SITE_TITLE, NUMBER_WORDS } from '../../../utils/constants';
import { getPensionsOverview } from '../../../utils/fetch/get-pensions-overview';
import { Button } from '@maps-digital/ui/components/Button';
import { Callout, CalloutVariant } from '@maps-digital/ui/components/Callout';
import { Heading } from '@maps-digital/ui/components/Heading';
import { Icon, IconType } from '@maps-digital/ui/components/Icon';

const title = 'Pensions found';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `${title} | ${SITE_TITLE}`,
  };
};

const Page: NextPage = async () => {
  const {
    totalPensions,
    incompletePensions,
    confirmedPensions,
    unconfirmedPensions,
  } = await getPensionsOverview();

  const calloutClasses = 'mb-6 p-8';
  const calloutHeadingClasses = 'mb-4';
  const calloutItemClasses = 'flex gap-2 mt-4';
  const calloutCtaClasses = 'mb-12';

  const numberToWords = (num: number) =>
    num > NUMBER_WORDS.length ? num : NUMBER_WORDS[num].en;

  return (
    <PensionsDashboardLayout title={title}>
      <Heading level="h2" className="mb-12">
        We found {numberToWords(totalPensions)} pension
        {totalPensions === 1 ? '' : 's'}
      </Heading>

      <div className="grid grid-cols-3 gap-16">
        <div className="col-span-3 lg:col-span-2">
          {confirmedPensions.length > 0 && (
            <>
              <Callout
                variant={CalloutVariant.POSITIVE}
                className={twMerge(calloutClasses)}
              >
                <Heading level="h6" className={twMerge(calloutHeadingClasses)}>
                  Pensions with complete information
                </Heading>
                <ul>
                  {confirmedPensions.map(
                    ({
                      externalAssetId,
                      pensionType,
                      schemeName,
                      pensionAdministrator: { name },
                    }) => (
                      <li
                        key={externalAssetId}
                        className={twMerge(calloutItemClasses)}
                      >
                        <Icon type={IconType.TICK_GREEN} />
                        {pensionType === 'SP' ? schemeName : name}
                      </li>
                    ),
                  )}
                </ul>
              </Callout>
              <Button
                as="a"
                href="/en/your-pensions"
                className={twMerge(calloutCtaClasses)}
              >
                See pension breakdown
              </Button>
            </>
          )}

          {incompletePensions.length > 0 && (
            <>
              <Callout
                variant={CalloutVariant.WARNING}
                className={twMerge(calloutClasses)}
              >
                <Heading level="h6" className={twMerge(calloutHeadingClasses)}>
                  Pensions waiting for more information from your pension
                  providers
                </Heading>
                <ul>
                  {incompletePensions.map(
                    ({ externalAssetId, pensionAdministrator: { name } }) => (
                      <li
                        key={externalAssetId}
                        className={twMerge(calloutItemClasses)}
                      >
                        <Icon type={IconType.EDIT} />
                        {name}
                      </li>
                    ),
                  )}
                </ul>
              </Callout>
              <Button
                as="a"
                href="/en/pending-pensions"
                className={twMerge(calloutCtaClasses)}
              >
                View pending pensions
              </Button>
            </>
          )}

          {unconfirmedPensions.length > 0 && (
            <>
              <Callout
                variant={CalloutVariant.NEGATIVE}
                className={twMerge(calloutClasses)}
              >
                <Heading level="h6" className={twMerge(calloutHeadingClasses)}>
                  Pensions that are a possible match with your details
                </Heading>
                <ul>
                  {unconfirmedPensions.map(
                    ({ externalAssetId, pensionAdministrator: { name } }) => (
                      <li
                        key={externalAssetId}
                        className={twMerge(calloutItemClasses)}
                      >
                        <Icon
                          type={IconType.WARNING}
                          className="scale-50 m-[-12px]"
                        />
                        {name}
                      </li>
                    ),
                  )}
                </ul>
              </Callout>
              <Button
                as="a"
                href="/en/pensions-that-need-action"
                className={twMerge(calloutCtaClasses)}
              >
                Review pensions that need action
              </Button>
            </>
          )}
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;
