import { PageFactory } from '@lib/page-factory.lib';

export const Under50Page = PageFactory.createIneligiblePage({
  title: 'You’re not eligible for an online appointment',
  endpoint: '/pension-wise-triage/age/under-50',
});
