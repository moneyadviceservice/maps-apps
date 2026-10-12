import { Page } from '@lib/test.lib';
import { BaseInputPage } from '@pages/input/base-input.page';
import { BaseQuestionPage } from '@pages/questions/base-question.page';

import {
  IFieldOption,
  IInputPageData,
  IQuestionOption,
  IQuestionPageData,
} from '../types/common.types';

export class PageFactory {
  static createQuestionPage<const TOptions extends readonly IQuestionOption[]>(
    data: IQuestionPageData & {
      options: TOptions;
    },
  ) {
    return class extends BaseQuestionPage<TOptions> {
      constructor(page: Page) {
        super(page, data);
      }
    };
  }

  static createInputPage<const TOptions extends readonly IFieldOption[]>(
    data: IInputPageData & { fields: TOptions },
  ) {
    return class extends BaseInputPage<TOptions> {
      constructor(page: Page) {
        super(page, data);
      }
    };
  }
}
