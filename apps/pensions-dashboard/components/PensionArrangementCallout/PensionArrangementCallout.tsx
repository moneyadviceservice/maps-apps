import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { ContactDetails } from '../ContactDetails';
import { DefinitionList } from '../DefinitionList';

export const PensionArrangementCallout = (item: PensionArrangement) => {
  const { t, locale } = useTranslation();

  const listData = [...ContactDetails(item.pensionAdministrator)];

  const detailsLinkPensions = [
    PensionType.AVC,
    PensionType.DB,
    PensionType.DC,
    PensionType.HYB,
  ];

  return (
    <InformationCallout
      key={item.externalAssetId}
      className="px-4 py-6 pb-2 mt-6 md:py-7 md:px-5 md:mt-9"
    >
      <Heading
        level="h4"
        component="h3"
        color="text-blue-700"
        className="flex gap-4 mb-4 md:mb-5"
      >
        <Icon
          type={IconType.WARNING_SQUARE}
          className="w-[30px] h-[30px] fill-red-700"
        />
        {item.schemeName}
      </Heading>

      <Paragraph className="md:mb-5">
        {t('pages.pensions-that-need-action.card.description', {
          pensionAdministrator: item.pensionAdministrator.name,
        })}
      </Paragraph>

      <div className="mb-3 md:mb-5">
        <Paragraph className="mb-0 font-bold">
          {t('pages.pensions-that-need-action.card.reference')}
        </Paragraph>

        <Paragraph className="mb-0" testId="pension-contact-reference">
          {item.contactReference ?? t('common.unavailable')}
        </Paragraph>

        {detailsLinkPensions.includes(item.pensionType) && (
          <form method="POST">
            <input
              type="hidden"
              name="pensionId"
              value={item.externalAssetId}
            />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="pensionType" value={item.pensionType} />
            <Button
              className="inline"
              formAction="/api/set-pension-id"
              data-testid="details-link"
              variant="link"
            >
              {t('pages.pensions-that-need-action.card.details-link')}
            </Button>
          </form>
        )}
      </div>

      <div className="py-2 mb:py-4 border-slate-400 border-t-1">
        <ExpandableSection
          title={t('pages.pensions-that-need-action.card.contact-heading-open')}
        >
          <DefinitionList
            className="!w-full !p-0 mb-0 bg-white rounded-none [&>dl>dt:last-of-type]:border-b-0 [&>dl>dd:last-of-type]:border-b-0"
            dlClassName="md:grid-cols-[36%_64%]"
            items={listData}
          />
        </ExpandableSection>
      </div>
    </InformationCallout>
  );
};
