import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationWarning } from '../../lib/constants';
import { BenefitIllustration } from '../../lib/types';

type DetailFeaturesProps = {
  illustration: BenefitIllustration | null;
};

export const MoreDetails = ({ illustration }: DetailFeaturesProps) => {
  const { t } = useTranslation();

  if (!illustration) {
    return null;
  }

  const warningsList: Partial<Record<IllustrationWarning, string>> = {
    [IllustrationWarning.CUR]: t('data.pensions.warnings.CUR-description'),
    [IllustrationWarning.DEF]: t('data.pensions.warnings.DEF-description'),
    [IllustrationWarning.TVI]: t('data.pensions.warnings.TVI-description'),
  };

  const warningCodes = Object.keys(warningsList) as IllustrationWarning[];

  const warningsFound = illustration.illustrationComponents
    .flatMap((component) => component.illustrationWarnings || [])
    .filter((warning) => warningCodes.includes(warning));

  const hasSurvivor = illustration.illustrationComponents.some(
    (component) => component.survivorBenefit,
  );

  const items = [
    ...Array.from(warningsFound).map((warning) => warningsList[warning]),
    ...(hasSurvivor ? [t('data.pensions.survivor-benefit')] : []),
  ];

  if (items.length === 0) return null;

  return (
    <div data-testid="more-details" className="mt-2 lg:px-2">
      <ExpandableSection title="More details">
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
