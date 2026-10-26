import { PageFactory } from '@lib/page-factory.lib';

export const NoDCPage = PageFactory.createIneligiblePage({
  title: 'If you do not have a UK-based defined contribution pension',
  endpoint: '/pension-wise-triage/pension-type/no-dc-pension',
});
