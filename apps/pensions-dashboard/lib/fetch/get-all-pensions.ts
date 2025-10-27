import { IllustrationType, PensionGroup, PensionType } from '../constants';
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
  return illustrationComponents.some(
    (component) =>
      component.illustrationType === IllustrationType.ERI &&
      excludedReasons.includes(component?.unavailableReason ?? ''),
  );
};

export const includedPensionTypes = [
  PensionType.SP,
  PensionType.DB,
  PensionType.DC,
];
export const unsupportedPensionTypes = [
  PensionType.AVC,
  PensionType.HYB,
  PensionType.CB,
  PensionType.CDC,
];

const filterGreenPensions = (data: PensionData): PensionArrangement[] => {
  const excludedReasons = ['DCSM', 'DB'];
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules for Green - With Income
    // matchType is “DEFN”
    // AND
    // the illustrationType is ERI
    // AND
    // there is no illustrationUnavailable reason
    // OR
    // it has illustrationUnavailable reason codes:
    // "DCSM" or "DB"
    .filter((pension) => {
      if (!includedPensionTypes.includes(pension.pensionType)) {
        return false;
      }

      if (pension.matchType !== 'DEFN') {
        return false;
      }

      // If benefitIllustrations is not defined, include the policy
      if (!pension.benefitIllustrations) {
        return true;
      }

      return pension.benefitIllustrations.some((illustration) => {
        const hasNoUnavailable = illustration.illustrationComponents.some(
          (component) =>
            component.illustrationType === IllustrationType.ERI &&
            (component.payableDetails as AmountNotProvidedDetails)?.reason !==
              'SML' &&
            !component.unavailableReason,
        );

        const hasExcluded = hasExcludedReason(
          illustration.illustrationComponents,
          excludedReasons,
        );

        return hasExcluded || hasNoUnavailable;
      });
    })
    .map((item) => ({ ...item, group: PensionGroup.GREEN }));

  sortPensions(items);
  return items;
};

const filterGreenPensionsNoIncome = (
  data: PensionData,
): PensionArrangement[] => {
  const excludedReasons = ['DCHA', 'DCHP', 'PPF', 'WU'];
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules for Green - No income
    // matchType is “DEFN”
    // AND
    // the illustrationType is ERI
    // AND
    // there is no illustrationUnavailable reason
    // AND
    // there is an amountNotProvidedReason code of "SML"
    // OR
    // it has illustrationUnavailable reason codes:
    // "DCHA", "DCHP", "PPF" or "WU"
    .filter((pension) => {
      if (!includedPensionTypes.includes(pension.pensionType)) {
        return false;
      }

      if (pension.matchType !== 'DEFN') {
        return false;
      }

      if (!pension.benefitIllustrations) {
        return false;
      }

      return pension.benefitIllustrations.some((illustration) => {
        const hasNoUnavailableAndAmountNotProvided =
          illustration.illustrationComponents.some(
            (component) =>
              component.illustrationType === IllustrationType.ERI &&
              !component.unavailableReason &&
              (component.payableDetails as AmountNotProvidedDetails)?.reason ===
                'SML',
          );

        const hasExcluded = hasExcludedReason(
          illustration.illustrationComponents,
          excludedReasons,
        );

        return hasExcluded || hasNoUnavailableAndAmountNotProvided;
      });
    })
    .map((item) => ({ ...item, group: PensionGroup.GREEN_NO_INCOME }));

  sortPensions(items);
  return items;
};

const filterYellowPensions = (data: PensionData): PensionArrangement[] => {
  const excludedReasons = ['DBC', 'DCC', 'NEW', 'ANO', 'NET', 'TRN'];
  // get all incomplete pensions
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules for Yellow
    // matchType is “SYS” or "NEW"
    // OR
    // matchType is “DEFN”
    // AND
    // the illustrationType is ERI
    // AND
    // it has illustrationUnavailable reason codes:
    // “DBC”, “DCC”, “NEW”, "ANO”, “NET” or “TRN"
    .filter(
      (pension) =>
        includedPensionTypes.includes(pension.pensionType) &&
        (pension.matchType === 'SYS' ||
          pension.matchType === 'NEW' ||
          (pension.matchType === 'DEFN' &&
            pension.benefitIllustrations?.some((illustration) =>
              hasExcludedReason(
                illustration.illustrationComponents,
                excludedReasons,
              ),
            ))),
    )
    .map((item) => ({ ...item, group: PensionGroup.YELLOW }));

  sortPensions(items);

  return items;
};

const filterRedPensions = (data: PensionData): PensionArrangement[] => {
  const excludedReasons = ['MEM'];
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules for Red
    // matchType is “POSS” or "CONT"
    // OR
    // matchType is “DEFN”
    // AND
    // the illustrationType is ERI
    // AND
    // has illustrationUnavailable reason codes:
    // “MEM”
    .filter(
      (pension) =>
        (includedPensionTypes.includes(pension.pensionType) ||
          pension.matchType === 'POSS') &&
        !unsupportedPensionTypes.includes(pension.pensionType) &&
        (pension.matchType === 'POSS' ||
          pension.matchType === 'CONT' ||
          (pension.matchType === 'DEFN' &&
            pension.benefitIllustrations?.some((illustration) =>
              hasExcludedReason(
                illustration.illustrationComponents,
                excludedReasons,
              ),
            ))),
    )
    .map((item) => ({ ...item, group: PensionGroup.RED }));

  sortPensions(items);

  return items;
};

const filterUnsupportedPensions = (data: PensionData): PensionArrangement[] => {
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules for unsupported pensions
    // pensionType is AVC, HYB, CB or CDC
    .filter((pension) => unsupportedPensionTypes.includes(pension.pensionType));
  sortPensions(items);
  return items;
};

export const getAllPensions = async (userSession: UserSession) => {
  const data = await getPensionData({ userSession });

  // if data retrieval is not complete, return null
  if (!data.pensionsDataRetrievalComplete) {
    return null;
  }

  // filter the pensions data
  const greenPensions = filterGreenPensions(data);
  const greenPensionsNoIncome = filterGreenPensionsNoIncome(data);
  const yellowPensions = filterYellowPensions(data);
  const redPensions = filterRedPensions(data);
  const unsupportedPensions = filterUnsupportedPensions(data);

  return {
    greenPensions,
    greenPensionsNoIncome,
    yellowPensions,
    redPensions,
    unsupportedPensions,
  };
};
