//minimum pensionType permutations for each scenario
export const pensionScenarios = {
  statePension: ['state-pension'],
  definedBenefit: ['defined-benefit'],
  definedContribution: ['defined-contribution'],
  other: ['other'],
  notSure: ['not-sure'],
  combinationWithDB: ['defined-benefit', 'defined-contribution'],
  combinationWithDC: ['defined-contribution', 'other'],
  combinationWithDBWithoutDC: ['defined-benefit', 'other'],
  combinationWithState: ['state-pension', 'defined-contribution'],
  combinationWithNotSure: ['defined-contribution', 'not-sure'],
  combinationWithHybridAndNotSure: ['other', 'not-sure'],
  combinationWithDBHybridAndNotSure: ['defined-benefit', 'other', 'not-sure'],
  combinationWithStateDCAndNotSure: [
    'state-pension',
    'defined-contribution',
    'not-sure',
  ],
  combinationWithStateAndNotSure: ['state-pension', 'not-sure'],
  all: [
    'state-pension',
    'defined-benefit',
    'defined-contribution',
    'other',
    'not-sure',
  ],
} as const;

export const housingScenariosPrivateLandlord = [
  // Less than 10 years
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP16b',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP16a',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP16',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP16',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP16',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP16a',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP16',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP16',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP16a',
  },

  // More than 10 years
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP15a',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP15',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP15',
  },

  // Already retired
  {
    retirement: 'already-retired',
    pension: pensionScenarios.statePension,
    expected: 'GP16b',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP16a',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedContribution,
    expected: 'GP16',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.other,
    expected: 'GP16',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.notSure,
    expected: 'GP16',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP16a',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP16',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP16',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.all,
    expected: 'GP16a',
  },
] as const;

export const housingScenariosSocialHousing = [
  // Less than 10 years
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP14a',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP14b',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP14',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP14',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP14',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP14b',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP14',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP14',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP14b',
  },

  // More than 10 years
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP13',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP13',
  },

  // Already retired
  {
    retirement: 'already-retired',
    pension: pensionScenarios.statePension,
    expected: 'GP14a',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP14b',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedContribution,
    expected: 'GP14',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.other,
    expected: 'GP14',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.notSure,
    expected: 'GP14',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP14b',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP14',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP14',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.all,
    expected: 'GP14b',
  },
] as const;

export const housingScenariosMortgage = [
  // Less than 10 years
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP12a',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP12',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP12',
  },

  // More than 10 years
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP11',
  },
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP11',
  },

  // Already retired
  {
    retirement: 'already-retired',
    pension: pensionScenarios.statePension,
    expected: 'GP12a',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedContribution,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.other,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.notSure,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP12',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.all,
    expected: 'GP12',
  },
] as const;

export const housingScenariosNone = [
  // Less than 10 years
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP10a',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.definedContribution,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.other,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP10',
  },
  {
    retirement: 'less-than-10-years',
    pension: pensionScenarios.all,
    expected: 'GP10',
  },

  // More than 10 years
  {
    retirement: 'more-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP09a',
  },

  // Already retired
  {
    retirement: 'already-retired',
    pension: pensionScenarios.statePension,
    expected: 'GP10a',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedBenefit,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.definedContribution,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.other,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.notSure,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDC,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithState,
    expected: 'GP10',
  },
  {
    retirement: 'already-retired',
    pension: pensionScenarios.all,
    expected: 'GP10',
  },
] as const;

// GP09 is deactivated: more than 10 years + None / Other shows no housing guidance unless State Pension only (GP09a)
export const housingScenariosNoneNoGuidance = [
  { pension: pensionScenarios.definedBenefit },
  { pension: pensionScenarios.definedContribution },
  { pension: pensionScenarios.other },
  { pension: pensionScenarios.notSure },
  { pension: pensionScenarios.combinationWithDB },
  { pension: pensionScenarios.combinationWithDC },
  { pension: pensionScenarios.combinationWithState },
  { pension: pensionScenarios.all },
] as const;

export const overseasGuidanceScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP08a' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP08' },
  { pension: pensionScenarios.definedContribution, expected: 'GP08' },
  { pension: pensionScenarios.other, expected: 'GP08' },
  { pension: pensionScenarios.notSure, expected: 'GP08b' },

  // Combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP08' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP08' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP08' },
  {
    pension: pensionScenarios.combinationWithHybridAndNotSure,
    expected: 'GP08',
  },
  {
    pension: pensionScenarios.combinationWithDBHybridAndNotSure,
    expected: 'GP08',
  },
  { pension: pensionScenarios.combinationWithState, expected: 'GP08b' },
  {
    pension: pensionScenarios.combinationWithStateAndNotSure,
    expected: 'GP08b',
  },
  { pension: pensionScenarios.all, expected: 'GP08b' },
] as const;

export const overseasNoGuidanceScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension },
  { pension: pensionScenarios.definedBenefit },
  { pension: pensionScenarios.definedContribution },
  { pension: pensionScenarios.other },
  { pension: pensionScenarios.notSure },

  // Combinations
  { pension: pensionScenarios.combinationWithDB },
  { pension: pensionScenarios.combinationWithDC },
  { pension: pensionScenarios.combinationWithNotSure },
  { pension: pensionScenarios.combinationWithState },
  { pension: pensionScenarios.all },
] as const;

export const divorceGuidanceScenarios = [
  { pension: pensionScenarios.statePension, expected: 'GP17' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP17' },
  { pension: pensionScenarios.definedContribution, expected: 'GP17' },
  { pension: pensionScenarios.other, expected: 'GP17' },
  { pension: pensionScenarios.notSure, expected: 'GP17' },

  // Pension type combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP17' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP17' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP17' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP17' },
  { pension: pensionScenarios.all, expected: 'GP17' },
] as const;

export const divorceNoGuidanceScenarios = [
  { pension: pensionScenarios.statePension },
  { pension: pensionScenarios.definedBenefit },
  { pension: pensionScenarios.definedContribution },
  { pension: pensionScenarios.other },
  { pension: pensionScenarios.notSure },

  // Pension type combinations
  { pension: pensionScenarios.combinationWithDB },
  { pension: pensionScenarios.combinationWithDC },
  { pension: pensionScenarios.combinationWithState },
  { pension: pensionScenarios.combinationWithNotSure },
  { pension: pensionScenarios.all },
] as const;

export const employerContributingScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP03' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP02a' },
  { pension: pensionScenarios.definedContribution, expected: 'GP02' },
  { pension: pensionScenarios.other, expected: 'GP02' },
  { pension: pensionScenarios.notSure, expected: 'GP02b' },

  // Combinations
  { pension: ['defined-benefit', 'not-sure'], expected: 'GP02a' },
  { pension: ['defined-benefit', 'state-pension'], expected: 'GP02a' },
  { pension: pensionScenarios.combinationWithDB, expected: 'GP02b' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP02' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP02' },
  {
    pension: pensionScenarios.combinationWithStateAndNotSure,
    expected: 'GP02',
  },
  {
    pension: pensionScenarios.combinationWithStateDCAndNotSure,
    expected: 'GP02',
  },
  {
    pension: pensionScenarios.combinationWithHybridAndNotSure,
    expected: 'GP02',
  },
  { pension: pensionScenarios.combinationWithState, expected: 'GP02' },
  { pension: pensionScenarios.all, expected: 'GP02b' },
] as const;

export const employerNotContributingScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP03' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP03' },
  { pension: pensionScenarios.definedContribution, expected: 'GP03' },
  { pension: pensionScenarios.other, expected: 'GP03' },
  { pension: pensionScenarios.notSure, expected: 'GP03' },

  // Combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP03' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP03' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP03' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP03' },
  { pension: pensionScenarios.all, expected: 'GP03' },
] as const;

export const selfEmployedContributingScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP04' },
  { pension: pensionScenarios.definedContribution, expected: 'GP04' },
  { pension: pensionScenarios.other, expected: 'GP04' },
  { pension: pensionScenarios.notSure, expected: 'GP04' },

  // Combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP04' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP04' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP04' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP04' },
  { pension: pensionScenarios.all, expected: 'GP04' },
] as const;

export const selfEmployedNotContributingScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP05' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP05' },
  { pension: pensionScenarios.definedContribution, expected: 'GP05' },
  { pension: pensionScenarios.other, expected: 'GP05' },
  { pension: pensionScenarios.notSure, expected: 'GP05' },

  // Combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP05' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP05' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP05' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP05' },
  { pension: pensionScenarios.all, expected: 'GP05' },
] as const;

export const notEmployedContributingScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP06' },
  { pension: pensionScenarios.definedContribution, expected: 'GP06' },
  { pension: pensionScenarios.other, expected: 'GP06' },
  { pension: pensionScenarios.notSure, expected: 'GP06' },

  // Combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP06' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP06' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP06' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP06' },
  { pension: pensionScenarios.all, expected: 'GP06' },
] as const;

export const notEmployedNotContributingScenarios = [
  // Each pension type only
  { pension: pensionScenarios.statePension, expected: 'GP07' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP07' },
  { pension: pensionScenarios.definedContribution, expected: 'GP07' },
  { pension: pensionScenarios.other, expected: 'GP07' },
  { pension: pensionScenarios.notSure, expected: 'GP07' },

  // Combinations
  { pension: pensionScenarios.combinationWithDB, expected: 'GP07' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP07' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP07' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP07' },
  { pension: pensionScenarios.all, expected: 'GP07' },
] as const;

export const notEmployedNotContributingRetiredOrNearScenarios = [
  { pension: pensionScenarios.statePension, expected: 'GP07a' },
  { pension: pensionScenarios.definedBenefit, expected: 'GP07a' },
  { pension: pensionScenarios.definedContribution, expected: 'GP07a' },
  { pension: pensionScenarios.other, expected: 'GP07a' },
  { pension: pensionScenarios.notSure, expected: 'GP07a' },
  { pension: pensionScenarios.combinationWithDB, expected: 'GP07a' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP07a' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP07a' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP07a' },
  { pension: pensionScenarios.all, expected: 'GP07a' },
] as const;

export const notEmployedRetiredOrNearAcceptanceScenarios = [
  {
    ac: 'AC01',
    contribution: 'no',
    retirement: 'already-retired',
    pension: pensionScenarios.statePension,
    expected: 'GP07a',
  },
  {
    ac: 'AC02',
    contribution: 'no',
    retirement: 'already-retired',
    pension: pensionScenarios.notSure,
    expected: 'GP07a',
  },
  {
    ac: 'AC03',
    contribution: 'no',
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP07a',
  },
  {
    ac: 'AC04',
    contribution: 'not-sure',
    retirement: 'already-retired',
    pension: pensionScenarios.statePension,
    expected: 'GP07a',
  },
  {
    ac: 'AC05',
    contribution: 'not-sure',
    retirement: 'already-retired',
    pension: pensionScenarios.notSure,
    expected: 'GP07a',
  },
  {
    ac: 'AC06',
    contribution: 'not-sure',
    retirement: 'already-retired',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP07a',
  },
  {
    ac: 'AC07',
    contribution: 'no',
    retirement: 'less-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP07a',
  },
  {
    ac: 'AC08',
    contribution: 'no',
    retirement: 'less-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP07a',
  },
  {
    ac: 'AC09',
    contribution: 'no',
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP07a',
  },
  {
    ac: 'AC10',
    contribution: 'not-sure',
    retirement: 'less-than-10-years',
    pension: pensionScenarios.statePension,
    expected: 'GP07a',
  },
  {
    ac: 'AC11',
    contribution: 'not-sure',
    retirement: 'less-than-10-years',
    pension: pensionScenarios.notSure,
    expected: 'GP07a',
  },
  {
    ac: 'AC12',
    contribution: 'not-sure',
    retirement: 'less-than-10-years',
    pension: pensionScenarios.combinationWithDB,
    expected: 'GP07a',
  },
] as const;

export const contributionsNoGuidanceScenarios = [
  {
    employment: 'self-employed',
    contribution: 'yes',
    pension: pensionScenarios.definedBenefit,
  },
  {
    employment: 'not-employed',
    contribution: 'yes',
    pension: pensionScenarios.definedBenefit,
  },
] as const;

export const consolidationGuidanceScenarios = [
  { pension: pensionScenarios.definedBenefit, expected: 'GP01a' },
  { pension: pensionScenarios.definedContribution, expected: 'GP01' },
  { pension: pensionScenarios.other, expected: 'GP01' },
  { pension: pensionScenarios.combinationWithDBWithoutDC, expected: 'GP01a' },
  { pension: pensionScenarios.combinationWithDB, expected: 'GP01c' },
  { pension: pensionScenarios.combinationWithDC, expected: 'GP01' },
  { pension: pensionScenarios.combinationWithState, expected: 'GP01' },
  { pension: pensionScenarios.combinationWithNotSure, expected: 'GP01' },
  { pension: pensionScenarios.all, expected: 'GP01c' },
] as const;

export const consolidationNotSurePensionScenarios = [
  { consolidation: 'yes', pension: pensionScenarios.notSure, expected: 'GP01' },
  {
    consolidation: 'not-sure',
    pension: pensionScenarios.notSure,
    expected: 'GP01',
  },
] as const;

export const consolidationNoGuidanceScenarios = [
  // State Pension never returns consolidation guidance
  { pension: pensionScenarios.statePension, consolidation: 'yes' },
  { pension: pensionScenarios.statePension, consolidation: 'no' },
  { pension: pensionScenarios.statePension, consolidation: 'not-sure' },

  // No to consolidation returns no guidance
  { pension: pensionScenarios.definedBenefit, consolidation: 'no' },
  { pension: pensionScenarios.definedContribution, consolidation: 'no' },
  { pension: pensionScenarios.other, consolidation: 'no' },
  { pension: pensionScenarios.notSure, consolidation: 'no' },
  { pension: pensionScenarios.combinationWithDBWithoutDC, consolidation: 'no' },
  { pension: pensionScenarios.combinationWithDB, consolidation: 'no' },
  { pension: pensionScenarios.combinationWithDC, consolidation: 'no' },
  { pension: pensionScenarios.combinationWithState, consolidation: 'no' },
  { pension: pensionScenarios.combinationWithNotSure, consolidation: 'no' },
  { pension: pensionScenarios.all, consolidation: 'no' },
] as const;
