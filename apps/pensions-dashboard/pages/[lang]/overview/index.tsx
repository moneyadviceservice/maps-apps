import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { twMerge } from 'tailwind-merge';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { PensionsList } from '../../../components/PensionsList';
import { getPensionsOverview } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import { getUserSessionFromCookies, numberToWords } from '../../../lib/utils';

const calloutClasses = 'mb-6 p-8';
const calloutHeadingClasses = 'mb-4';
const calloutCtaClasses = 'mb-12';

type Props = {
  hasPensions: boolean;
  totalPensions: number;
  incompletePensions: PensionArrangement[];
  confirmedPensions: PensionArrangement[];
  unconfirmedPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  title,
  hasPensions,
  totalPensions,
  incompletePensions,
  confirmedPensions,
  unconfirmedPensions,
}) => {
  return (
    <PensionsDashboardLayout
      title={title}
      showCommonLinks={totalPensions === 0}
    >
      <Heading level="h2" className="mb-12">
        {hasPensions ? (
          <>
            We found {numberToWords(totalPensions)} pension
            {totalPensions === 1 ? '' : 's'}
          </>
        ) : (
          <>We could not find any pensions</>
        )}
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
                      level="h6"
                      className={twMerge(calloutHeadingClasses)}
                    >
                      Pensions with complete information
                    </Heading>
                    <PensionsList
                      pensions={confirmedPensions}
                      icon={<Icon type={IconType.TICK_GREEN} />}
                    />
                  </Callout>
                  <Link
                    asButtonVariant="primary"
                    href="/en/your-pensions"
                    className={twMerge(calloutCtaClasses)}
                  >
                    See pensions breakdown
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
                      level="h6"
                      className={twMerge(calloutHeadingClasses)}
                    >
                      Pensions waiting for more information from your pension
                      providers
                    </Heading>
                    <PensionsList
                      pensions={incompletePensions}
                      icon={<Icon type={IconType.EDIT} />}
                    />
                  </Callout>
                  <Link
                    asButtonVariant="primary"
                    href="/en/pending-pensions"
                    className={twMerge(calloutCtaClasses)}
                  >
                    View pending pensions
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
                      level="h6"
                      className={twMerge(calloutHeadingClasses)}
                    >
                      Pensions that are a possible match with your details
                    </Heading>
                    <PensionsList
                      pensions={unconfirmedPensions}
                      icon={
                        <Icon
                          type={IconType.WARNING}
                          className="scale-50 m-[-12px]"
                        />
                      }
                    />
                  </Callout>
                  <Link
                    asButtonVariant="primary"
                    href="/en/pensions-that-need-action"
                    className={twMerge(calloutCtaClasses)}
                  >
                    Review pensions that need action
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Heading level="h3" className="mb-4">
                What you can do:
              </Heading>
              <ul className="list-disc ml-8 text-md">
                <li>
                  If you didn&apos;t provide your National Insurance number,{' '}
                  <Link href="/">go back and enter it</Link>.
                </li>
                <li>
                  If your State Pension is not showing and you think you&apos;re
                  entitled to one,{' '}
                  <Link href="/" className="!inline">
                    check your details using your State Pension forecast
                  </Link>
                  .
                </li>
                <li>
                  If you know the name of your employer(s) or pension
                  provider(s), you can contact them directly.
                </li>
                <li>
                  If you still cannot see your pensions, see our{' '}
                  <Link href="/">Help and support</Link>.
                </li>
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

    const title = 'Pensions found';

    return {
      props: {
        title,
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
