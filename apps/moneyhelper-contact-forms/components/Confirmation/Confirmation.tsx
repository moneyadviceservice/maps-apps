import { Button } from '@maps-digital/shared/ui';

import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { safeT } from '../../lib/utils';

export const Confirmation: StepComponent = ({
  entry,
  referenceNumber,
  flow,
}) => {
  const { t, tList } = useTranslation();

  // Define the content keys for generic and specific confirmation messages
  const genericKey = 'components.confirmation';
  const specificKey = `components.confirmation.${flow}`;

  // Fallback to generic content if specific content is not available
  const content =
    safeT(t, `${specificKey}.content`) ?? t(`${genericKey}.content`);

  // Dynamically determine and merge the items
  const specificItems = safeT(t, `${specificKey}.items`)
    ? tList(`${specificKey}.items`)
    : [];
  const genericItems = tList(`${genericKey}.items`);
  const items = [...genericItems, ...specificItems];

  return (
    <>
      <div className="flex flex-col gap-8">
        <InformationCallout className="flex flex-col gap-4 bg-blue-700 p-9">
          <Heading
            component="h1"
            className="mb-4 text-white"
            data-testid="confirmation-title"
          >
            {t('components.confirmation.callout.title')}
          </Heading>
          {referenceNumber && (
            <div data-testid="confirmation-callout-content">
              <Markdown
                className="mb-2 text-white obfuscate text-[42px]/[56px]"
                content={t('components.confirmation.callout.content', {
                  referenceNumber,
                })}
              />
            </div>
          )}
        </InformationCallout>
        <Markdown
          className="mb-2"
          data-testid="confirmation-content"
          content={content}
        />
        <div>
          <Heading
            component="h2"
            level="h1"
            className="mb-4 text-blue-700"
            data-testid="confirmation-title"
          >
            {t('components.confirmation.title')}
          </Heading>
          <ListElement
            items={items.map((item: string) => (
              <Markdown
                key={item.slice(0, 8)}
                content={item.replace('{email}', entry?.data?.email ?? '')}
              />
            ))}
            variant="unordered"
            color="dark"
            className="mt-4 ml-8 obfuscate"
            data-testid="confirmation-items"
          />
        </div>
        <Markdown
          className="mb-4"
          content={t('components.confirmation.privacy-notice')}
          data-testid="confirmation-privacy-notice-content"
        />
      </div>
      <Button
        type="button"
        as="a"
        href={`${t('components.confirmation.button.url')}`}
        variant="primary"
        data-testid="back-to-home-button"
        className="w-full mt-10 mb-4 md:w-auto"
      >
        {t('components.confirmation.button.text')}
      </Button>
    </>
  );
};
