import { useEffect, useState } from 'react';

import { InputGroup } from 'components/InputGroup/InputGroup';
import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import {
  DataProps,
  PageContentType,
  RetirementFieldTypes,
  RetirementGroupFieldType,
  RetirmentContentType,
} from 'lib/types/page.type';
import { SummaryType } from 'lib/types/summary.type';
import { saveDataToMemoryOnFocusOut } from 'lib/util/contentFilter/contentFilter';
import { sumFields } from 'lib/util/summaryCalculations/calculations';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

export type PageProps = {
  pageData: DataProps;
  fieldNames: RetirementFieldTypes[];
  pageContent: PageContentType;
  tabName: string;
  sessionId: string;
  summaryData: SummaryType | undefined;
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
        spending: sumFields(newData, 'Frequency'),
      }));
    }
  };

  return pageContent.content.map(
    (section: RetirmentContentType, sectionIndex: number) => {
      const sectionItems = fieldNames.filter(
        (f) => f.sectionName === section.sectionName,
      );

      return (
        <div
          key={sectionIndex}
          className="text-2xl font-bold border-b-1 border-slate-400 p-2"
        >
          <ExpandableSection
            title={section.sectionTitle}
            open={sectionIndex === 0}
          >
            <div className="space-y-3.5">
              {sectionItems[0]?.items.map(
                (item: RetirementGroupFieldType, itemIndex: number) => (
                  <div
                    className="flex gap-6 justify-items-end font-normal"
                    key={`${sectionIndex}-${itemIndex}`}
                  >
                    <InputGroup
                      item={item}
                      data={data}
                      onLabelChange={(e) =>
                        handleChange(e, item.inputLabelName || '')
                      }
                      onInputChange={(e) =>
                        handleChange(e, item.moneyInputName)
                      }
                      onFrequencyChange={(e) =>
                        handleChange(e, item.frequencyName)
                      }
                      onElementFocusOut={(e) =>
                        saveDataToMemoryOnFocusOut(
                          e,
                          section.sectionName,
                          tabName,
                          sessionId,
                        )
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </ExpandableSection>
        </div>
      );
    },
  );
};
