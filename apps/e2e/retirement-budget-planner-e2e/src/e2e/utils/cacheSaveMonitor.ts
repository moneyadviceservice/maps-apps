import { type Page, type Request } from '@playwright/test';

const isCacheSave = (request: Request) =>
  request.method() === 'POST' &&
  new URL(request.url()).pathname === '/api/cache-to-memory';

const isFieldSave = (request: Request, fieldName: string, value: string) =>
  isCacheSave(request) &&
  request.postDataJSON()?.[fieldName] === value &&
  !request.postDataJSON()?.dynamic;

const waitForSave = (page: Page, predicate: (request: Request) => boolean) =>
  page.waitForResponse((response) => predicate(response.request()));

export const waitForFieldSave = (
  page: Page,
  fieldName: string,
  value: string,
) => waitForSave(page, (request) => isFieldSave(request, fieldName, value));

export const holdIncomeFieldSave = async (
  page: Page,
  fieldName: string,
  value: string,
) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let markStarted!: () => void;
  const started = new Promise<void>((resolve) => {
    markStarted = resolve;
  });
  const order: string[] = [];
  const isIncomeSave = (request: Request) =>
    isCacheSave(request) && request.postDataJSON()?.tabName === 'income';
  const isIncomeFieldSave = (request: Request) =>
    isIncomeSave(request) && isFieldSave(request, fieldName, value);

  page.on('request', (request) => {
    if (isIncomeSave(request) && request.postDataJSON().dynamic === true) {
      order.push('form request');
    }
  });
  page.on('response', (response) => {
    if (isIncomeFieldSave(response.request())) {
      order.push('blur response');
    }
  });

  await page.route('**/api/cache-to-memory?*', async (route) => {
    if (isIncomeFieldSave(route.request())) {
      markStarted();
      await gate;
    }
    await route.continue();
  });

  // Start listening before navigation; awaiting either response here would block the test.
  const fieldSaved = waitForSave(page, isIncomeFieldSave);
  const formSaved = waitForSave(
    page,
    (request) =>
      isIncomeSave(request) && request.postDataJSON().dynamic === true,
  );

  return { started, release, fieldSaved, formSaved, order };
};
