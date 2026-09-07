import { expect, type Page, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS, Question5Answer } from '../pages/question5Page';
import { QUESTION_8_ANSWERS } from '../pages/question8Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';

const DIVORCE_GUIDANCE_TEST_ID = 'divorce-17-section';
const SINGLE_PENSION_TYPE = [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION];
const MULTIPLE_PENSION_TYPES = [
  QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
  QUESTION_5_ANSWERS.DEFINED_BENEFIT,
];

const DIVORCE17_EXPECTED_COPY = {
  title: 'Decide how to split your pensions in a divorce or dissolution',
  paragraph1:
    'Always include pensions in a divorce or dissolution settlement, even if you’ve agreed to keep them separate.',
  paragraph2:
    'This is because they might be your biggest assets and can be worth more than your home, so you might not be getting a fair deal.',
  paragraph3: 'You can usually choose to use one or more of these options:',
  listItems: [
    'transfer a portion of one person’s pension to another, called pension sharing',
    'ask the pension provider to pay a share of the future pension income to each of you, called pension attachment or earmarking',
    'keep the full pension and let the other partner take other assets of similar value, called pension offsetting.',
  ],
  paragraph4:
    'You’ll normally need to decide how your pensions are split between you – they do not always need to be shared equally. You could consider using a mediator to help you decide.',
  paragraph5Part1:
    'For more information, see How to split pensions in a divorce or dissolution.',
  paragraph5Part2:
    'You can also book a free Pensions and divorce or dissolution appointment to get impartial guidance on your options from one of our pension specialists.',
  links: {
    splitPensions:
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/split-pensions-in-a-divorce-or-dissolution',
    appointment:
      'https://www.moneyhelper.org.uk/en/family-and-care/divorce-and-separation/divorce-dissolution-pensions-appointment',
  },
} as const;

const normalizeCopy = (value: string) =>
  value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

type DivorceScenario = {
  ac: string;
  description: string;
  isDivorcing: boolean;
  q5Answer: Question5Answer[];
};

const scenarios: DivorceScenario[] = [
  {
    ac: 'AC1',
    description:
      'Going through divorce with single pension type displays guidance package 17',
    isDivorcing: true,
    q5Answer: SINGLE_PENSION_TYPE,
  },
  {
    ac: 'AC2',
    description:
      'Going through divorce with multiple pension types displays guidance package 17',
    isDivorcing: true,
    q5Answer: MULTIPLE_PENSION_TYPES,
  },
  {
    ac: 'AC3',
    description: 'Not going through divorce displays no guidance',
    isDivorcing: false,
    q5Answer: SINGLE_PENSION_TYPE,
  },
  {
    ac: 'AC4',
    description:
      'Not going through divorce with multiple pension types displays no guidance',
    isDivorcing: false,
    q5Answer: MULTIPLE_PENSION_TYPES,
  },
];

/**
 * @tests User Story 50891
 * @test AC1  Variable Guidance Divorce – going through divorce displays guidance package 17
 * @test AC2  Variable Guidance Divorce – going through divorce with multiple pension types displays guidance package 17
 * @test AC3  Variable Guidance Divorce – not going through divorce displays no guidance
 * @test AC4  Variable Guidance Divorce – not going through divorce with multiple pension types displays no guidance
 */
const navigateScenario = async (
  page: Page,
  isDivorcing: boolean,
  q5Answer: Question5Answer[],
) => {
  await questionnaireNavigator.skipToResults(page, {
    q2Answer: QUESTION_2_ANSWERS.YES,
    q8Answer: isDivorcing ? QUESTION_8_ANSWERS.YES : QUESTION_8_ANSWERS.NO,
    q5Answer,
  });
  return resultsPage.getGuidanceSection(page, DIVORCE_GUIDANCE_TEST_ID);
};

const assertDivorce17Content = async (page: Page) => {
  const guidanceSection = resultsPage.getGuidanceSection(
    page,
    DIVORCE_GUIDANCE_TEST_ID,
  );

  await guidanceSection.click();
  const guidanceContent = page.locator('#divorce-17-content');
  await expect(guidanceContent).toBeVisible();

  const guidanceText = normalizeCopy(await guidanceContent.innerText());

  expect(guidanceText).toContain(normalizeCopy(DIVORCE17_EXPECTED_COPY.title));
  expect(guidanceText).toContain(
    normalizeCopy(DIVORCE17_EXPECTED_COPY.paragraph1),
  );
  expect(guidanceText).toContain(
    normalizeCopy(DIVORCE17_EXPECTED_COPY.paragraph2),
  );
  expect(guidanceText).toContain(
    normalizeCopy(DIVORCE17_EXPECTED_COPY.paragraph3),
  );

  for (const listItem of DIVORCE17_EXPECTED_COPY.listItems) {
    expect(guidanceText).toContain(normalizeCopy(listItem));
  }

  expect(guidanceText).toContain(
    normalizeCopy(DIVORCE17_EXPECTED_COPY.paragraph4),
  );
  expect(guidanceText).toContain(
    normalizeCopy(DIVORCE17_EXPECTED_COPY.paragraph5Part1),
  );
  expect(guidanceText).toContain(
    normalizeCopy(DIVORCE17_EXPECTED_COPY.paragraph5Part2),
  );

  await expect(
    resultsPage.getSectionLinkByHref(
      page,
      DIVORCE_GUIDANCE_TEST_ID,
      DIVORCE17_EXPECTED_COPY.links.splitPensions,
    ),
  ).toBeVisible();

  await expect(
    resultsPage.getSectionLinkByHref(
      page,
      DIVORCE_GUIDANCE_TEST_ID,
      DIVORCE17_EXPECTED_COPY.links.appointment,
    ),
  ).toBeVisible();
};

test.describe('Retirement Guidance - Results - Variable Guidance (Divorce)', () => {
  test.describe.serial('Variable Guidance - Divorce', () => {
    for (const scenario of scenarios) {
      test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
        const guidanceSection = await navigateScenario(
          page,
          scenario.isDivorcing,
          scenario.q5Answer,
        );

        // eslint-disable-next-line playwright/no-conditional-in-test
        if (scenario.isDivorcing) {
          // eslint-disable-next-line playwright/no-conditional-expect
          await expect(guidanceSection).toBeVisible();
          await assertDivorce17Content(page);
        } else {
          // eslint-disable-next-line playwright/no-conditional-expect
          await expect(guidanceSection).not.toBeAttached();
        }
      });
    }
  });
});
