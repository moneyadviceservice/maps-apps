import { VisibleSection } from 'components/VisibleSection/VisibleSection';

import { Heading } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BenefitsSGR1 } from './Benefits/BenefitsSGR1';
import { PreRetirementBenefitsSGR2 } from './Benefits/PreRetirementBenefitsSGR2';
import { DeathBenefitsSGR4 } from './DeathBenefits/DeathBenefitsSGR4';
import { DeathBenefitsSGR5 } from './DeathBenefits/DeathBenefitsSGR5';
import { GenderPensionGapSGR3 } from './GenderPensionGap/GenderPensionGap';
import { ScamsSGR6 } from './Scams/Scams';
import { StatePensionEligibilitySGR7 } from './StatePensionEligibility/StatePensionEligibilitySGR7';

type Props = {
  retireInNext10Years: boolean;
  notRetireInNext10Years: boolean;
  alreadyRetired: boolean;
};

export const StaticGuidance = ({
  retireInNext10Years,
  notRetireInNext10Years,
  alreadyRetired,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div key="static-guidance-intro" className="no-underline ">
      <Heading level="h3" variant="primary">
        {t('results.staticGuidance.heading')}
      </Heading>
      <StatePensionEligibilitySGR7 />
      <ScamsSGR6 />
      <VisibleSection visible={retireInNext10Years || alreadyRetired}>
        <DeathBenefitsSGR5 />
        <PreRetirementBenefitsSGR2 />
      </VisibleSection>
      <VisibleSection visible={notRetireInNext10Years}>
        <DeathBenefitsSGR4 />
        <BenefitsSGR1 />
      </VisibleSection>
      <VisibleSection visible={!alreadyRetired}>
        <GenderPensionGapSGR3 />
      </VisibleSection>
    </div>
  );
};
