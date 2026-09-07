import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { v4 as uuid4 } from 'uuid';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type LandingPageSection = {
  id: number;
  heading?: string;
  introText?: string;
  listItems?: string[];
  outroText?: string;
  outroListItems?: string[];
  startButton?: boolean;
};

export const HowRBPWorks = ({ lang }: { lang: string }) => {
  const { tList } = useTranslation();

  return (
    <section data-testid="how-rbp-works">
      {tList('landingPage.sections').map((section: LandingPageSection) => (
        <HowRBPWorksSection key={section.id} section={section} lang={lang} />
      ))}
    </section>
  );
};

const HowRBPWorksSection = ({
  section,
  lang,
}: {
  section: LandingPageSection;
  lang: string;
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Heading */}
      {section.heading && (
        <Heading level="h6" component="h2" className="mb-4">
          {section.heading}
        </Heading>
      )}

      {/* Intro text */}
      {section.introText && <Paragraph>{section.introText}</Paragraph>}

      {/* List */}
      {section.listItems && (
        <ListElement
          items={section.listItems.map((listItem) => {
            const key = uuid4();

            return (
              <Markdown key={key} content={listItem} disableParagraphs={true} />
            );
          })}
          color="blue"
          variant="unordered"
          className="pb-8 pl-2 text-sm list-inside"
        />
      )}

      {/* Outro text */}
      {section.outroText && <Paragraph>{section.outroText}</Paragraph>}

      {/* Outro list */}
      {section.outroListItems && (
        <ListElement
          items={section.outroListItems.map((listItem) => {
            const key = uuid4();

            return (
              <Markdown key={key} content={listItem} disableParagraphs={true} />
            );
          })}
          color="blue"
          variant="unordered"
          className="pb-8 pl-2 text-sm list-inside"
        />
      )}

      {/* Start button */}
      {section.startButton && (
        <Link
          data-testid="rbp-link-from-how-it-works"
          className="my-4"
          asButtonVariant="primary"
          id="submit"
          href={`/${lang}/${PAGES_NAMES.ABOUTYOU}`}
        >
          {t('landingPage.startButton')}
        </Link>
      )}
    </div>
  );
};
