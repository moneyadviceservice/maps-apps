import { expect, test } from '@playwright/test';

import gp24aPage, { GP24A_CONTENT } from '../pages/gp24aPage';

const welshLinkScenarios = [
  {
    ac: 'AC2',
    link: GP24A_CONTENT.WELSH.links.takePension,
  },
  {
    ac: 'AC3',
    link: GP24A_CONTENT.WELSH.links.pensionWise,
  },
] as const;

test.describe('Retirement Guidance - GP 24A Welsh copy and links', () => {
  /**
   * @test 58035 AC 1 Test Case 1 : Verify Welsh GP 24A content and links
   * @test 58035 AC 2 Test Case 2 : Verify Welsh "Sut i gymryd eich pensiwn" link destination
   * @test 58035 AC 3 Test Case 3 : Verify Welsh "apwyntiadau Pension Wise am ddim" link destination
   */
  test('AC1: Welsh GP 24A displays the expected copy and links', async ({
    page,
  }) => {
    await gp24aPage.navigateToResults(page);
    const section = gp24aPage.getGuidanceSection(page);
    const content = GP24A_CONTENT.WELSH;

    await expect(section).toContainText(content.title);
    await expect(section).toContainText(content.paragraph1);
    await expect(section).toContainText(content.paragraph2);
    for (const listItem of content.listItems) {
      await expect(section).toContainText(listItem);
    }
    await expect(section).toContainText(content.paragraph3);
    await expect(
      gp24aPage.getLink(page, content.links.takePension.text),
    ).toBeVisible();
    await expect(
      gp24aPage.getLink(page, content.links.pensionWise.text),
    ).toBeVisible();
  });

  for (const scenario of welshLinkScenarios) {
    test(`${scenario.ac}: ${scenario.link.text} opens in a new tab`, async ({
      page,
    }) => {
      await gp24aPage.navigateToResults(page);
      const linkLocator = gp24aPage.getLink(page, scenario.link.text);

      await expect(linkLocator).toHaveAttribute('href', scenario.link.url);
      await expect(linkLocator).toHaveAttribute('target', '_blank');

      const popup = await gp24aPage.openLinkInNewTab(page, scenario.link.text);
      await expect(popup).toHaveURL(scenario.link.url);
      await popup.close();
    });
  }
});
