import { expect, test } from '@lib/test.lib';
import { EssentialItemsComponent } from '@pages/components/EssentialItems.component';
import { NonEssentialItemsComponent } from '@pages/components/NonEssentialItems.component';
import { ResultsComponent } from '@pages/components/Results.component';
import { YourBudgetComponent } from '@pages/components/YourBudget.component';

const headerErrorTitle = 'There is a problem';
const headerErrorMessage =
  'Enter an email address in the correct format, like name@example.com';
const inputErrorMessage =
  'Error: Enter an email address in the correct format, like name@example.com';

async function progressToSaveForLater(
  essentialItems: EssentialItemsComponent,
  nonEssentialItems: NonEssentialItemsComponent,
  yourBudget: YourBudgetComponent,
  results: ResultsComponent,
) {
  await essentialItems
    .essentialsInput('sterilisingEquipment')
    .then((input) => input.fill('200'));
  await essentialItems.continueButton.click();
  await nonEssentialItems.continueButton.click();
  await yourBudget.continueButton.click();
  await results.saveButton.click();
}

test.describe('Baby cost calculator', () => {
  /**
   * @tests 54784 - let user verify error message for invalid email
   */
  test(`should let user verify error message for invalid email`, async ({
    babyDueDate,
    essentialItems,
    nonEssentialItems,
    yourBudget,
    results,
    saveForLater,
  }) => {
    await babyDueDate.goto('/en');
    await babyDueDate.selectBabyDueDate('9');
    await babyDueDate.continueButton.click();

    await progressToSaveForLater(
      essentialItems,
      nonEssentialItems,
      yourBudget,
      results,
    );

    await saveForLater.saveEmailInput.fill('notanemail');
    await saveForLater.saveEmailButton.click();
    await expect(saveForLater.headerErrorArea).toBeVisible();
    await expect(saveForLater.headerErrorTitle).toContainText(headerErrorTitle);
    await expect(saveForLater.headerErrorMessage).toContainText(
      headerErrorMessage,
    );
    await expect(saveForLater.inputAreaError).toContainClass('border-red-600');
    await expect(saveForLater.inputErrorText).toContainText(inputErrorMessage);
  });
});
