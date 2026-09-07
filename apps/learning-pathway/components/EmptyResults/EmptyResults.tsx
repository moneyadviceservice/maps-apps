import { H2, ListElement, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';

const EmptyResults = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <H2 className="text-2xl font-bold">{t('empty-results.title')}</H2>
      <Paragraph>{t('empty-results.description.text')}</Paragraph>
      <ListElement
        items={[
          t('empty-results.description.list-1'),
          t('empty-results.description.list-2'),
          t('empty-results.description.list-3'),
          t('empty-results.description.list-4'),
        ]}
        className="ml-4"
        color="dark"
        variant="unordered"
        dataTestId="empty-results-list"
      />
    </div>
  );
};

export default EmptyResults;
