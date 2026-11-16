import { pensionPotsCopy } from 'data/pension-pots-summary';
import { PENSIONS_API } from 'hooks/usePensionsForm/usePensionsForm';
import { potNameId, potRemoveId } from 'utils/pensionFieldIds/pensionFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { H3 } from '@maps-react/common/components/Heading/Heading';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type PensionContribution = {
  mode?: string;
  value?: string | number;
  frequency?: string;
};

export type PensionPot = {
  name?: string;
  currentValue?: string;
  taxFreeCash?: string;
  employeeContribution?: PensionContribution;
  employerContribution?: PensionContribution;
  annualManagementCharge?: string;
};

type PensionSummaryCardProps = {
  pot: PensionPot;
  index: number;
  handleRemove: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  sessionId: string;
};

export const PensionSummaryCard = ({
  pot,
  index,
  handleRemove,
  sessionId,
}: PensionSummaryCardProps) => {
  if (!pot.currentValue) {
    return null;
  }

  const lang = useContextLanguage();
  const { z } = useTranslation();

  const formatCurrency = (val?: string) => {
    if (!val) return '—';
    return val.startsWith('£') ? val : `£${val}`;
  };

  const formatContribution = (contribution?: PensionContribution) => {
    if (!contribution?.value) return '—';
    const amount =
      contribution.mode === 'percentage'
        ? `${contribution.value}%`
        : `£${contribution.value}`;
    return `${amount} ${pensionPotsCopy(z).pensionCard.monthlyFrequencyLabel}`;
  };

  return (
    <article className="w-full">
      <div className="flex items-center justify-between pb-3">
        <span className="text-base font-bold text-gray-900">
          {pensionPotsCopy(z).pensionCard.pensionLabel} {index + 1}
        </span>
        <Button
          as="a"
          variant="link"
          href={`/${lang}/pots-of-money/details?sessionId=${sessionId}#${potNameId(
            index,
          )}`}
          className=" text-blue-700"
        >
          {pensionPotsCopy(z).pensionCard.editDetailsLinkLabel}
        </Button>
      </div>

      <div className="border-t border-gray-300 py-3.5">
        <H3 className="text-3xl font-bold tracking-tight text-gray-900">
          {pot.name ||
            `${pensionPotsCopy(z).pensionCard.pensionLabel} ${index + 1}`}
        </H3>
      </div>

      <dl className="border-t border-gray-300 divide-y divide-gray-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 py-3.5 gap-2">
          <dt className="text-base text-gray-900">
            {pensionPotsCopy(z).pensionCard.currentValueLabel}
          </dt>
          <dd className="text-base font-bold text-gray-900">
            {formatCurrency(pot.currentValue)}
          </dd>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 py-3.5 gap-2">
          <dt className="text-base text-gray-900">
            {pensionPotsCopy(z).pensionCard.yourContributionLabel}
          </dt>
          <dd className="text-base font-bold text-gray-900">
            {formatContribution(pot.employeeContribution)}
          </dd>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 py-3.5 gap-2">
          <dt className="text-base text-gray-900">
            {pensionPotsCopy(z).pensionCard.employerContributionLabel}
          </dt>
          <dd className="text-base font-bold text-gray-900">
            {formatContribution(pot.employerContribution)}
          </dd>
        </div>
      </dl>

      <div className="border-t border-gray-300 pt-4">
        <Button
          key={potRemoveId(index)}
          variant="link"
          id={potRemoveId(index)}
          formAction={`${PENSIONS_API}?step=details&action=remove&index=${index}`}
          onClick={(event) => handleRemove(event, index)}
          className="gap-0"
        >
          {pensionPotsCopy(z).pensionCard.removeButtonLabel}
        </Button>
      </div>
    </article>
  );
};
