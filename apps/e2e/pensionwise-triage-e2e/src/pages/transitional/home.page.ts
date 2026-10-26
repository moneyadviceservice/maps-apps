import { PageFactory } from '@lib/page-factory.lib';

export const HomePage = PageFactory.createTransitionalPage({
  title: 'Do you have a UK-based defined contribution pension?',
  endpoint: '/pension-wise-triage/',
});
