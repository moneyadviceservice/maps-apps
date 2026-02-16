import { GetServerSideProps } from 'next';

import { ListingsLayout } from 'layouts/ListingsLayout';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';
import { getListingsFirms } from 'utils/listings/getListingsFirms';
import type { QueryParams } from 'utils/query/queryHelpers';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { type Pagination as PaginationType } from '@maps-react/utils/pagination';

type BaseProps = {
  lang: 'en' | 'cy';
  firms: TravelInsuranceFirmDocument[];
  query: QueryParams;
  pagination: PaginationType | null;
};

const Page = ({ lang, firms, query, pagination }: BaseProps) => {
  const { z } = useTranslation();
  const title = appTitle(z);
  const showResultsSection = pagination !== null;

  return (
    <ToolPageLayout
      pageTitle={pageTitle('Firm listings page', z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      layout="grid"
      mainClassName="mb-8 mt-0 text-gray-800 lg:max-w-[1272px] mx-auto"
      className="pt-8 mb-4"
    >
      <ListingsLayout
        lang={lang}
        query={query}
        firms={firms}
        pagination={pagination}
        showResultsSection={showResultsSection}
      />
    </ToolPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const queryParams = (query || {}) as QueryParams;
  const { firms, pagination } = await getListingsFirms(queryParams);

  return {
    props: {
      lang: lang === 'cy' ? 'cy' : 'en',
      firms,
      query: queryParams,
      pagination,
    },
  };
};
