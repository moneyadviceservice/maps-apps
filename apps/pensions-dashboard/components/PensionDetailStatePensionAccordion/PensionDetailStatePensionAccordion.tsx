import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionGroup } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type PensionDetailStatePensionAccordionProps = {
  data: PensionArrangement;
};

export const PensionDetailStatePensionAccordion = ({
  data: { group },
}: PensionDetailStatePensionAccordionProps) => {
  const { t } = useTranslation();

  if (group !== PensionGroup.GREEN) {
    return null;
  }

  return (
    <ExpandableSection
      title={t('pages.pension-details.information.about.title')}
      variant="mainLeftIcon"
    >
      <Markdown
        content={t('pages.pension-details.information.about.sp-description')}
      />
    </ExpandableSection>
  );
};
