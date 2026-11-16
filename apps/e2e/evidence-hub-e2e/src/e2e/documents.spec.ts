import { test } from '@lib/test.lib';
import { DocumentPage } from '@pages/DocumentsPage';

test.describe('Document pages', () => {
  test('render the first page on the list', async ({ page }) => {
    const documentPage = new DocumentPage(page);
    documentPage.navigateToFirstDocument(page);
    await documentPage.assertPageIsLoaded();
  });

  test('that feedback box is visible', async ({ page }) => {
    const documentPage = new DocumentPage(page);

    documentPage.navigateToFirstDocument(page);
    await documentPage.assertFeedbackFormText(
      'Give us your feedback or ask a question',
      'what.works@maps.org.uk',
    );
  });
});
