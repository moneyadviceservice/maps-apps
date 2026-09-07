import { PageFactory } from '@lib/page-factory.lib';

export const Over75Page = PageFactory.createIneligiblePage({
  title: "If you're 75 and older",
  endpoint: '/pension-wise-triage/age/75-and-over',
});
