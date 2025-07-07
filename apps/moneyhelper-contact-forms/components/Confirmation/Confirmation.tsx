import { Button } from '@maps-digital/shared/ui';

import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const Confirmation: StepComponent = ({ entry, referenceNumber }) => {
  const { t, tList } = useTranslation();
  const whatHappensNext = tList(
    'components.confirmation.what-happens-next.items',
  );

  return (
    <>
      <InformationCallout className="flex flex-col gap-4 bg-blue-800 p-9">
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

      <Paragraph className="my-8" data-testid="confirmation-content">
        {t('components.confirmation.content')}
      </Paragraph>
      <div>
        <Heading
          component="h2"
          level="h1"
          className="mb-4 text-blue-800"
          data-testid="confirmation-what-happens-next-title"
        >
          {t('components.confirmation.what-happens-next.title')}
        </Heading>
        <ListElement
          items={whatHappensNext.map((item: string) => (
            <Markdown
              key={item.slice(0, 8)}
              content={item.replace('{email}', entry?.data?.email ?? '')}
            />
          ))}
          variant="unordered"
          color="dark"
          className="mb-2 ml-8 obfuscate"
          data-testid="confirmation-what-happens-next-list"
        />
      </div>
      <Markdown
        className="my-4"
        content={t('components.confirmation.privacy-notice')}
        data-testid="confirmation-privacy-notice-content"
      />
      <Button
        type="button"
        as="a"
        href={`/${t('components.confirmation.button.url')}`}
        variant="primary"
        data-testid="back-to-home-button"
        className="flex my-4 md:inline-block"
      >
        {t('components.confirmation.button.text')}
      </Button>
    </>
  );
};
