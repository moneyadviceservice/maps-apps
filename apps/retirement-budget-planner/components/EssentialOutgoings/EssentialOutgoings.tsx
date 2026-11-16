import { useEffect, useState } from 'react';

import { VisibleSection } from 'components/VisibleSection';
import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import { costDefaultFrequencies } from 'data/essentialOutgoingsData';
import type {
  CostsFieldTypes,
  DataProps,
  PageContentType,
  RetirementContentType,
  RetirementGroupFieldType,
} from 'lib/types/page.type';
import { SummaryType } from 'lib/types/summary.type';
import { doesMoneyInputFieldArrayHaveValue } from 'lib/util/moneyInputFields/moneyInputFields';
import { sumFields } from 'lib/util/summaryCalculations/calculations';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { EssentialOutgoingSection } from './EssentialOutgoingSection';

export type PageProps = {
  pageData: DataProps;
  fieldNames: CostsFieldTypes[];
  pageContent: PageContentType;
  tabName: string;
  sessionId: string;
  summaryData: SummaryType | undefined;
};

/**
 * scrollToExpandableSectionFromUrlAnchor
 *
 * If an anchor hash is present in the URL, open the corresponding section and
 * scroll to it. Used when editing a specific cost category from the summary
 * page. This functionality is handled natively by the browser in non-js mode.
 *
 * Requires inner element of <ExpandableSection> to have an ID matching the hash
 *
 * e.g. <ExpandableSection><div id="housingCost">...</div></ExpandableSection>
 */
const scrollToExpandableSectionFromUrlAnchor = () => {
  if (!globalThis.location.hash) return;

  const prefersReducedMotion =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;

  const anchoredElement = document.getElementById(
    globalThis.location.hash.substring(1),
  );

  if (!anchoredElement) return;

  const parentDetailsElement = anchoredElement.closest('details');

  if (!parentDetailsElement) return;

  parentDetailsElement.setAttribute('open', '');
  parentDetailsElement.scrollIntoView({
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
    block: 'start',
  });

  const summaryElement = parentDetailsElement.querySelector('summary');

  if (!summaryElement) return;

  summaryElement.focus({ preventScroll: true });
};

export const EssentialOutgoings = ({
  pageContent,
  pageData,
  fieldNames,
  tabName,
  sessionId,
  summaryData,
}: PageProps) => {
  const [data, setData] = useState(pageData);

  const getSectionItems = (sectionName: string) =>
    fieldNames.find((f) => f.sectionName === sectionName)?.items ?? [];

  const [openSectionNames] = useState(() =>
    pageContent.content
      .map((section, sectionIndex) =>
        sectionIndex === 0 ||
        doesMoneyInputFieldArrayHaveValue({
          fields: getSectionItems(section.sectionName),
          data: pageData,
        })
          ? section.sectionName
          : undefined,
      )
      .filter(Boolean),
  );

  const { setSummary } = useSummaryContext();

  useEffect(() => {
    if (summaryData) setSummary(summaryData);
  }, [summaryData, setSummary]);

  useEffect(() => {
    scrollToExpandableSectionFromUrlAnchor();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
  ) => {
    e.preventDefault();

    if (property && property.length > 0) {
      const newData = { ...data, [property]: e.target.value };

      setData(newData);
      setSummary((prev) => ({
        ...prev,
        spending: sumFields(newData, costDefaultFrequencies(), 'Frequency'),
      }));
    }
  };

  return pageContent.content.map((section: RetirementContentType) => {
    const sectionItems = getSectionItems(section.sectionName);
    const isSectionOpen = openSectionNames.includes(section.sectionName);

    return (
      <div key={section.sectionName}>
        <ExpandableSection
          title={
            <Heading
              component="h2"
              level="h4"
              className="text-inherit text-[length:inherit] font-inherit leading-[inherit]"
            >
              {section.sectionTitle}
            </Heading>
          }
          open={isSectionOpen}
          variant="mainLeftIcon"
          className="border-b-0"
          testClassName="my-2"
        >
          <div
            className="scroll-mt-[68px] space-y-3.5"
            id={section.sectionName}
          >
            <div className="mb-4 space-y-4 md:mb-9">
              <VisibleSection visible={Boolean(section.sectionDescription)}>
                <Markdown
                  content={section.sectionDescription || ''}
                  className="font-normal"
                />
              </VisibleSection>
              {sectionItems.map((item: RetirementGroupFieldType) => (
                <EssentialOutgoingSection
                  key={item.moneyInputName}
                  item={item}
                  data={data}
                  sectionName={section.sectionName}
                  tabName={tabName}
                  sessionId={sessionId}
                  handleChange={handleChange}
                />
              ))}
            </div>
          </div>
        </ExpandableSection>
      </div>
    );
  });
};
