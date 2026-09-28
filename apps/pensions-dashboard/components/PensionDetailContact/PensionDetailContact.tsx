import React from 'react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionArrangement } from '../../lib/types';
import { ContactDetails } from '../ContactDetails';
import { DefinitionList } from '../DefinitionList';

type DetailsContactProps = {
  data: PensionArrangement;
};

export const PensionDetailContact = ({ data }: DetailsContactProps) => {
  const { t } = useTranslation();

  const listData = [
    {
      title: t('common.provider'),
      value: data.pensionAdministrator?.name ?? t('common.unavailable'),
      testId: 'provider',
    },
    {
      title: t('pages.pension-details.plan-details.plan-reference'),
      value: data.contactReference ?? t('common.unavailable'),
      testId: 'contact-reference',
    },
    ...ContactDetails(data.pensionAdministrator),
  ];

  return (
    <DefinitionList
      title={t('pages.pension-details.header.contact-provider')}
      subText={t('pages.pension-details.headings.contact-sub')}
      items={listData}
      titleFocusId="details-heading"
    />
  );
};
