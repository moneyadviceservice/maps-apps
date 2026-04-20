import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangement } from '../../lib/types';
import { PensionDetailCallout } from '../PensionDetailCallout';

type PensionDetailLinkedProps = {
  data: PensionArrangement;
};

export const PensionDetailLinked = ({ data }: PensionDetailLinkedProps) => {
  const { t, locale } = useTranslation();
  if (!data.linkedPensions || data.linkedPensions.length === 0) {
    return null;
  }

  data.linkedPensions.sort((a, b) => a.schemeName.localeCompare(b.schemeName));

  return (
    <PensionDetailCallout className="px-3" testId="pension-detail-linked">
      <div className="flex items-start gap-5">
        <Icon
          data-testid={'linked-pension-icon'}
          className="w-[34px] h-[34px] shrink-0"
          type={IconType.LINKED_PENSION_DETAIL}
        />
        {data.linkedPensions?.length === 1
          ? t('common.linked-pension')
          : t('common.linked-pensions')}
        {
          <Markdown
            className="font-normal [&_>span]:top-[3px]"
            disableParagraphs
            content={t(`tooltips.linked-pension`)}
          />
        }
      </div>
      <ul
        data-testid="linked-pensions-list"
        className="text-base font-normal ml-14"
      >
        {data.linkedPensions.map((pension, index) => (
          <li key={index} className="lg:mt-2">
            <form method="POST">
              <input
                type="hidden"
                name="pensionId"
                value={pension.externalAssetId}
              />
              <input type="hidden" name="locale" value={locale} />
              <input
                type="hidden"
                name="pensionType"
                value={pension.pensionType}
              />
              <Button
                variant="link"
                formAction="/api/set-pension-id"
                data-testid="details-link"
                className="inline-block gap-0"
              >
                {pension.schemeName}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </PensionDetailCallout>
  );
};
