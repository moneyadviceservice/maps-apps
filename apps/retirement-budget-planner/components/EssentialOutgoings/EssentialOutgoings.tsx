import { useEffect, useState } from 'react';

import { VisibleSection } from 'components/VisibleSection';
import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import { costDefaultFrequencies } from 'data/essentialOutgoingsData';
import type {
  CostsFieldTypes,
  DataProps,
  PageContentType,
  RetirementGroupFieldType,
  RetirmentContentType,
} from 'lib/types/page.type';
import { SummaryType } from 'lib/types/summary.type';
import { doesMoneyInputFieldArrayHaveValue } from 'lib/util/moneyInputFields/moneyInputFields';
import { sumFields } from 'lib/util/summaryCalculations/calculations';
import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
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

  const getSectionItems = (sectionName: string) =>
    fieldNames.find((f) => f.sectionName === sectionName)?.items ?? [];

  return pageContent.content.map(
    (section: RetirmentContentType, sectionIndex: number) => {
      const sectionItems = getSectionItems(section.sectionName);

      const isSectionOpen =
        sectionIndex === 0 ||
        doesMoneyInputFieldArrayHaveValue({
          fields: sectionItems,
          data,
        });

      return (
        <div
          key={section.sectionName}
          className={twMerge(
            `border-b-1 border-slate-400 p-2 text-2xl font-bold`,
            sectionIndex === 0 && 'border-t-1 border-slate-400',
          )}
        >
          <ExpandableSection title={section.sectionTitle} open={isSectionOpen}>
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
    },
  );
};
