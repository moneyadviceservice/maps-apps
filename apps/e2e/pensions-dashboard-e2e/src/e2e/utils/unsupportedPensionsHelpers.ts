import { expect, Page } from '@maps/playwright';
import { getPensionCategory } from './request';
import pensionsFoundPage from '../pages/PensionsFoundPage';

export async function verifyUnsupportedPensions(page: Page, request: any) {
  const response = await getPensionCategory(page, request, 'UNSUPPORTED');
  const responseJson = await response.json();
  const { arrangements } = responseJson;
  const pensionPolicies = [{ pensionArrangements: arrangements }];
  const pensionArrangements = pensionPolicies.flatMap(
    (policy) => policy.pensionArrangements,
  );

  const unsupportedPensionsCallout =
    await pensionsFoundPage.unsupportedPensionsCallOut(page);

  await expect(unsupportedPensionsCallout).toContainText(
    'Unsupported pensions found',
  );
  await expect(unsupportedPensionsCallout).toContainText(
    'We found 1 or more pensions that could belong to you that we can’t display yet. We’re still building and improving our service, so check back again soon.',
  );

  const unsupportedTypes = ['CB', 'CDC'];
  unsupportedTypes.forEach((type) => {
    const pension = pensionArrangements.find((arr) => arr.pensionType === type);
    expect(pension).toBeDefined();
    expect(pension?.schemeName).toBe(`SchemeName${type}`);
    expect(pension?.pensionAdministrator.name).toBe(
      `${type} Administrator Name`,
    );
  });
}
