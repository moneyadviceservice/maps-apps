import {
  IneligiblePageData,
  QuestionPageData,
  TransitionalPageData,
} from 'src/types/common.types';
import { Page } from '@lib/test.lib';
import { IneligibilityPage } from '@pages/ineligible/ineligible.page';
import { QuestionPage } from '@pages/question/question.page';
import { TransitionalPage } from '@pages/transitional/transitional.page';

export class PageFactory {
  static createQuestionPage<const T extends QuestionPageData>(data: T) {
    type OptionsUnion = T['options'][number];

    return class extends QuestionPage<OptionsUnion> {
      constructor(page: Page) {
        super(page, data);
      }
    };
  }

  static createIneligiblePage(data: IneligiblePageData) {
    return class extends IneligibilityPage {
      constructor(page: Page) {
        super(page, data);
      }
    };
  }

  static createTransitionalPage(data: TransitionalPageData) {
    return class extends TransitionalPage {
      constructor(page: Page) {
        super(page, data);
      }
    };
  }
}
