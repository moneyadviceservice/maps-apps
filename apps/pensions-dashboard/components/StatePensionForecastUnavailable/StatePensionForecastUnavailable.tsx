import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { NotificationBox } from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangement } from '../../lib/types';
import { getStatePensionMessage } from '../../lib/utils/data';

type StatePensionForecastUnavailableProps = {
  data: PensionArrangement;
  locale?: string;
};

export const StatePensionForecastUnavailable = ({
  data: { statePensionMessageEng, statePensionMessageWelsh },
  locale,
}: StatePensionForecastUnavailableProps) => {
  const { t } = useTranslation();

  const message = getStatePensionMessage(
    { statePensionMessageEng, statePensionMessageWelsh },
    locale,
  );

  return (
    <div data-testid="state-pension-no-forecast">
      <Heading level="h2" className="mb-4 md:mb-6">
        {t('pages.pension-details.no-forecast.subheading')}
      </Heading>
      <Paragraph className="mb-6 md:mb-10">
        {t('pages.pension-details.no-forecast.intro')}
      </Paragraph>
      <NotificationBox testId="state-pension-no-forecast">
        <Heading
          level="h4"
          component="h3"
          data-testid="state-pension-no-forecast-title"
        >
          {t('pages.pension-details.no-forecast.notification-title')}
        </Heading>
        {message ? (
          <div className="flex flex-row gap-[15px] mt-6">
            <Icon
              type={IconType.INFO_SQUARE}
              className="text-blue-700 w-[25px] h-[30px] shrink-0 mt-2"
              data-testid="state-pension-no-forecast-icon"
            />
            <Markdown
              testId="state-pension-no-forecast-message"
              content={message}
            />
          </div>
        ) : null}
      </NotificationBox>
    </div>
  );
};
