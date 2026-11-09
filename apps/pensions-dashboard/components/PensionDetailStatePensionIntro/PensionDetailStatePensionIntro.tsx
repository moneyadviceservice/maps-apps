import { Paragraph } from '@maps-digital/shared/ui';

import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  currencyAmount,
  formatDate,
  tooltipScreenReaderText,
} from '../../lib/utils/ui';

type PensionDetailStatePensionIntroProps = {
  data: PensionArrangement | null;
};

export const PensionDetailStatePensionIntro = ({
  data,
}: PensionDetailStatePensionIntroProps) => {
  const { t, locale } = useTranslation();

  if (!data?.detailData?.statePayment) {
    return null;
  }

  const { estimatedMonthlyAmount } = data.detailData.statePayment;

  const { detailData } = data;

  if (!detailData?.retirementDate) {
    return null;
  }

  const summaryContent = (() => {
    return (
      <>
        <Paragraph>
          <Markdown
            content={t(`pages.pension-details.toolIntro.estimate-SP`, {
              monthly: currencyAmount(estimatedMonthlyAmount) ?? `£${NO_DATA}`,
              date: formatDate(detailData.retirementDate, locale),
              tooltip: t('tooltips.state-pension-age'),
            })}
            disableParagraphs={true}
            tooltipProps={{
              accessibilityLabelOpen: tooltipScreenReaderText(
                t('tooltips.sr-text.state-pension-age'),
                t,
              ),
            }}
          />{' '}
          <Markdown
            content={t(`pages.pension-details.toolIntro.estimate-SP2`, {
              tooltip: t('tooltips.national-insurance'),
            })}
            disableParagraphs={true}
            tooltipProps={{
              accessibilityLabelOpen: tooltipScreenReaderText(
                t('tooltips.sr-text.national-insurance'),
                t,
              ),
            }}
          />
        </Paragraph>
        <Markdown content={t(`pages.pension-details.toolIntro.estimate-SP3`)} />
      </>
    );
  })();

  return (
    <ToolIntro className="text-lg leading-[1.5] md:text-2xl md:leading-10 mb-6 md:mb-12 mt-2 [&_p]:mb-6 md:[&_p]:mb-10">
      {summaryContent}
    </ToolIntro>
  );
};
