import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { BenefitIllustration, RecurringIncomeDetails } from '../../lib/types';

type DetailFeaturesProps = {
  illustration: BenefitIllustration | null;
};

export const DetailFeatures = ({ illustration }: DetailFeaturesProps) => {
  const { t } = useTranslation();

  if (!illustration) {
    return null;
  }

  const hasWarningUNP = illustration.illustrationComponents.some((component) =>
    component.illustrationWarnings?.includes(IllustrationWarning.UNP),
  );

  const isIncreasing = illustration.illustrationComponents.some(
    (component) =>
      component.payableDetails &&
      (component.payableDetails as RecurringIncomeDetails).increasing,
  );

  const isSafeguarded = illustration.illustrationComponents.some(
    (component) => component.safeguardedBenefit,
  );

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
