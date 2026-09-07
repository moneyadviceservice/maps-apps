import { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import ControlBar from 'components/ControlBar/ControlBar';
import Results from 'components/Results/Results';
import { BaseLayout } from 'layout/BasePageLayout/BaseLayout';
import {
  DetailsPagesListModel,
  DirectoryPageMetadata,
  GroupedTag,
  SiteConfigType,
} from 'lib/types/site.type';
import {
  fetchDetailsPageList,
  fetchLearningPathwayHubMetadata,
  fetchSideNavigation,
  fetchSiteSettings,
  fetchTags,
} from 'lib/utils/fetchContent/fetchContent';
import {
  filterAndSearchCards,
  setCheckedFilter,
  sortByCards,
  validateTags,
} from 'lib/utils/filterCard/filterCards';
import {
  defaultQueryParams,
  filterTags,
  getQueryParamValue,
  orderTags,
} from 'lib/utils/pageFilter/pageFilter';
import {
  DEFAULT_SORT_ORDER,
  getSortOrder,
  isSortOrder,
  RELEVANCE_SORT_ORDER,
  SortOrder,
} from 'lib/utils/sortCards/sortCards';
import { randomInt } from 'node:crypto';
import { BackToTop } from '@maps-digital/shared/ui';

import { PaginationProps } from '@maps-react/common/components/Pagination';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  SideFiltersDesktop,
  SideFiltersMobile,
} from '@maps-react/mps/components/SideFilters';
import { SideNavigation } from '@maps-react/mps/components/SideNavigation';
import { SideNavigationModel } from '@maps-react/mps/types';
import {
  trackFilterEvent,
  trackSearchEvent,
} from '@maps-react/mps/utils/analytics/trackEvents';
import { paginateItems } from '@maps-react/utils/pagination/paginationUtils';

type PageProps = PaginationProps & {
  siteConfig: SiteConfigType;
  cardDetails: DetailsPagesListModel[];
  metadata: DirectoryPageMetadata | null;
  tags: GroupedTag[];
  assetPath: string;
  orderList: readonly SortOrder[];
  language: string;
  sideNavigation: SideNavigationModel | null;
  limit: string;
  order: SortOrder;
  keyword?: string;
  isFilterExpanded?: boolean;
};

const Page = ({
  siteConfig,
  cardDetails,
  metadata,
  tags,
  assetPath,
  language,
  sideNavigation,
  isFilterExpanded,
  orderList,
  limit,
  order,
  keyword,
  ...paginationProps
}: PageProps) => {
  const { t, locale } = useTranslation();

  const router = useRouter();
  const [cardsLimit, setCardsLimit] = useState(limit);

  //Unique key to render SideFilterDesktop and SideFilterMobile when clicking clear-all link
  const filterKey = (): string => {
    return Object.entries(router.query)
      .map(([, value]) =>
        Array.isArray(value) ? value.join('-') : value ?? '',
      )
      .join('-');
  };

  const buildQueryParams = (
    e:
      | React.SubmitEvent<HTMLFormElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const form = e.currentTarget.closest('form');
    if (!form) return;

    const formdata = new FormData(form);
    const params: Record<string, string> = {};
    formdata.forEach((value, key) => {
      if (['keyword-current', 'lang', 'order'].includes(key) || !value) return;

      if (params[key]) {
        params[key] += `,${value}`;
      } else params[key] = value as string;
    });
    const searchParams = new URLSearchParams(params);
    return searchParams;
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = buildQueryParams(e);
    const url = `/${language}/learning-pathway`;

    //Track analytics for search events
    const searchTerm = data?.get('keyword');
    if (searchTerm) trackSearchEvent(searchTerm);

    //Track analytics for filter events
    if (data) {
      for (const [key, value] of data) {
        const groupTags = new Set(value.split(','));

        tags.forEach((r) => {
          if (r.key === key) {
            r.tags.forEach((tagItem) => {
              if (groupTags.has(tagItem.value)) {
                trackFilterEvent(r.group, String(tagItem.label));
              }
            });
          }
        });
      }
    }
    if (data) router.push(`${url}?${data.toString()}`);
    else router.push(url);
  };

  const handleCardsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.preventDefault();
    const formData = buildQueryParams(e);

    let url = `/${language}/learning-pathway`;
    if (formData) {
      const l = formData.get('limit');
      if (l) setCardsLimit(l);
      url += `?${formData.toString()}`;
    }
    router.push(url);
  };

  return (
    <BaseLayout
      siteConfig={siteConfig}
      bannerTitle={metadata?.bannerTitle ?? ''}
      seoDescription={metadata?.seoDescription ?? ''}
      seoTitle={metadata?.seoTitle ?? ''}
      assetPath={assetPath}
      language={language}
      sideNavigation={sideNavigation}
      pageType="Learning pathway hub"
      categoryLevels={[metadata?.bannerTitle ?? '']}
      toolCompletion={true}
      toolData={{
        stepName: metadata?.bannerTitle,
        toolCategory: metadata?.bannerTitle,
        toolName: metadata?.bannerTitle,
        toolStep: 2,
      }}
    >
      {/* Desktop view */}
      <form
        className="hidden lg:block"
        method="GET"
        action="/api/filter"
        data-testid="filter-list-desktop"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <div className="flex flex-col min-w-[300px] space-y-6">
            <SideNavigation lang={language} navigation={sideNavigation} />

            <input type="hidden" value={locale} name="lang" />
            {tags.length > 0 && (
              <SideFiltersDesktop
                keyProp={filterKey()}
                tags={tags}
                lang={locale}
                searchKeyword={(keyword as string) || ''}
                title={t('learning-pathway-list.filtersTitle')}
                clearAllTitle={t('learning-pathway-list.clearFiltersButton')}
                clearAllLink={`/${language}/learning-pathway`}
                searchTitle={t('learning-pathway-list.searchTitle')}
                applyFiltersLabel={t(
                  'learning-pathway-list.applyFiltersButton',
                )}
              />
            )}
          </div>
          <div className="space-y-8">
            <ControlBar
              order={order}
              orderList={orderList}
              limit={cardsLimit}
              total={paginationProps.totalItems}
              onCardsPerPageChange={handleCardsPerPageChange}
            />
            <Results sortedCards={cardDetails} {...paginationProps} />
          </div>
        </div>
      </form>

      {/* Mobile view  */}

      <form
        className="block lg:hidden"
        method="GET"
        action="/api/filter"
        data-testid="filter-list-mobile"
      >
        <div className="space-y-8 mt-10">
          <input type="hidden" value={locale} name="lang" />
          <ControlBar
            order={order}
            orderList={orderList}
            limit={cardsLimit}
            total={paginationProps.totalItems}
            onCardsPerPageChange={handleCardsPerPageChange}
          />
          {tags.length > 0 && (
            <SideFiltersMobile
              key={filterKey()}
              tags={tags}
              isOpen={isFilterExpanded}
              lang={locale}
              searchKeyword={(keyword as string) || ''}
              title={t('learning-pathway-list.filtersTitle')}
              clearAllTitle={t('learning-pathway-list.clearFiltersButton')}
              clearAllLink={`/${language}/learning-pathway`}
              searchTitle={t('learning-pathway-list.searchTitle')}
              applyFiltersLabel={t('learning-pathway-list.applyFiltersButton')}
            />
          )}
          <Results sortedCards={cardDetails} {...paginationProps} />
        </div>
      </form>
      <div className="flex justify-end mt-4">
        <BackToTop />
      </div>
    </BaseLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const language = (context.params?.language as string) || 'en';
  const { query } = context;
  const { keyword, p, limit, order, ...rest } = query;

  const keywordValue = getQueryParamValue(keyword);
  const pageValue = getQueryParamValue(p, defaultQueryParams.page);

  const limitValue = getQueryParamValue(limit, defaultQueryParams.limit);

  const [siteConfig, cardDetails, tags, sideNavigation, metadata] =
    await Promise.all([
      fetchSiteSettings(language),
      fetchDetailsPageList(language),
      fetchTags(),
      fetchSideNavigation(language),
      fetchLearningPathwayHubMetadata(language),
    ]);

  if (!siteConfig || !cardDetails) {
    return { notFound: true };
  }

  /*Find the query params that are related to fitlers/tags*/
  const paramTags = validateTags(rest, tags);

  const sortOrder: SortOrder = isSortOrder(order)
    ? order
    : keyword
    ? RELEVANCE_SORT_ORDER
    : DEFAULT_SORT_ORDER;

  // Filter cards by filter and search terms
  const filteredCards = filterAndSearchCards(
    cardDetails,
    paramTags,
    keywordValue,
  );

  // Sort cards by `relevance` if search term present
  // or `randomize` results if no sort term is selected
  // or sort by the sort term selected
  const sortedCards = sortByCards(
    filteredCards,
    keywordValue,
    sortOrder,
    randomInt(10_000),
  );

  // Paginate cards
  const { items, pagination } = paginateItems(sortedCards, {
    page: Number(pageValue),
    limit: Number(limitValue),
  });

  /* Update the results to include the value isChecked to identify which filters are checked*/
  const checkedTags = setCheckedFilter(tags, paramTags);
  const filteredTags = filterTags(checkedTags, language);

  const orderedTags = orderTags(filteredTags);
  const orderList: readonly SortOrder[] = getSortOrder(!!keyword);

  return {
    props: {
      siteConfig,
      cardDetails: items,
      metadata,
      tags: orderedTags ?? [],
      language,
      sideNavigation,
      limit: limitValue ?? defaultQueryParams.limit,
      isFilterExpanded: Object.keys(paramTags)?.length > 0 || !!keyword,
      assetPath: process.env.AEM_HOST ?? '',
      orderList,
      order: sortOrder,
      keyword: keywordValue ?? '',
      ...pagination,
    },
  };
};
