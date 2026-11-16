import { PensionArrangement } from '../../types';

type StatePensionMessages = Pick<
  PensionArrangement,
  'statePensionMessageEng' | 'statePensionMessageWelsh'
>;

export const getStatePensionMessage = (
  { statePensionMessageEng, statePensionMessageWelsh }: StatePensionMessages,
  locale?: string,
) => {
  const message =
    locale === 'cy' ? statePensionMessageWelsh : statePensionMessageEng;

  return message?.replaceAll(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
};
