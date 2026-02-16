import { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { DebtAdvisorLocationMap } from 'components/DebtAdvisorLocationMap/DebtAdvisorLocationMap';
import { content } from 'data/face-to-face-refer';
import { debtAdviceLocatorAnalytics } from 'data/form-content/analytics';
import getOrganisations, { LIMIT, MAX_RESULTS } from 'utils/getFaceToFace';
import { getLocalData, ProviderType } from 'utils/getOrgData/getData';

import { BackLink } from '@maps-react/common/components/BackLink';
import { H1 } from '@maps-react/common/components/Heading';
import { Button } from '@maps-react/common/index';
import { Analytics } from '@maps-react/core/components/Analytics';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import DebtAdviceLocator, { getServerSidePropsData } from '.';

type Props = {
  links: ToolLinks;
  isEmbed: boolean;
  lang: string;
  providers: ProviderType[];
  searchQuery: string;
  limit: string | string[] | undefined;
  query: DataFromQuery;
  location: { lat: number; lng: number };
};

const FaceToFaceDebtRefer = ({
  links,
  isEmbed,
  lang,
  providers,
  searchQuery,
  limit,
  query,
  location,
}: Props) => {
  const { z } = useTranslation();
  const router = useRouter();
  const noResults = providers.length === 0;
  const maxResults = Number(limit) < MAX_RESULTS;
  const [clientProviders, setClientProviders] = useState<ProviderType[]>([]);

  const { title, intro } = content(
    z,
    links.question.goToQuestionThree,
    searchQuery,
    noResults,
  );

  const loadMore = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newLimit = limit ? Number(limit) + LIMIT : LIMIT + LIMIT;

    const data = await getOrganisations(
      searchQuery,
      newLimit ? String(newLimit) : String(LIMIT),
      location,
    );

    const prov = await getLocalData(data?.providers ? data.providers : []);
    const provideHASH = prov.length - LIMIT;

    setClientProviders(prov);

    router.push(
      {
        pathname: router.route,
        query: {
          ...router.query,
          limit: newLimit,
        },
        hash: `provider-${provideHASH}`,
      },
      undefined,
      { scroll: true },
    );
  };

  return (
    <DebtAdviceLocator step={'face'} isEmbed={isEmbed}>
      <Analytics
        analyticsData={debtAdviceLocatorAnalytics(z, 'face')}
        currentStep={'face'}
        lastStep={'face'}
        formData={query}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: false,
          toolCompletion: true,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Container className="lg:container-auto">
          <BackLink href={links.question.goToQuestionFour as string}>
            {z({
              en: 'Back',
              cy: 'Yn ôl',
            })}
          </BackLink>
          <form method="POST">
            <input
              type="hidden"
              name="isEmbed"
              value={isEmbed ? 'true' : 'false'}
            />
            <input type="hidden" name="language" value={lang} />
            <input
              type="hidden"
              name="savedData"
              value={JSON.stringify(query)}
            />
            <input
              type="hidden"
              name="dataPath"
              value={'/debt-advice-locator/face-to-face-debtline-refer'}
            />

            <div className="">
              <H1 className="mt-8 mb-10 text-gray-800">{title}</H1>
              <div className="mt-6">{intro}</div>

              <DebtAdvisorLocationMap
                providers={clientProviders.length ? clientProviders : providers}
                location={location}
                lang={lang}
              />
            </div>
            {maxResults && !noResults && (
              <Button
                onClick={(e) => loadMore(e)}
                variant="secondary"
                formAction={'/api/debt-advice-locator/load-more'}
                data-testid={'step-container-submit-button'}
              >
                {z({
                  en: 'Show more results',
                  cy: 'Milltiroedd i ffwrdd',
                })}
              </Button>
            )}

            {(!maxResults || noResults) && (
              <Button
                variant="link"
                as="a"
                href={links.question.goToQuestionFour}
                className="gap-0 font-bold text-[18px]"
              >
                {z({
                  en: 'Choose a different location',
                  cy: 'Dewiswch leoliad arall',
                })}
              </Button>
            )}
          </form>
        </Container>
      </Analytics>
    </DebtAdviceLocator>
  );
};

export default FaceToFaceDebtRefer;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const defaultProps = await getServerSidePropsData(params, query);
  const searchQuery = query['q-4'];
  const limit = query['limit'];

  const data = await getOrganisations(
    searchQuery as string,
    limit ? String(limit) : String(LIMIT),
  );

  const providers = await getLocalData(data.providers);

  return {
    props: {
      ...defaultProps.props,
      providers,
      searchQuery,
      query,
      limit: limit ?? String(LIMIT),
      location: data.location,
    },
  };
};
