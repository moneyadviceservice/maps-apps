import { ReactNode } from 'react';

import useTranslation from '@maps-react/hooks/useTranslation';

import copy from '../../data/form-content/text/results';
import { StatutoryRedundancyPayResult } from '../../utils/calculateStatutoryRedundancyPay';
import { ContractualRedundancyProvided } from '../../utils/parseStoredData';
import { ContractualRedundancy } from '../../utils/parseStoredData/parseStoredData';

type ResultCopyOptions = {
  yearsWorked: number;
  contractualRedundancy: ContractualRedundancy;
  statutoryRedundancyPay: StatutoryRedundancyPayResult;
  z: ReturnType<typeof useTranslation>['z'];
};

/**
 * Determines the copy to display in the results box based on redundancy pay details and years worked.
 *
 * @param {ResultCopyOptions} options - The options for determining the results box copy.
 * @param {number} options.yearsWorked - The number of years the employee has worked.
 * @param {object} options.contractualRedundancy - Details about the contractual redundancy pay.
 * @param {ContractualRedundancyProvided} options.contractualRedundancy.provided - Indicates if contractual redundancy pay is provided.
 * @param {number} options.contractualRedundancy.amount - The amount of contractual redundancy pay.
 * @param {object} options.statutoryRedundancyPay - Details about the statutory redundancy pay.
 * @param {number} options.statutoryRedundancyPay.amount - The amount of statutory redundancy pay.
 * @param {Function} options.z - A function to transform the copy text.
 *
 * @returns {object} An object containing the results box copy details.
 * @returns {ReactNode} return.amount - The formatted amount to display in the results box.
 * @returns {boolean} return.showCalculation - Whether to show the calculation details.
 * @returns {boolean} return.isMinimum - Indicates if the displayed amount is the minimum entitlement.
 */
export function getResultsBoxCopy({
  yearsWorked,
  contractualRedundancy,
  statutoryRedundancyPay,
  z,
}: ResultCopyOptions): {
  amount: ReactNode;
  showCalculation: boolean;
  isMinimum: boolean;
} {
  const { provided, amount: contractualAmount } = contractualRedundancy;
  const statutoryAmount = statutoryRedundancyPay.amount;

  // Less than 2 years
  if (yearsWorked < 2) {
    if (provided === ContractualRedundancyProvided.Yes) {
      return {
        amount: z(copy.contractualRedunacyPay(contractualAmount)),
        showCalculation: false,
        isMinimum: false,
      };
    }

    if (provided === ContractualRedundancyProvided.Unknown) {
      return {
        amount: z(copy.minimumYearsWorkedAndUnknownContractual),
        showCalculation: false,
        isMinimum: false,
      };
    }

    return {
      amount: z(copy.minimumYearsWorked),
      showCalculation: false,
      isMinimum: false,
    };
  }

  // 2 years or more
  if (provided === ContractualRedundancyProvided.Unknown) {
    return {
      amount: z(copy.minimumEntitlement(statutoryAmount)),
      showCalculation: true,
      isMinimum: true,
    };
  }

  if (provided === ContractualRedundancyProvided.Yes) {
    if (contractualAmount > statutoryAmount) {
      return {
        amount: z(copy.contractualRedunacyPay(contractualAmount)),
        showCalculation: false,
        isMinimum: true,
      };
    }

    return {
      amount: z(
        copy.contractualStatutoryRedunacyPay(
          contractualAmount,
          statutoryAmount,
        ),
      ),
      showCalculation: true,
      isMinimum: true,
    };
  }

  return {
    amount: z(copy.statutoryEntitlement(statutoryAmount)),
    showCalculation: true,
    isMinimum: false,
  };
}
