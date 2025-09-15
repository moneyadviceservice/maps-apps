import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type PensionDetailTypeProps = {
  data: PensionArrangement;
};

export const PensionDetailType = ({ data }: PensionDetailTypeProps) => {
  const { t } = useTranslation();

  const PensionTypeIcon: Record<string, IconType> = {
    [PensionType.DB]: IconType.DB_DETAILS,
    [PensionType.DC]: IconType.DC_DETAILS,
  };

  const pensionTypeText = t(`data.pensions.types.${data.pensionType}`);

  return (
    <div
      data-testid="pension-detail-type"
      className="flex items-start gap-5 px-3 py-3 mb-6 text-lg font-bold border-2 border-slate-400 rounded-bl-2xl md:text-xl"
    >
      <Icon
        data-testid={data.pensionType + '-icon'}
        className="w-[34px] h-[34px] shrink-0"
        type={PensionTypeIcon[data.pensionType]}
      />
      {pensionTypeText.charAt(0).toUpperCase() + pensionTypeText.slice(1)}
      {
        <Markdown
          data-testid="markdown"
          className="font-normal [&_>span]:top-[3px]"
          disableParagraphs
          content={t(`tooltips.type-${data.pensionType}`)}
        />
      }
    </div>
  );
};
