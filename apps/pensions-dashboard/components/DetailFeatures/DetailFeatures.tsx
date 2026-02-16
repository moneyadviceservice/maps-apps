import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { ChartIllustration } from '../../lib/types';

type DetailFeaturesProps = {
  illustration?: ChartIllustration;
};

export const DetailFeatures = ({ illustration }: DetailFeaturesProps) => {
  const { t } = useTranslation();

  if (!illustration) {
    return null;
  }

  const illArray = [illustration.eri, illustration.ap];

  const hasWarningUNP = illArray
    .flatMap((ill) => ill?.warnings)
    .includes(IllustrationWarning.UNP);

  const isIncreasing = illArray.some((ill) => ill?.increasing);

  const isSafeguarded = illArray.some((ill) => ill?.safeguardedBenefit);

  const items = [
    ...(isIncreasing ? [t('data.pensions.increasing')] : []),
    ...(hasWarningUNP ? [t('data.pensions.warnings.UNP-description')] : []),
    ...(isSafeguarded ? [t('data.pensions.safeguarded')] : []),
  ];

  if (items.length === 0) return null;

  return (
    <div data-testid="features" className="mt-2 lg:px-2">
      <ExpandableSection title="Features">
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
