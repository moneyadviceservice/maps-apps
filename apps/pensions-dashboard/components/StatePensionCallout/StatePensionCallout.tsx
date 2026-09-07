import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type Props = {
  accruedAmount: number;
  forecastAmount: number;
};

type CalloutKeys = {
  heading: string;
  text: string;
} | null;

const getCalloutKeys = (
  accruedAmount: number,
  forecastAmount: number,
): CalloutKeys => {
  if (accruedAmount > 0 && accruedAmount < forecastAmount) {
    return { heading: 'keep-contributing', text: 'partial-accrued' };
  }

  if (accruedAmount > 0 && accruedAmount === forecastAmount) {
    return { heading: 'already-qualify', text: 'full-forecast' };
  }

  if (accruedAmount === 0 && forecastAmount > 0) {
    return { heading: 'keep-contributing', text: 'no-accrued' };
  }

  return null;
};

export const StatePensionCallout = ({
  accruedAmount,
  forecastAmount,
}: Props) => {
  const { t } = useTranslation();
  const calloutText = getCalloutKeys(accruedAmount, forecastAmount);

  if (!calloutText) {
    return null;
  }

  return (
    <Callout testId="state-pension-callout">
      <Heading
        level="h4"
        component="h2"
        data-testid="state-pension-callout-heading"
      >
        {t(
          `pages.pension-details.state-pension-callout.heading.${calloutText.heading}`,
        )}
      </Heading>
      <div className="flex flex-row gap-[15px] mt-6">
        <Icon
          type={IconType.INFO_SQUARE}
          className="text-blue-700 w-[25px] h-[30px] shrink-0 mt-2"
        />
        <Markdown
          testId="state-pension-callout-text"
          content={t(
            `pages.pension-details.state-pension-callout.text.${calloutText.text}`,
          )}
        />
      </div>
    </Callout>
  );
};
