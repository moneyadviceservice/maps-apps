import {
  type TDataLayerGenericItem,
  type TDataLayerWindow,
} from 'src/types/common.types';
import { type Page } from '@lib/test.lib';

/**
 * Retrieves the Adobe Data Layer from the given Playwright page.
 */
export async function getDataLayer(
  page: Page,
): Promise<TDataLayerGenericItem[]> {
  return page.evaluate(
    () => (window as unknown as TDataLayerWindow).adobeDataLayer || [],
  );
}
