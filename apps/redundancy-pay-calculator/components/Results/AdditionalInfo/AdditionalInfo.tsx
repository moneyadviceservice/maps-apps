import { Paragraph } from '@maps-react/common/index';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import copy from '../../../data/form-content/text/results';
import {
  getDateFromMY,
  StatutoryRedundancyPayResult,
} from '../../../utils/calculateStatutoryRedundancyPay';
import { isNextFinancialYear } from '../../../utils/isNextFinancialYear';
import {
  ContractualRedundancyProvided,
  ParsedData,
} from '../../../utils/parseStoredData';

type Props = {
  parsedData: ParsedData;
  statutoryRedundancyPay: StatutoryRedundancyPayResult;
  yearsWorked: number;
};

export const AdditionalInfo = ({
  parsedData,
  statutoryRedundancyPay,
  yearsWorked,
}: Props) => {
  const { z } = useTranslation();

  if (
    undefined === parsedData.jobEnd ||
    undefined === parsedData.contractualRedundancy
  )
    return;

  const jobEndDate = getDateFromMY(parsedData.jobEnd);

  const isEndDateInNextFinancialYear = isNextFinancialYear(jobEndDate) === 1;

  const isContractualLessThanStatutory =
    parsedData.contractualRedundancy.amount < statutoryRedundancyPay.amount;

  const hasContractualPay =
    parsedData.contractualRedundancy.provided ===
    ContractualRedundancyProvided.Yes;

  const noContractualPay =
    parsedData.contractualRedundancy.provided ===
    ContractualRedundancyProvided.No;

  const contractualAmountUnknown =
    parsedData.contractualRedundancy.provided ===
    ContractualRedundancyProvided.Unknown;

  return (
    <div className="pt-2 pb-6">
      {yearsWorked >= 2 && (
        <>
          {isEndDateInNextFinancialYear && (
            <>
              {(noContractualPay ||
                contractualAmountUnknown ||
                (hasContractualPay &&
                  !contractualAmountUnknown &&
                  isContractualLessThanStatutory)) && (
                <Paragraph>
                  {z(copy.additionalInfo.nextFinancialYear)}{' '}
                </Paragraph>
              )}
            </>
          )}
          {(contractualAmountUnknown ||
            (hasContractualPay && isContractualLessThanStatutory)) && (
            <Paragraph>
              {z(copy.additionalInfo.contractualUnknownOrLessThanStatutory)}
            </Paragraph>
          )}
        </>
      )}
      {yearsWorked < 2 && contractualAmountUnknown && (
        <Paragraph>
          {z(copy.additionalInfo.contractualUnknownOrLessThanStatutory)}
        </Paragraph>
      )}
    </div>
  );
};
