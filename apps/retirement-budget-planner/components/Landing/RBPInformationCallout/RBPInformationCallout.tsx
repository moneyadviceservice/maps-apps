import { v4 as uuid4 } from 'uuid';

import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const RBPInformationCallout = () => {
  const { t, tList } = useTranslation();

  return (
    <UrgentCallout data-testid="rbp-callout" border="teal" variant="arrow">
      <div className="md:flex">
        <div>
          {/* Heading */}
          <Heading level="h3" className="mb-6 font-semibold">
            {t('landingPage.informationCallout.heading')}
          </Heading>

          {/* Intro text */}
          <Markdown content={t('landingPage.informationCallout.introText')} />

          {/* List */}
          <ListElement
            items={tList('landingPage.informationCallout.listItems').map(
              (listItem: string) => {
                const key = uuid4();

                return (
                  <Markdown
                    key={key}
                    content={listItem}
                    disableParagraphs={true}
                    withIcon={false}
                  />
                );
              },
            )}
            color="blue"
            variant="unordered"
            className="pb-8 pl-2 text-sm list-inside"
          />

          {/* Outro text */}
          <Markdown content={t('landingPage.informationCallout.outroText')} />
        </div>
      </div>
    </UrgentCallout>
  );
};
