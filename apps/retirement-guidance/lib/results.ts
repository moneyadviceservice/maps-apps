import { EmploymentOutcome, HousingOutcome } from 'lib/types';

import { DataFromQuery } from '@maps-react/utils/pageFilter/pageFilter';

import { QUESTION_PREFIX } from './constants';

export const getRetirementStatusFlags = (data: DataFromQuery) => {
  const answerQ2 = data[`${QUESTION_PREFIX}2`];
  const retireInNext10Years = answerQ2 === '0';
  const notRetireInNext10Years = answerQ2 === '1';
  const alreadyRetired = answerQ2 === '2';

  const notRetired = retireInNext10Years || notRetireInNext10Years;
  return [
    retireInNext10Years,
    notRetireInNext10Years,
    notRetired,
    alreadyRetired,
  ];
};

export const getDivorceStatusFlags = (data: DataFromQuery) => {
  const answerQ8 = data[`${QUESTION_PREFIX}8`];
  const goingThroughDivorce = answerQ8 === '0';

  return { goingThroughDivorce };
};

export const getDebtAdviceStatusFlags = (data: DataFromQuery) => {
  const answerQ11 = data[`${QUESTION_PREFIX}11`] ?? undefined;
  const hadDebtAdvice = answerQ11 === '0';
  const hasNeverHadDebtAdvice = answerQ11 === '1';

  return [hadDebtAdvice, hasNeverHadDebtAdvice];
};

export const getOverseasStatusFlags = (data: DataFromQuery) => {
  const answerQ7 = data[`${QUESTION_PREFIX}7`] ?? undefined;
  const hasOverseasPension = answerQ7 === '0';
  const hasNotSureAboutOverseasPension = answerQ7 === '2';
  return hasOverseasPension || hasNotSureAboutOverseasPension;
};

export const getPensionTypesSelected = (data: DataFromQuery) => {
  const answerQ5 = data[`${QUESTION_PREFIX}5`] ?? undefined;
  const hasDefinedBenefitPension = answerQ5?.includes('1');
  const hasDefinedContributionPension = answerQ5?.includes('0');
  const hasStatePension = answerQ5?.includes('2');
  const hasOtherPension = answerQ5?.includes('3');
  const hasNotSureAboutPension = answerQ5?.includes('4');
  return [
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  ];
};

export const getPensionOutcome = (data: DataFromQuery) => {
  const [
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  ] = getPensionTypesSelected(data);

  const showOverseasSection = getOverseasStatusFlags(data);

  let showSection8a = false,
    showSection8b = false,
    showSection8 = false;

  // Early return if not retiring overseas
  if (!showOverseasSection) {
    return { showSection8a, showSection8b, showSection8 };
  }

  const otherPensionsSelected =
    hasDefinedBenefitPension ||
    hasDefinedContributionPension ||
    hasOtherPension;

  // Scenario 1: State Pension only → 08a
  if (hasStatePension && !otherPensionsSelected && !hasNotSureAboutPension) {
    showSection8a = true;
  }
  // Scenario 2: Not sure about pension type → 08b
  else if (hasNotSureAboutPension) {
    showSection8b = true;
  }
  // Scenario 3: Any combination including State Pension → 08b
  else if (hasStatePension && otherPensionsSelected) {
    showSection8b = true;
  }
  // Scenario 4: DC, DB, Hybrid, or Other (without State Pension) → 08
  else if (!hasStatePension && otherPensionsSelected) {
    showSection8 = true;
  }

  return { showSection8a, showSection8b, showSection8 };
};

const getPensionTypeAnalysis = (pensionTypes: {
  hasDefinedBenefitPension: boolean;
  hasDefinedContributionPension: boolean;
  hasStatePension: boolean;
  hasOtherPension: boolean;
  hasNotSureAboutPension: boolean;
}) => {
  const {
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  } = pensionTypes;

  const pensionTypesCount = [
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  ].filter(Boolean).length;

  const hasSinglePensionType = pensionTypesCount === 1;
  const hasMultiplePensionTypes = pensionTypesCount > 1;

  return {
    pensionTypesCount,
    hasSinglePensionType,
    hasMultiplePensionTypes,
  };
};

const getConsolidationFlags = (answerQ6: string | undefined) => {
  const consideringConsolidation = answerQ6 === '0';
  const notConsideringConsolidation = answerQ6 === '1';
  const notSureAboutConsolidation = answerQ6 === '2';
  const isYesOrNotSure = consideringConsolidation || notSureAboutConsolidation;

  return {
    consideringConsolidation,
    notConsideringConsolidation,
    notSureAboutConsolidation,
    isYesOrNotSure,
  };
};

export const getConsolidationOutcome = (data: DataFromQuery) => {
  const [
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  ] = getPensionTypesSelected(data);

  const { hasSinglePensionType, hasMultiplePensionTypes } =
    getPensionTypeAnalysis({
      hasDefinedBenefitPension,
      hasDefinedContributionPension,
      hasStatePension,
      hasOtherPension,
      hasNotSureAboutPension,
    });

  const { isYesOrNotSure } = getConsolidationFlags(data[`${QUESTION_PREFIX}6`]);

  let showConsolidation1 = false;
  let showConsolidation1a = false;
  const showConsolidation1b = false; // Not currently in use, so always false
  let showConsolidation1c = false;
  let showFindYourPensionType22 = false;

  // Package 22: Not sure is the only selected pension type
  if (hasSinglePensionType && hasNotSureAboutPension) {
    showFindYourPensionType22 = true;
  }
  // Package 01c: Combination with DB and DC + Yes/Not sure
  else if (
    hasDefinedBenefitPension &&
    hasDefinedContributionPension &&
    isYesOrNotSure
  ) {
    showConsolidation1c = true;
  }
  // Package 01a: DB only OR combination with DB but no DC + Yes/Not sure
  else if (
    (hasSinglePensionType && hasDefinedBenefitPension && isYesOrNotSure) ||
    (hasMultiplePensionTypes && hasDefinedBenefitPension && isYesOrNotSure)
  ) {
    showConsolidation1a = true;
  }
  // Package 01: DC only OR Other only OR combination without DB + Yes/Not sure
  else if (
    (hasSinglePensionType &&
      (hasDefinedContributionPension || hasOtherPension) &&
      isYesOrNotSure) ||
    (hasMultiplePensionTypes && !hasDefinedBenefitPension && isYesOrNotSure)
  ) {
    showConsolidation1 = true;
  }

  return {
    showConsolidation1,
    showConsolidation1a,
    showConsolidation1b,
    showConsolidation1c,
    showFindYourPensionType22,
  };
};

const getPrimaryGoalFlags = (data: DataFromQuery) => {
  const answerQ1 = data[`${QUESTION_PREFIX}1`];
  const answerQ2 = data[`${QUESTION_PREFIX}2`];

  const [retireInNext10Years, notRetireInNext10Years] =
    getRetirementStatusFlags(data);
  const alreadyRetired = answerQ2 === '2';
  const [, hasDefinedContributionPension] = getPensionTypesSelected(data);

  // Primary goal options from Q1
  const goalHowMyPensionWorks = answerQ1 === '0';
  const goalHowMuchMoney = answerQ1 === '1';
  const goalHowToGrow = answerQ1 === '2';
  const goalWhenAndHow = answerQ1 === '4';

  const isHowMyPensionWorksNotRetired =
    goalHowMyPensionWorks && !alreadyRetired;
  const isHowMyPensionWorksAlreadyRetired =
    goalHowMyPensionWorks && alreadyRetired;
  const isHowMuchMoneyMoreThan10Years =
    goalHowMuchMoney && notRetireInNext10Years;
  const isHowMuchMoneyLessThan10Years = goalHowMuchMoney && retireInNext10Years;
  const isHowMuchMoneyAlreadyRetired = goalHowMuchMoney && alreadyRetired;
  // DC pension (alone or combined) + <10 years → 24b
  const isWhenAndHowLessThan10YearsDC =
    goalWhenAndHow && retireInNext10Years && !!hasDefinedContributionPension;
  // Non-DC pension + <10 years → 24c
  const isWhenAndHowLessThan10YearsNonDC =
    goalWhenAndHow && retireInNext10Years && !hasDefinedContributionPension;
  // Any pension type + >10 years → 24c
  const isWhenAndHowMoreThan10Years = goalWhenAndHow && notRetireInNext10Years;
  const isWhenAndHowAlreadyRetired = goalWhenAndHow && alreadyRetired;
  const isHowToGrowAlreadyRetired = goalHowToGrow && alreadyRetired;
  return {
    isHowMyPensionWorksNotRetired,
    isHowMyPensionWorksAlreadyRetired,
    isHowMuchMoneyMoreThan10Years,
    isHowMuchMoneyLessThan10Years,
    isHowMuchMoneyAlreadyRetired,
    isWhenAndHowLessThan10YearsDC,
    isWhenAndHowLessThan10YearsNonDC,
    isWhenAndHowMoreThan10Years,
    isWhenAndHowAlreadyRetired,
    isHowToGrowAlreadyRetired,
  };
};
export const getPrimaryGoalOutcome = (data: DataFromQuery) => {
  const {
    isHowMyPensionWorksNotRetired,
    isHowMyPensionWorksAlreadyRetired,
    isHowMuchMoneyMoreThan10Years,
    isHowMuchMoneyLessThan10Years,
    isHowMuchMoneyAlreadyRetired,
    isWhenAndHowLessThan10YearsDC,
    isWhenAndHowLessThan10YearsNonDC,
    isWhenAndHowMoreThan10Years,
    isWhenAndHowAlreadyRetired,
    isHowToGrowAlreadyRetired,
  } = getPrimaryGoalFlags(data);
  let showPrimaryGoal22 = false; // How my pension works (not retired)
  let showPrimaryGoal22a = false; // How my pension works (already retired)
  let showPrimaryGoal25 = false; // How much money (more than 10 years)
  let showPrimaryGoal25a = false; // How much money (less than 10 years)
  let showPrimaryGoal25b = false; // How much money (already retired)
  const showPrimaryGoal24 = false; // When and how – retained, not currently used (MVP+)
  let showPrimaryGoal24a = false; // When and how (already retired)
  let showPrimaryGoal24b = false; // When and how (DC pension, less than 10 years)
  let showPrimaryGoal24c = false; // When and how (non-DC pension or more than 10 years)
  let showPrimaryGoal26 = false; // How to grow (already retired only)

  // Package 22: How my pension works (not retired)
  if (isHowMyPensionWorksNotRetired) {
    showPrimaryGoal22 = true;
  }
  // Package 22a: How my pension works (already retired)
  else if (isHowMyPensionWorksAlreadyRetired) {
    showPrimaryGoal22a = true;
  }
  // Package 25: How much money (more than 10 years from retirement)
  else if (isHowMuchMoneyMoreThan10Years) {
    showPrimaryGoal25 = true;
  }
  // Package 25a: How much money (less than 10 years from retirement)
  else if (isHowMuchMoneyLessThan10Years) {
    showPrimaryGoal25a = true;
  }
  // Package 25b: How much money (already retired)
  else if (isHowMuchMoneyAlreadyRetired) {
    showPrimaryGoal25b = true;
  }
  // Package 24b: When and how – DC pension, less than 10 years
  else if (isWhenAndHowLessThan10YearsDC) {
    showPrimaryGoal24b = true;
  }
  // Package 24c: When and how – non-DC pension, less than 10 years
  else if (isWhenAndHowLessThan10YearsNonDC) {
    showPrimaryGoal24c = true;
  }
  // Package 24c: When and how – more than 10 years (any pension type)
  else if (isWhenAndHowMoreThan10Years) {
    showPrimaryGoal24c = true;
  }
  // Package 24a: When and how (already retired)
  else if (isWhenAndHowAlreadyRetired) {
    showPrimaryGoal24a = true;
  }
  // Package 26: How to grow (already retired only)
  else if (isHowToGrowAlreadyRetired) {
    showPrimaryGoal26 = true;
  }

  return {
    showPrimaryGoal22,
    showPrimaryGoal22a,
    showPrimaryGoal25,
    showPrimaryGoal25a,
    showPrimaryGoal25b,
    showPrimaryGoal24,
    showPrimaryGoal24a,
    showPrimaryGoal24b,
    showPrimaryGoal24c,
    showPrimaryGoal26,
  };
};

const NO_GUIDANCE: EmploymentOutcome = {
  showEmployment02: false,
  showEmployment02a: false,
  showEmployment02b: false,
  showEmployment03: false,
  showEmployment04: false,
  showEmployment05: false,
  showEmployment06: false,
  showEmployment07: false,
};

const getEmployerContributingPackage = (
  isStatePensionOnly: boolean,
  isDefinedBenefitOnly: boolean,
  isDefinedBenefitInCombination: boolean,
  hasNotSureAboutPension: boolean,
): EmploymentOutcome => {
  if (isStatePensionOnly) {
    return { ...NO_GUIDANCE, showEmployment03: true };
  }
  if (isDefinedBenefitOnly) {
    return { ...NO_GUIDANCE, showEmployment02a: true };
  }
  if (isDefinedBenefitInCombination || hasNotSureAboutPension) {
    return { ...NO_GUIDANCE, showEmployment02b: true };
  }
  return { ...NO_GUIDANCE, showEmployment02: true };
};

const getSelfEmployedOutcome = (
  paysIntoPension: boolean,
  isDefinedBenefitOnly: boolean,
): EmploymentOutcome => {
  if (!paysIntoPension) {
    return { ...NO_GUIDANCE, showEmployment05: true };
  }
  return isDefinedBenefitOnly
    ? NO_GUIDANCE
    : { ...NO_GUIDANCE, showEmployment04: true };
};

const getNotEmployedOutcome = (
  paysIntoPension: boolean,
  isDefinedBenefitOnly: boolean,
): EmploymentOutcome => {
  if (!paysIntoPension) {
    return { ...NO_GUIDANCE, showEmployment07: true };
  }
  return isDefinedBenefitOnly
    ? NO_GUIDANCE
    : { ...NO_GUIDANCE, showEmployment06: true };
};

export const getEmploymentOutcome = (
  data: DataFromQuery,
): EmploymentOutcome => {
  const answerQ3 = data[`${QUESTION_PREFIX}3`];
  const answerQ4 = data[`${QUESTION_PREFIX}4`];

  const hasEmployer = answerQ3 === '0';
  const isSelfEmployed = answerQ3 === '1';
  const isNotEmployed = answerQ3 === '2';

  const paysIntoPension = answerQ4 === '0';

  const [
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  ] = getPensionTypesSelected(data);

  // DB only - no other pension types selected
  const isDefinedBenefitOnly =
    hasDefinedBenefitPension &&
    !hasDefinedContributionPension &&
    !hasStatePension &&
    !hasOtherPension &&
    !hasNotSureAboutPension;

  // State Pension only - no other pension types selected
  const isStatePensionOnly =
    hasStatePension &&
    !hasDefinedBenefitPension &&
    !hasDefinedContributionPension &&
    !hasOtherPension &&
    !hasNotSureAboutPension;

  // DB in combination with at least one other type
  const isDefinedBenefitInCombination =
    hasDefinedBenefitPension &&
    (hasDefinedContributionPension || hasStatePension || hasOtherPension);

  if (hasEmployer) {
    if (paysIntoPension) {
      return getEmployerContributingPackage(
        isStatePensionOnly,
        isDefinedBenefitOnly,
        isDefinedBenefitInCombination,
        hasNotSureAboutPension,
      );
    }
    return { ...NO_GUIDANCE, showEmployment03: true };
  }

  if (isSelfEmployed) {
    return getSelfEmployedOutcome(paysIntoPension, isDefinedBenefitOnly);
  }

  if (isNotEmployed) {
    return getNotEmployedOutcome(paysIntoPension, isDefinedBenefitOnly);
  }

  return NO_GUIDANCE;
};

const NO_HOUSING: HousingOutcome = {
  showHousing09: false,
  showHousing09a: false,
  showHousing10: false,
  showHousing10a: false,
  showHousing11: false,
  showHousing12: false,
  showHousing12a: false,
  showHousing13: false,
  showHousing14: false,
  showHousing14a: false,
  showHousing14b: false,
  showHousing15: false,
  showHousing15a: false,
  showHousing16: false,
  showHousing16a: false,
  showHousing16b: false,
};

const getMoreThan10YearsHousing = (
  housingCost: string | undefined,
  isStatePensionOnly: boolean,
): HousingOutcome => {
  if (housingCost === '0') {
    // Rent – private landlord: State Pension only → 15a, else → 15
    return isStatePensionOnly
      ? { ...NO_HOUSING, showHousing15a: true }
      : { ...NO_HOUSING, showHousing15: true };
  }
  if (housingCost === '1') {
    // Rent – social housing: always → 13
    return { ...NO_HOUSING, showHousing13: true };
  }
  if (housingCost === '2') {
    // Mortgage: always → 11
    return { ...NO_HOUSING, showHousing11: true };
  }
  if (housingCost === '3') {
    // None: State Pension only → 09a, else → 09
    return isStatePensionOnly
      ? { ...NO_HOUSING, showHousing09a: true }
      : { ...NO_HOUSING, showHousing09: true };
  }
  return NO_HOUSING;
};

const resolveByPensionType = (
  isStatePensionOnly: boolean,
  hasDefinedBenefitPension: boolean,
  spOnlyOutcome: HousingOutcome,
  dbOutcome: HousingOutcome,
  defaultOutcome: HousingOutcome,
): HousingOutcome => {
  if (isStatePensionOnly) return spOnlyOutcome;
  if (hasDefinedBenefitPension) return dbOutcome;
  return defaultOutcome;
};

const getLessThan10OrRetiredHousing = (
  housingCost: string | undefined,
  isStatePensionOnly: boolean,
  hasDefinedBenefitPension: boolean,
): HousingOutcome => {
  if (housingCost === '0') {
    // Rent – private landlord: SP only → 16b; DB present → 16a; else → 16
    return resolveByPensionType(
      isStatePensionOnly,
      hasDefinedBenefitPension,
      { ...NO_HOUSING, showHousing16b: true },
      { ...NO_HOUSING, showHousing16a: true },
      { ...NO_HOUSING, showHousing16: true },
    );
  }
  if (housingCost === '1') {
    // Rent – social housing: SP only → 14a; DB present → 14b; else → 14
    return resolveByPensionType(
      isStatePensionOnly,
      hasDefinedBenefitPension,
      { ...NO_HOUSING, showHousing14a: true },
      { ...NO_HOUSING, showHousing14b: true },
      { ...NO_HOUSING, showHousing14: true },
    );
  }
  if (housingCost === '2') {
    // Mortgage: SP only → 12a; else → 12
    return isStatePensionOnly
      ? { ...NO_HOUSING, showHousing12a: true }
      : { ...NO_HOUSING, showHousing12: true };
  }
  if (housingCost === '3') {
    // None: SP only → 10a; else → 10
    return isStatePensionOnly
      ? { ...NO_HOUSING, showHousing10a: true }
      : { ...NO_HOUSING, showHousing10: true };
  }
  return NO_HOUSING;
};

export const getHousingOutcome = (data: DataFromQuery): HousingOutcome => {
  const answerQ2 = data[`${QUESTION_PREFIX}2`];
  const answerQ9 = data[`${QUESTION_PREFIX}9`];

  const lessThan10Years = answerQ2 === '0';
  const moreThan10Years = answerQ2 === '1';
  const alreadyRetired = answerQ2 === '2';

  const [
    hasDefinedBenefitPension,
    hasDefinedContributionPension,
    hasStatePension,
    hasOtherPension,
    hasNotSureAboutPension,
  ] = getPensionTypesSelected(data);

  const isStatePensionOnly =
    hasStatePension &&
    !hasDefinedBenefitPension &&
    !hasDefinedContributionPension &&
    !hasOtherPension &&
    !hasNotSureAboutPension;

  if (moreThan10Years) {
    return getMoreThan10YearsHousing(answerQ9, isStatePensionOnly);
  }

  if (lessThan10Years || alreadyRetired) {
    return getLessThan10OrRetiredHousing(
      answerQ9,
      isStatePensionOnly,
      hasDefinedBenefitPension,
    );
  }

  return NO_HOUSING;
};
