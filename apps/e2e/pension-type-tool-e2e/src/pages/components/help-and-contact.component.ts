import {
  helpAndContactData,
  type PensionTypeLanguage,
} from '@data/helpAndContact.data';
import { BasePage } from '@pages/Base.page';

export class HelpAndContactComponent extends BasePage {
  liveChatLink(language: PensionTypeLanguage) {
    const { url, linkText } = helpAndContactData[language].liveChat;

    return this.page.locator(`a[href="${url}"]`).filter({ hasText: linkText });
  }

  liveChatLine(language: PensionTypeLanguage) {
    return this.liveChatLink(language).locator('..');
  }
}
