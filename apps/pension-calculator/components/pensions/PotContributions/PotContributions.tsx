import { PensionPotsCopy } from 'data/pensions';
import { frequencyOptions } from 'data/your-income';
import { DefinedContributionPot } from 'types/pensions/pensions';
import {
  annualManagementChargeId,
  contributionFieldId,
} from 'utils/pensionFieldIds';

import { Details } from '@maps-react/common/components/Details';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Contribution } from '../Contribution';
import { MoneyField } from '../MoneyField';

interface PotContributionsProps {
  index: number;
  pot: DefinedContributionPot;
  errors: Record<string, string[]>;
  updatePot: <K extends keyof DefinedContributionPot>(
    index: number,
    field: K,
    value: DefinedContributionPot[K],
  ) => void;
  copy: PensionPotsCopy;
}

export const PotContributions = ({
  index,
  pot,
  errors,
  updatePot,
  copy,
}: PotContributionsProps) => {
  const { z } = useTranslation();
  const options = frequencyOptions(z);

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <Contribution
        kind="employee"
        label={copy.employeeContribution}
        contribution={pot.employeeContribution}
        potIndex={index}
        error={errors[contributionFieldId('employee', 'value', index)]?.[0]}
        copy={copy}
        options={options}
        onChange={(updatedContribution) =>
          updatePot(index, 'employeeContribution', updatedContribution)
        }
      />
      <Contribution
        kind="employer"
        label={copy.employerContribution}
        contribution={pot.employerContribution}
        potIndex={index}
        error={errors[contributionFieldId('employer', 'value', index)]?.[0]}
        copy={copy}
        options={options}
        onChange={(updatedContribution) =>
          updatePot(index, 'employerContribution', updatedContribution)
        }
      />
      <MoneyField
        id={annualManagementChargeId(index)}
        label={copy.annualManagementCharge}
        value={pot.annualManagementCharge}
        error={errors[annualManagementChargeId(index)]?.[0]}
        onChange={(value) => updatePot(index, 'annualManagementCharge', value)}
      />
      <Details title={copy.feeGuidanceTitle}>
        <p>{copy.feeGuidance}</p>
      </Details>
    </div>
  );
};
