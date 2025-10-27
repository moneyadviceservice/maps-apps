import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H4 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon/Icon';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { hasTaxFreeLumpSum } from '../../lib/utils';

export const TimelineIcon: { [key in string]: IconType } = {
  SP: IconType.STATE_PENSION,
  DB: IconType.DEFINED_BENEFIT,
  DC: IconType.DEFINED_CONTRIBUTION,
  LU: IconType.LUMP_SUM,
};

export const TimelineIconColor: { [key in string]: string } = {
  SP: 'text-blue-700',
  DB: 'text-purple-650',
  DC: 'text-teal-700',
  LU: 'text-green-850',
};

const Key = ({ timeLineItems }: { timeLineItems: string[] }) => {
  const { t } = useTranslation();

  return (
    <ul className="max-md:pt-4 max-md:mt-1 max-md:border-t-1 max-md:border-t-slate-400">
      {timeLineItems.map((item) => (
        <li
          className="mb-4 md:inline-block md:mr-7 last:mr-0 max-lg:last:mb-0 max-md:ml-3"
          key={item}
          data-testid={`key-item-${item.toLowerCase()}`}
        >
          <span className="flex items-center">
            <Icon
              type={TimelineIcon[item]}
              className={`inline-block mr-3 w-[18px] h-[18px] ${TimelineIconColor[item]}`}
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

  const pensionTypes = [PensionType.SP, PensionType.DB, PensionType.DC];

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
        className="pb-2 border-b-2 max-md:hidden border-b-slate-400"
      >
        <H4 className="mb-2">{t('pages.your-pensions-timeline.key.title')}</H4>
        <Key timeLineItems={timeLineItems} />
      </div>

      <div
        data-testid="timeline-key-mobile"
        className="pb-3 border-b border-b-slate-400 md:hidden"
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
