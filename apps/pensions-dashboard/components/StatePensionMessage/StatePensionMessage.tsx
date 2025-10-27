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
    <div className="mt-10 md:mt-16">
      <Heading level="h2" className="mt-10 mb-5 text-3xl font-bold md:text-5xl">
        {t('pages.pension-details.headings.state-pension')}
      </Heading>
      <Paragraph>{message}</Paragraph>
    </div>
  ) : null;
};
