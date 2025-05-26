import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

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
  const { t } = useTranslation();
  if (pensionType !== PensionType.SP) {
    return null;
  }

  const message =
    locale === 'cy' ? statePensionMessageWelsh : statePensionMessageEng;

  return message ? (
    <>
      <Heading level="h2" className="mb-4 text-2xl font-bold">
        {t('pages.pension-details.headings.state-pension')}
      </Heading>
      <Paragraph>{message}</Paragraph>
    </>
  ) : null;
};
