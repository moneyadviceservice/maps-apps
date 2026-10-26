import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';
import {
  RichTextAem,
  VariantType,
} from '@maps-react/vendor/components/RichTextAem';

export const ClaimingYourStatePension = () => {
  const { t, tList } = useTranslation();
  const items = tList(
    'pages.pension-details.claiming-your-state-pension.items',
  );

  const tickClasses = [`[&_ul>li:before]:bg-tick_grey`];

  return (
    <div className="mt-10 md:mt-16">
      <InformationCallout className="p-6 pb-2 md:pr-10">
        <Heading
          level="h4"
          component="h3"
          className="flex flex-row gap-[10px] mb-4"
        >
          <Icon type={IconType.CALENDAR} className="size-8 shrink-0" />
          {t('pages.pension-details.claiming-your-state-pension.heading')}
        </Heading>
        <RichTextAem
          listVariant={VariantType.POSITIVE}
          className={twMerge('mb-0', tickClasses)}
        >
          <ListElement
            variant="unordered"
            color="blue"
            className="!mb-0"
            items={items.map((item: string) => (
              <Markdown
                key={item.slice(0, 8)}
                className="mb-4"
                content={item}
              />
            ))}
          />
        </RichTextAem>
      </InformationCallout>
    </div>
  );
};
