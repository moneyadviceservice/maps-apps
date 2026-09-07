import {
  IFieldOption,
  IInputPageData,
  IQuestionOption,
  IQuestionPageData,
  TResourcePageData,
} from 'src/types/common.types';
import { Page } from '@lib/test.lib';
import { BaseInputPage } from '@pages/input/base-input.page';
import { BaseQuestionPage } from '@pages/questions/base-question.page';
import { BaseResourcePage } from '@pages/resources/base-resources.page';

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

  static createResourcePage(data: TResourcePageData) {
    return class extends BaseResourcePage {
      constructor(page: Page) {
        super(page, data);
      }
    };
  }
}
