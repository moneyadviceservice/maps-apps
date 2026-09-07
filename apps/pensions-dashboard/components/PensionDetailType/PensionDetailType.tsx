import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionType } from '../../lib/constants';
import { tooltipScreenReaderText } from '../../lib/utils/ui';
import { PensionDetailCallout } from '../PensionDetailCallout';

type PensionDetailTypeProps = {
  pensionType: PensionType;
};

export const PensionDetailType = ({ pensionType }: PensionDetailTypeProps) => {
  const { t } = useTranslation();

  const PensionTypeIcon: Record<string, IconType> = {
    [PensionType.DB]: IconType.DB_DETAILS,
    [PensionType.DC]: IconType.DC_DETAILS,
    [PensionType.AVC]: IconType.AVC_DETAILS,
    [PensionType.HYB]: IconType.HYBRID_DETAILS,
    [PensionType.CDC]: IconType.CDC_DETAILS,
    [PensionType.CB]: IconType.CB_DETAILS,
    [PensionType.VAR]: IconType.VAR_DETAILS,
  };

  const pensionTypeText = t(`data/types.${pensionType}`);

  return (
    <PensionDetailCallout
      className="flex items-start gap-5 px-3"
      testId="pension-detail-type"
    >
      <Icon
        data-testid={pensionType + '-icon'}
        className="w-[34px] h-[34px] shrink-0"
        type={PensionTypeIcon[pensionType]}
      />
      {pensionTypeText.charAt(0).toUpperCase() + pensionTypeText.slice(1)}
      {
        <Markdown
          data-testid="markdown"
          disableParagraphs
          content={t(`tooltips.type-${pensionType}`)}
          tooltipProps={{
            accessibilityLabelOpen: tooltipScreenReaderText(
              t(`tooltips.sr-text.type-${pensionType}`),
              t,
            ),
          }}
        />
      }
    </PensionDetailCallout>
  );
};
