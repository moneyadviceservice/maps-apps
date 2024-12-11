import { v4 as uuidv4 } from 'uuid';

import {
  AmountNotProvidedDetails,
  BenefitIllustrationComponent,
  PensionArrangement,
  PensionData,
} from '../types';
import { sortPensions } from '../utils/sortPensions';
import { getPensionData, UserSession } from './get-pensions-data';

const hasExcludedReason = (
  illustrationComponents: BenefitIllustrationComponent[],
  excludedReasons: string[],
) => {
  return illustrationComponents.some((component) =>
    excludedReasons.includes(component?.unavailableReason ?? ''),
  );
};

const filterConfirmedPensions = (data: PensionData) => {
  const excludedReasons = ['DCHP', 'DCSM'];
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules for Green
    // matchType is “DEFN”
    // AND
    // there is no illustrationUnavailable reason
    // OR
    // there is an amountNotProvidedReason code of "SML"
    // OR
    // it has illustrationUnavailable reason codes:
    // "DCHP" or "DCSM"
    .filter((pension) => {
      if (pension.matchType !== 'DEFN') {
        return false;
      }

      if (pension.benefitIllustrations) {
        return pension.benefitIllustrations.some((illustration) => {
          const hasNoUnavailableOrAmountNotProvided =
            illustration.illustrationComponents.some(
              (component) =>
                !component.unavailableReason ||
                (component.payableDetails as AmountNotProvidedDetails)
                  ?.reason === 'SML',
            );
          const hasExcluded = hasExcludedReason(
            illustration.illustrationComponents,
            excludedReasons,
          );
          return hasExcluded || hasNoUnavailableOrAmountNotProvided;
        });
      }
      // If benefitIllustrations is not defined, include the policy
      return true;
    });

  sortPensions(items);
  return items;
};

const filterIncompletePensions = (data: PensionData) => {
  const excludedReasons = ['DBC', 'DCC', 'NEW', 'DCHA', 'ANO', 'NET', 'TRN'];
  // get all incomplete pensions
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules
    // matchType is “DEFN”
    // AND
    // it has illustrationUnavailable reason codes:
    // “DBC”, “DCC”, “NEW”, “DCHA”, "ANO”, “NET” or “TRN"
    .filter(
      (pension) =>
        pension.matchType === 'DEFN' &&
        pension.benefitIllustrations?.some((illustration) =>
          hasExcludedReason(
            illustration.illustrationComponents,
            excludedReasons,
          ),
        ),
    );

  sortPensions(items);

  return items;
};

const filterUnconfirmedPensions = (data: PensionData) => {
  const excludedReasons = ['MEM', 'PPF', 'WU'];
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules
    // matchType is “POSS” or "CONT"
    // OR
    // matchType is “DEFN” AND
    // has illustrationUnavailable reason codes:
    // “MEM”, “PPF” and “WU”
    .filter(
      (pension) =>
        pension.matchType === 'POSS' ||
        pension.matchType === 'CONT' ||
        (pension.matchType === 'DEFN' &&
          pension.benefitIllustrations?.some((illustration) =>
            hasExcludedReason(
              illustration.illustrationComponents,
              excludedReasons,
            ),
          )),
    );

  sortPensions(items);

  return items;
};

export const getAllPensions = async (userSession: UserSession) => {
  // generate a correlation ID
  const mhpdCorrelationId = uuidv4();

  const data = await getPensionData({ userSession, mhpdCorrelationId });

  // if data retrieval is not complete, return null
  if (!data.pensionsDataRetrievalComplete) {
    return null;
  }

  // filter the pensions data
  const confirmedPensions = filterConfirmedPensions(data);
  const incompletePensions = filterIncompletePensions(data);
  const unconfirmedPensions = filterUnconfirmedPensions(data);

  return {
    confirmedPensions,
    incompletePensions,
    unconfirmedPensions,
  };
};
