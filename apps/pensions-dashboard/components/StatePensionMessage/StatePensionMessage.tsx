import { Paragraph } from '@maps-react/common/components/Paragraph';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type StatePensionMessageProps = {
  data: PensionArrangement;
  locale?: string;
};

export const StatePensionMessage = ({
  locale,
  data: { pensionType, statePensionMessageEng, statePensionMessageWelsh },
}: StatePensionMessageProps) => {
  if (pensionType !== PensionType.SP) {
    return null;
  }

  const message =
    locale === 'cy' ? statePensionMessageWelsh : statePensionMessageEng;

  return <Paragraph>{message}</Paragraph>;
};
