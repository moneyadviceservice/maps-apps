import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H4 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon/Icon';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { hasTaxFreeLumpSum } from '../../lib/utils/data';

export const TimelineIcon: { [key in string]: IconType } = {
  SP: IconType.STATE_PENSION,
  DB: IconType.DEFINED_BENEFIT,
  DC: IconType.DEFINED_CONTRIBUTION,
  AVC: IconType.AVC,
  HYB: IconType.HYBRID,
  LU: IconType.LUMP_SUM,
};

export const TimelineIconColor: { [key in string]: string } = {
  SP: 'text-blue-700',
  DB: 'text-purple-650',
  DC: 'text-teal-700',
  AVC: 'text-magenta-750',
  HYB: 'text-olive-500',
  LU: 'text-green-850',
};

const Key = ({ timeLineItems }: { timeLineItems: string[] }) => {
  const { t } = useTranslation();

  return (
    <ul className="max-lg:pt-4 max-lg:mt-1 max-lg:border-t-1 max-lg:border-t-slate-400">
      {timeLineItems.map((item) => (
        <li
          className="mb-4 lg:inline-block lg:mr-7 lg:last:mr-4 max-lg:last:mb-0 max-lg:ml-3"
          key={item}
          data-testid={`key-item-${item.toLowerCase()}`}
        >
          <span className="flex items-center">
            <Icon
              type={TimelineIcon[item]}
              className={`inline-block mr-2 w-[24px] h-[24px] ${TimelineIconColor[item]}`}
            />
            {t(`pages.your-pensions-timeline.key.items.${item}`)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const TimelineKey = ({ data }: { data: PensionArrangement[] }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return null;
  }

  const pensionTypes = [
    PensionType.SP,
    PensionType.DB,
    PensionType.DC,
    PensionType.AVC,
    PensionType.HYB,
  ];

  let timeLineItems: string[] = Array.from(
    new Set(
      data
        .map((pension) => pension.pensionType)
        .sort((a, b) => pensionTypes.indexOf(a) - pensionTypes.indexOf(b)),
    ),
  );

  if (hasTaxFreeLumpSum(data)) {
    timeLineItems = [...timeLineItems, 'LU'];
  }

  return (
    <div className="mb-8">
      <div
        data-testid="timeline-key"
        className="pb-2 border-b-2 max-lg:hidden lg:inline-block lg:min-w-[84%] xl:min-w-[67%] 2xl:min-w-[58%] border-b-slate-400"
      >
        <H4 component="h3" className="mb-2">
          {t('pages.your-pensions-timeline.key.title')}
        </H4>
        <Key timeLineItems={timeLineItems} />
      </div>

      <div
        data-testid="timeline-key-mobile"
        className="pb-3 border-b border-b-slate-400 lg:hidden"
      >
        <ExpandableSection
          title={t('pages.your-pensions-timeline.key.accordion-open')}
          closedTitle={t('pages.your-pensions-timeline.key.accordion-close')}
          contentTestClassName="mb-1"
        >
          <Key timeLineItems={timeLineItems} />
        </ExpandableSection>
      </div>
    </div>
  );
};
