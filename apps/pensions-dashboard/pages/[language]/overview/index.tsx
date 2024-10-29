import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { twMerge } from 'tailwind-merge';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Markdown } from '@maps-react/vendor/components/Markdown';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { PensionsList } from '../../../components/PensionsList';
import { getPensionsOverview } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import { getUserSessionFromCookies, numberToWords } from '../../../lib/utils';

const calloutClasses = 'mb-6 p-8 pt-6';
const calloutHeadingClasses = 'mb-3';
const calloutCtaClasses = 'mb-12';

type Props = {
  hasPensions: boolean;
  totalPensions: number;
  incompletePensions: PensionArrangement[];
  confirmedPensions: PensionArrangement[];
  unconfirmedPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  hasPensions,
  totalPensions,
  incompletePensions,
  confirmedPensions,
  unconfirmedPensions,
}) => {
  const { t, locale } = useTranslation();

  const title = t('pages.overview.title');

  const pensionsHeading = () => {
    if (totalPensions === 0) {
      return t('pages.overview.heading-none');
    } else if (totalPensions === 1) {
      return t('pages.overview.heading-single', {
        totalPensions: `${numberToWords(totalPensions, locale)}`,
      });
    } else {
      return t('pages.overview.heading', {
        totalPensions: `${numberToWords(totalPensions, locale)}`,
      });
    }
  };

  return (
    <PensionsDashboardLayout
      title={title}
      showCommonLinks={totalPensions === 0}
    >
      <Heading level="h2" className="mb-12">
        {pensionsHeading()}
      </Heading>
      <div className="grid grid-cols-3 gap-16">
        <div className="col-span-3 lg:col-span-2">
          {hasPensions ? (
            <>
              {confirmedPensions.length > 0 && (
                <>
                  <Callout
                    variant={CalloutVariant.POSITIVE}
                    className={twMerge(calloutClasses)}
                  >
                    <Heading
                      level="h4"
                      className={twMerge(calloutHeadingClasses)}
                    >
                      {t('pages.overview.channels.confirmed.title')}
                    </Heading>
                    <PensionsList
                      pensions={confirmedPensions}
                      icon={<Icon type={IconType.TICK_GREEN} />}
                    />
                  </Callout>
                  <Link
                    asButtonVariant="primary"
                    href={`/${locale}/your-pensions`}
                    className={twMerge(calloutCtaClasses)}
                  >
                    {t('pages.overview.channels.confirmed.cta')}
                  </Link>
                </>
              )}

              {incompletePensions.length > 0 && (
                <>
                  <Callout
                    variant={CalloutVariant.WARNING}
                    className={twMerge(calloutClasses)}
                  >
                    <Heading
                      level="h4"
                      className={twMerge(calloutHeadingClasses)}
                    >
                      {t('pages.overview.channels.incomplete.title')}
                    </Heading>
                    <Paragraph>
                      {t('pages.overview.channels.incomplete.sub-title')}
                    </Paragraph>
                    <PensionsList
                      pensions={incompletePensions}
                      icon={<Icon type={IconType.EDIT} />}
                    />
                  </Callout>
                  <Link
                    asButtonVariant="primary"
                    href={`/${locale}/pending-pensions`}
                    className={twMerge(calloutCtaClasses)}
                  >
                    {t('pages.overview.channels.incomplete.cta')}
                  </Link>
                </>
              )}

              {unconfirmedPensions.length > 0 && (
                <>
                  <Callout
                    variant={CalloutVariant.NEGATIVE}
                    className={twMerge(calloutClasses)}
                  >
                    <Heading
                      level="h4"
                      className={twMerge(calloutHeadingClasses)}
                    >
                      {t('pages.overview.channels.unconfirmed.title')}
                    </Heading>
                    <Paragraph>
                      {t('pages.overview.channels.unconfirmed.sub-title')}
                    </Paragraph>
                    <PensionsList
                      pensions={unconfirmedPensions}
                      icon={
                        <Icon
                          type={IconType.WARNING}
                          className="scale-50 m-[-12px] fill-pink-600"
                        />
                      }
                    />
                  </Callout>
                  <Link
                    asButtonVariant="primary"
                    href={`/${locale}/pensions-that-need-action`}
                    className={twMerge(calloutCtaClasses)}
                  >
                    {t('pages.overview.channels.unconfirmed.cta')}
                  </Link>
                </>
              )}
              <div>
                <Link href={`/${locale}/manage-pensions`}>
                  {t('pages.overview.common-links.pensions-not-showing')}
                </Link>
              </div>
            </>
          ) : (
            <>
              <Heading level="h3" className="mb-4">
                {t('pages.overview.no-pensions.heading')}
              </Heading>
              <ul className="ml-8 list-disc text-md">
                {Array.from({ length: 10 }).map((_, index) => {
                  // max 10 items in the list
                  const content = t(
                    `pages.overview.no-pensions.item-${index + 1}`,
                  );
                  return (
                    !content.startsWith('<') && (
                      <li key={index}>
                        <Markdown className="mb-1" content={content} />
                      </li>
                    )
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const userSession = getUserSessionFromCookies(cookies);

  try {
    const {
      totalPensions,
      incompletePensions,
      confirmedPensions,
      unconfirmedPensions,
    } = await getPensionsOverview(userSession);

    const hasPensions = totalPensions > 0;

    return {
      props: {
        hasPensions,
        totalPensions,
        incompletePensions,
        confirmedPensions,
        unconfirmedPensions,
      },
    };
  } catch (error) {
    console.error('Error fetching all pensions:', error);
    return { notFound: true };
  }
};
