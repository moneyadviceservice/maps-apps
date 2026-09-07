import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { ChartIllustration } from '../../lib/types';

type DetailFeaturesProps = {
  illustration?: ChartIllustration;
  testId?: string;
};

export const MoreDetails = ({
  illustration,
  testId = 'more-details',
}: DetailFeaturesProps) => {
  const { t } = useTranslation();

  if (!illustration) {
    return null;
  }

  const warningDefinitions: Array<{
    code: IllustrationWarning;
    text: string;
  }> = [
    {
      code: IllustrationWarning.PSO,
      text: t('data/warnings.PSO-title'),
    },
    {
      code: IllustrationWarning.PEO,
      text: t('data/warnings.PEO-title'),
    },
    {
      code: IllustrationWarning.PNR,
      text: t('data/warnings.PNR-title'),
    },
    {
      code: IllustrationWarning.SCP,
      text: t('data/warnings.SCP-title'),
    },
    {
      code: IllustrationWarning.FAS,
      text: t('data/warnings.FAS-title-benefit'),
    },
    {
      code: IllustrationWarning.CUR,
      text: t('data/warnings.CUR-description'),
    },
    {
      code: IllustrationWarning.DEF,
      text: t('data/warnings.DEF-description'),
    },
    {
      code: IllustrationWarning.TVI,
      text: t('data/warnings.TVI-description'),
    },
  ];

  const illArray = [illustration.eri, illustration.ap];

  const warnings = new Set(illArray.flatMap((ill) => ill?.warnings ?? []));

  const hasSurvivor = illArray.some((ill) => ill?.survivorBenefit);

  const items = [
    ...warningDefinitions
      .filter(({ code }) => warnings.has(code))
      .map(({ text }) => text),
    ...(hasSurvivor ? [t('data/survivor-benefit')] : []),
  ];

  if (items.length === 0) return null;

  return (
    <div data-testid={testId} className="mt-2 lg:px-2">
      <ExpandableSection
        title={t('components.pension-detail-income-values.more-details-title')}
      >
        <ListElement
          className="mb-3 space-y-4 leading-[1.6] ml-9 marker:text-2xl marker:leading-[1]"
          color="blue"
          variant="unordered"
          items={items}
        />
      </ExpandableSection>
    </div>
  );
};
