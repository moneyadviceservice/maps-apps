import { PageFactory } from '@lib/page-factory.lib';

export const StartPage = PageFactory.createInputPage({
  endpoint: '/question-1',
  fields: [
    {
      label: 'Please enter an amount up to £50,000',
      id: 'answer',
    },
  ],
});

export type StartPageInstance = InstanceType<typeof StartPage>;
