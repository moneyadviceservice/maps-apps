import { Page } from './test.lib';

export function subHeading(page: Page, text: string, level = 2) {
  return page.getByRole('heading', { level, name: text });
}
