import { useMemo } from 'react';

import { DetailsPagesListModel } from 'lib/types/site.type';
import { filterTags, normalizeDate } from 'lib/utils/pageFilter/pageFilter';
import { twMerge } from 'tailwind-merge';

import { ContentCard, Link, ListElement } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

type DocumentCardType = {
  details: DetailsPagesListModel;
};

const DocumentCard = ({ details }: DocumentCardType) => {
  const { t, locale } = useTranslation();

  const tagsList = useMemo(
    () => filterTags(details.pageTags, locale),
    [details.pageTags, locale],
  );

  return (
    <ContentCard
      title={details.pageTitle}
      headingClassName="text-blue-700"
      className="px-2 pb-8 border-gray-95 border-3"
      testId={`document-card-${details.slug}`}
    >
      <div className="space-y-6">
        <div className="block lg:hidden">
          {mapJsonRichText(details?.overview?.json)}
        </div>
        <div className="flex-col space-y-4 lg:flex justify-between pb-4 border-b-2 border-gray-95">
          <Link href={`/${locale}/learning-pathway/${details.slug}`}>
            {t('learning-pathway-list.documentLinkTitle')}
          </Link>
          <div>
            <span className="font-bold pr-2">
              {t('document-pages.dateLaunchedTitle')}
            </span>
            {normalizeDate(details.dateLaunched)}
          </div>
        </div>
        <div className="flex border-b-2 border-gray-95 lg:border-0 pb-4 lg:pb-0">
          <div className="font-bold">{t('document-pages.ownerTitle')}</div> :{' '}
          {details.owner}
        </div>
        <div className="hidden lg:block">
          {mapJsonRichText(details?.overview?.json)}
        </div>
        <div className="flex flex-col lg:flex-row">
          {tagsList.map((tags, index) => {
            const tagList = tags.tags.map((item) => item.label);
            return (
              <div
                key={tags.key}
                className={twMerge(
                  'border-b-1 lg:border-b-0',
                  'pb-10 lg:pb-0',
                  index !== 0 && ['pt-4 lg:pt-0 lg:border-l-1'],
                  index === tagsList.length - 1 && ['border-b-0'],
                  'border-gray-95',
                  'lg:border-gray-300',
                  'pl-2',
                  'lg:basis-1/4',
                )}
              >
                <div className="font-bold">{tags.group}</div>
                <ListElement
                  variant="unordered"
                  color="blue"
                  items={tagList}
                  className="ml-8 pt-4 pr-4"
                />
              </div>
            );
          })}
        </div>
      </div>
    </ContentCard>
  );
};

export default DocumentCard;
