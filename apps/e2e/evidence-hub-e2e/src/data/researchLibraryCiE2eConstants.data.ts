/**
 * Stable values for CI mock document Playwright tests.
 * Keep in sync with `apps/evidence-hub/fixtures/e2e/documents.json`.
 */
export const researchLibraryCiE2eConstants = {
  documentCount: 20,
  searchKeyword: 'robo-advice',
  noResultsKeyword: 'xyz-no-match-keyword',
  sort: {
    year2022: {
      firstTitle:
        'Children and Young People Financial Education Innovation and Evaluation Programme: Synthesis Report',
      lastTitle: "Does robo-advice improve people's loan repayment decisions?",
    },
  },
  filters: {
    'last-5': {
      count: 3,
      title:
        'Children and Young People Financial Education Innovation and Evaluation Programme: Synthesis Report',
    },
    'more-than-5': {
      count: 17,
      title: 'Changing behaviour around online transactions',
    },
    topicSaving: {
      count: 7,
    },
    topicDebt: {
      count: 6,
    },
    pageTypeEvaluation: {
      count: 20,
      title: 'Changing behaviour around online transactions',
    },
    countryEngland: {
      count: 15,
      title: 'Changing behaviour around online transactions',
    },
    combinedEvaluationEngland: {
      count: 15,
      title: 'Changing behaviour around online transactions',
    },
    /** Topic + country are OR'd across filter groups (7 saving ∪ 15 england − 5 overlap). */
    topicSavingEngland: {
      count: 17,
    },
  },
  search: {
    keyword: {
      count: 1,
      title: "Does robo-advice improve people's loan repayment decisions?",
    },
    /** Cross-field keyword match when query words span title and body. */
    crossFieldKeyword: 'Citizens Advice Southwark welfare reform',
    crossFieldMatch: {
      count: 1,
      title:
        'Citizens Advice Southwark final evaluation report - What Works Fund',
    },
    /** Extra token absent from title and body — all tokens must match. */
    crossFieldNoMatchKeyword:
      'Citizens Advice Southwark welfare reform Cardiff',
  },
} as const;
