import { PageFactory } from '@lib/page-factory.lib';

export const LifetimeAnnuityConfirmationPage =
  PageFactory.createTransitionalPage({
    title: 'If you have a lifetime annuity in payment',
    endpoint:
      '/pension-wise-triage/lifetime-annuity/lifetime-annuity-in-payment',
  });
