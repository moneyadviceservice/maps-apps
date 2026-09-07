export const searchPage = {
  cardTestIdPrefix: 'document-card-',

  docs: {
    debtServiceSupervisors: 'money-wellness-ltd-debt-service-supervisors',
    capDebtAdvisorTraining: 'cap-debt-advisor-training',
    assessorInductionProgramme: 'assessor-induction-programme',
    helplineInductionProgramme: 'helpline-induction-programme',
    supportAndSupervisionSkills: 'support-and-supervision-skills',
    debtServicesProgramme:
      'money-wellness-ltd-debt-services-programme-for-supporting-people-through-financial-difficulty',
    assessor: 'assessor-induction-programme',
  },

  queries: {
    keywordCountRelevance: 'debt supervisor programme',
    recencyTieBreak: 'secured',
    noMatch: 'xyzzy-no-match-999',
    orderIndependenceA: 'debt supervisor',
    orderIndependenceB: 'supervisor debt',
    multiWordAcrossFields: 'money advisor programme',
    partialTitleMatch: 'assessor',
    fieldPriority: 'skills',
    wordingVariationPlural: 'debts',
    caseLower: 'debt',
    caseUpper: 'DEBT',
    caseMixed: 'Debt',
    exactPhraseVsScattered: 'debt advisor',
  },
};
