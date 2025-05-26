import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';

export const Confirmation: StepComponent = ({ entry }) => {
  const { t, tList } = useTranslation();
  const whatHappensNext = tList(
    'components.confirmation.what-happens-next.items',
  );
  const referenceNumber = 'CAS-60785'; // Replace with actual reference number logic
  return (
    <>
      <div className="md:max-w-4xl">
        <InformationCallout className="bg-blue-800 p-9">
          <Heading
            component="h1"
            className="text-white mb-9"
            data-testid="confirmation-title"
          >
            {t('components.confirmation.callout.title')}
          </Heading>
          <Markdown
            className="mb-0 text-white"
            content={t('components.confirmation.callout.content', {
              referenceNumber,
            })}
            data-testid="confirmation-callout-content"
          />
        </InformationCallout>

        <Paragraph className="my-9" data-testid="confirmation-content">
          {t('components.confirmation.content')}
        </Paragraph>
        <div>
          <Heading
            component="h2"
            level="h1"
            className="mb-4"
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
            className="ml-8"
            data-testid="confirmation-what-happens-next-list"
          />
        </div>
      </div>
      <Markdown
        className="mt-16 mb-0"
        content={t('components.confirmation.privacy-notice')}
        data-testid="confirmation-privacy-notice-content"
      />
    </>
  );
};
