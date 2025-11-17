import React from 'react';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { DefinitionList } from '../../components/DefinitionList';
import { InformationType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type DetailsMoreProps = {
  data: PensionArrangement;
};

export const PensionDetailMoreInfo = ({ data }: DetailsMoreProps) => {
  const { t } = useTranslation();
  if (!data.additionalDataSources) return null;
  const dataSources = data.additionalDataSources;
  const dataTypeOrder = Object.values(InformationType);
  const sortedData = dataSources.toSorted((a, b) => {
    return (
      dataTypeOrder.indexOf(a.informationType) -
      dataTypeOrder.indexOf(b.informationType)
    );
  });

  const listData = sortedData.flatMap((source) => [
    {
      title: (
        <>
          {t(`data.pensions.additional-types.${source.informationType}`)}{' '}
          {source.informationType === InformationType.C_AND_C ? (
            <Markdown
              className="ml-1 font-normal"
              disableParagraphs
              content={t('tooltips.costs-and-charges')}
            />
          ) : (
            ''
          )}
        </>
      ),
      value: (
        <Link
          asInlineText
          target="_blank"
          href={source.url}
          className="break-all"
        >
          {source.url}
        </Link>
      ),
      testId: `more-info-${source.informationType}`,
    },
  ]);

  return (
    <DefinitionList
      title={t('pages.pension-details.headings.more-information')}
      subText={t('pages.pension-details.headings.more-information-sub')}
      items={listData}
    />
  );
};
