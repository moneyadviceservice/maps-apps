import { ReactNode } from 'react';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import { TranslationGroup } from '@maps-react/hooks/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import copy from '../../../data/form-content/text/results';
import { StatutoryRedundancyPayResult } from '../../../utils/calculateStatutoryRedundancyPay';
import { getResultsBoxCopy } from '../../../utils/getResultsBoxCopy/getResultsBoxCopy';
import { Country, ParsedData } from '../../../utils/parseStoredData';

type Props = {
  parsedData: ParsedData;
  statutoryRedundancyPay: StatutoryRedundancyPayResult;
  yearsWorked: number;
};

export const ResultsBox = ({
  parsedData,
  statutoryRedundancyPay,
  yearsWorked,
}: Props) => {
  const { z } = useTranslation();
  if (
    undefined === parsedData.contractualRedundancy ||
    undefined === parsedData.jobEnd
  )
    return;

  const { amount, showCalculation, isMinimum } = getResultsBoxCopy({
    yearsWorked,
    contractualRedundancy: parsedData.contractualRedundancy,
    statutoryRedundancyPay,
    z,
  });

  const [month, year] = parsedData.jobEnd.split('-');
  const jobEndDate = new Date(`${year}-${month}-01`);

  const cutoffDate = new Date('2025-03-31');

  let statutoryLimits;

  const isNorthernIreland = parsedData.country === Country.NorthernIreland;
  const isAfterCutoffDate = jobEndDate > cutoffDate;

  // for Northern Ireland
  if (isNorthernIreland) {
    statutoryLimits = isAfterCutoffDate
      ? copy.statutoryLimits.NorthernIreland
      : copy.statutoryLimits.NorthernIrelandPreApril25;
    // for England, Scotland, and Wales
  } else {
    statutoryLimits = isAfterCutoffDate
      ? copy.statutoryLimits.base
      : copy.statutoryLimits.basePreApril25;
  }

  return (
    <div className="border-[8px] rounded-bl-[36px] border-teal-400 p-6 mb-4 lg:mb-0">
      {amount}

      {showCalculation && (
        <ExpandableSection title={z(copy.howIsThisCalculated)}>
          <ListElement
            variant="unordered"
            color="dark"
            className="px-2 mx-4 mt-4 mr-2 list-outside"
            items={translateArray(
              z,
              copy.entitlementWeeks(
                statutoryRedundancyPay.entitlementWeeks,
                isMinimum,
              ),
            )}
          />

          <div className="my-4">
            <hr className="border-slate-400" />
          </div>

          <div>
            <p className="pb-2">{z(copy.ratesIntro)}</p>
          </div>
          <ListElement
            variant="unordered"
            color="dark"
            className="px-2 mx-4 mr-2 list-outside"
            items={translateArray(z, copy.rates)}
          />

          <div className="my-4">
            <hr className="border-slate-400" />
          </div>

          <ListElement
            variant="unordered"
            color="dark"
            className="px-2 mx-4 mr-2 list-outside"
            items={translateArray(z, statutoryLimits)}
          />
        </ExpandableSection>
      )}
    </div>
  );
};

const translateArray = (
  z: ReturnType<typeof useTranslation>['z'],
  translationGroups: TranslationGroup[],
) => {
  const result: ReactNode[] = [];

  for (const value of translationGroups) {
    result.push(z(value));
  }
  return result;
};
