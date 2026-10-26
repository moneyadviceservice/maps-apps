import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { getStatePensionMessage } from '../../lib/utils/data';

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

  const message = getStatePensionMessage(
    { statePensionMessageEng, statePensionMessageWelsh },
    locale,
  );

  return message ? (
    <div className="mt-10 md:mt-16">
      <Heading level="h2" className="mt-10 mb-5 text-3xl font-bold md:text-5xl">
        {t('pages.pension-details.headings.state-pension')}
      </Heading>
      <Markdown content={message} />
    </div>
  ) : null;
};
