import { isDeepStrictEqual } from 'node:util';
import { BaseInputPage } from '@pages/input/base-input.page';
import { BaseQuestionPage } from '@pages/questions/base-question.page';
import { BaseResourcePage } from '@pages/resources/base-resources.page';
import { createMatcherResult, pollMatcherResult } from '@utils/matchers.util';

import {
  expect as baseExpect,
  type ExpectMatcherState,
  Locator,
} from '@maps-react/playwright/fixtures/default.fixtures';

const getLocatorText = async (locator: Locator) =>
  (await locator.allTextContents()).join('').trim();

/**
 * Given a BaseResourcePage, this matcher will check that the content of the page matches the expected content defined in the page's data.
 * It retrieves the expected content from the page's data and compares it with the actual content obtained from the page's content locator.
 * If the expected and received content match, the matcher will pass; otherwise, it will fail and provide a detailed message indicating the expected and received values.
 *
 * @example
 * await expect(resourcePage).toHaveExpectedContent();
 */
async function toHaveExpectedContent(
  this: ExpectMatcherState,
  page: BaseQuestionPage | BaseResourcePage | BaseInputPage,
) {
  if (!page.data.content) {
    throw new Error(
      `Page object does not have any content in its data, are you sure this is the right page? if so, add a content property to it.`,
    );
  }

  const expected = page.data.content;

  const { received, pass } = await pollMatcherResult(async () => {
    const paragraphCount = await page.content.count();
    const receivedText = await getLocatorText(page.content);

    return {
      pass: paragraphCount > 1 && expected === receivedText,
      expected,
      received: receivedText,
    };
  });

  return createMatcherResult({
    matcherName: 'page to have expected content',
    pass,
    expected,
    received,
    utils: this.utils,
  });
}

/**
 * Given a BaseQuestionPage or BaseResourcePage, this matcher will check that the page's title and section title match the expected values defined in the page's data.
 * It retrieves the expected titles from the page's data and compares them with the actual titles obtained from the page's title and sub-header locators.
 * If both the expected and received titles match, the matcher will pass; otherwise, it will fail and provide a detailed message indicating the expected and received values.
 *
 * @example
 * await expect(questionPage).toHaveExpectedPageTitles();
 */
async function toHaveExpectedPageTitles(
  this: ExpectMatcherState,
  page: BaseQuestionPage | BaseResourcePage | BaseInputPage,
) {
  const expected = {
    title: page.data.pageTitle,
    section: page.data.sectionTitle,
  };

  const { received, pass } = await pollMatcherResult(async () => {
    await page.title.waitFor();
    await page.subHeader.waitFor();

    const receivedTitles = {
      title: await getLocatorText(page.title),
      section: await getLocatorText(page.subHeader),
    };

    return {
      pass:
        expected.title === receivedTitles.title &&
        expected.section === receivedTitles.section,
      expected,
      received: receivedTitles,
    };
  });

  return createMatcherResult({
    matcherName: 'page to have expected titles',
    pass,
    expected,
    received,
    utils: this.utils,
  });
}

/**
 * Given a BaseQuestionPage, this matcher will check that the options displayed on the page match the expected options defined in the page's data.
 * It retrieves the expected options from the page's data and compares them with the actual options obtained from the page's option labels locator.
 * If the expected and received options match, the matcher will pass; otherwise, it will fail and provide a detailed message indicating the expected and received values.
 *
 * @example
 * await expect(questionPage).toHaveExpectedOptions();
 */
async function toHaveExpectedOptions(
  this: ExpectMatcherState,
  page: BaseQuestionPage,
) {
  const expected = page.data.options;

  const { received, pass } = await pollMatcherResult(async () => {
    const receivedOptions = await page.getOptionContents();
    return {
      pass: isDeepStrictEqual(receivedOptions, expected),
      expected,
      received: receivedOptions,
    };
  });

  return createMatcherResult({
    matcherName: 'page to have expected options',
    pass,
    expected,
    received,
    utils: this.utils,
  });
}

async function toHaveExpectedFields(
  this: ExpectMatcherState,
  page: BaseInputPage,
) {
  const expected = page.data.fields;

  const { received, pass } = await pollMatcherResult(async () => {
    const receivedOptions = await page.getFields();
    return {
      pass: isDeepStrictEqual(receivedOptions, expected),
      expected,
      received: receivedOptions,
    };
  });

  return createMatcherResult({
    matcherName: 'page to have expected fields',
    pass,
    expected,
    received,
    utils: this.utils,
  });
}

/**
 * Given a BaseQuestionPage, this matcher will check that the expandable section displayed on the page matches the expected expandable section defined in the page's data.
 * It retrieves the expected expandable section from the page's data and compares it with the actual expandable section obtained from the page's title and text locators.
 * If the expected and received expandable sections match, the matcher will pass; otherwise, it will fail and provide a detailed message indicating the expected and received values.
 *
 * @example
 * await expect(questionPage).toHaveExpectedExpandableSection();
 */
async function toHaveExpectedExpandableSection(
  this: ExpectMatcherState,
  page: BaseQuestionPage,
) {
  if (!page.data.expandableSection) {
    throw new Error(
      `No expandable section defined on ${page.constructor.name}`,
    );
  }

  const expected = {
    title: page.data.expandableSection.title,
    text: page.data.expandableSection.text,
  };

  const { received, pass } = await pollMatcherResult(async () => {
    await page.expandableSectionTitle.waitFor();
    await page.expandableSectionText.waitFor();

    const receivedSection = {
      title: await getLocatorText(page.expandableSectionTitle),
      text: await getLocatorText(page.expandableSectionText),
    };

    return {
      pass:
        expected.title === receivedSection.title &&
        expected.text === receivedSection.text,
      expected,
      received: receivedSection,
    };
  });

  return createMatcherResult({
    matcherName: 'page to have expected expandable section',
    pass,
    expected,
    received,
    utils: this.utils,
  });
}

export const expect = baseExpect.extend({
  toHaveExpectedPageTitles,
  toHaveExpectedOptions,
  toHaveExpectedExpandableSection,
  toHaveExpectedContent,
  toHaveExpectedFields,
});
