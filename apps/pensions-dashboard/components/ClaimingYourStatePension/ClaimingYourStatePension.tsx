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

  return (
    <div className="mt-8">
      <InformationCallout className="p-6 pb-0">
        <Heading
          level="h4"
          className="flex flex-row items-center gap-[18px] mb-6"
        >
          <Icon
            type={IconType.CALENDAR}
            className="text-teal-600/75 size-8 shrink-0"
          />
          {t('pages.pension-details.claiming-your-state-pension.heading')}
        </Heading>
        <RichTextAem listVariant={VariantType.POSITIVE} className="m-1 mb-2">
          <ListElement
            variant="unordered"
            color="blue"
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
