import React, { useCallback, useEffect, useRef } from 'react';

import { BackToTop } from 'components/BackToTop/BackToTop';

import { H2 } from '@maps-react/common/index';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { mapJsonRichText, Node } from '@maps-react/vendor/utils/RenderRichText';

import { RichTextWrapper } from '../RichTextWrapper';

const DOWNLOADABLE_FILE_EXTENSIONS = [
  'pdf',
  'csv',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
];

const hasDownloadableExtension = (href: string) => {
  const normalizedHref = href.toLowerCase();

  try {
    const parsedUrl = new URL(href, window.location.href);
    const pathname = parsedUrl.pathname.toLowerCase();

    return DOWNLOADABLE_FILE_EXTENSIONS.some((ext) =>
      pathname.endsWith(`.${ext}`),
    );
  } catch {
    return DOWNLOADABLE_FILE_EXTENSIONS.some((ext) =>
      normalizedHref.includes(`.${ext}`),
    );
  }
};

export interface Section {
  header: {
    text: string;
    id: string;
  };
  json: Node[];
}

export const DocumentSections = ({ sections }: { sections: Section[] }) => {
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const { addEvent } = useAnalytics();

  const trackDownload = useCallback(
    (linkText: string, destinationURL: string) => {
      addEvent({
        event: 'fileDownload',
        eventInfo: {
          linkText,
          destinationURL,
        },
      });
    },
    [addEvent],
  );

  useEffect(() => {
    const sectionEl = sectionContentRef.current;
    if (!sectionEl) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const href = anchor.getAttribute('href') ?? '';

      if (!href || !hasDownloadableExtension(href)) {
        return;
      }

      event.preventDefault();

      const linkText = anchor.textContent?.trim() || '';

      trackDownload(linkText, href);
      window.open(href, '_blank');
    };

    sectionEl.addEventListener('click', handleClick);

    return () => {
      sectionEl.removeEventListener('click', handleClick);
    };
  }, [trackDownload]);

  return (
    <div
      data-testid="section"
      className="mt-6 lg:mt-10"
      ref={sectionContentRef}
    >
      {sections?.map((sec) => {
        const sections = sec.json.map((s) => mapJsonRichText([s]));
        return (
          <React.Fragment key={sec.header.id}>
            <RichTextWrapper>
              <H2 level="h2" id={sec.header.id} className="mb-4">
                {sec.header.text}
              </H2>
              {sections}
            </RichTextWrapper>
            <div className="flex justify-start justify-items-start mb-4">
              <BackToTop />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
