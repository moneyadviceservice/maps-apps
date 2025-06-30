import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionGroup, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type PensionDetailAccordionsProps = {
  data: PensionArrangement;
};

export const PensionDetailAccordions = ({
  data: { pensionType, group },
}: PensionDetailAccordionsProps) => {
  const { t } = useTranslation();

  if (
    group === PensionGroup.GREEN &&
    (pensionType === PensionType.DC || pensionType === PensionType.DB)
  ) {
    return (
      <div className="mt-10 *:mb-10 last:*:mb-0">
        <ExpandableSection
          title={t('pages.pension-details.information.about.title')}
          variant="mainLeftIcon"
        >
          {t('pages.pension-details.information.about.description')}
        </ExpandableSection>

        <ExpandableSection
          title={t(
            'pages.pension-details.information.how-estimate-is-calculated.title',
          )}
          variant="mainLeftIcon"
        >
          {t(
            `pages.pension-details.information.how-estimate-is-calculated.${pensionType.toLowerCase()}`,
          )}
        </ExpandableSection>
      </div>
    );
  } else {
    return null;
  }
};
