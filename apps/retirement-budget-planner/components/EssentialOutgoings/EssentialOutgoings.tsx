import { useState } from 'react';

import { FREQUENCY_OPTIONS } from 'lib/constants/pageConstants';
import {
  DataProps,
  PageContentType,
  RetirementFieldTypes,
  RetirementGroupFieldType,
  RetirmentContentType,
} from 'lib/types/page.type';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import MoneyInputFrequencyGroup from '@maps-react/pension-tools/components/MoneyInputFrequencyGroup';

export type PageProps = {
  pageData: DataProps;
  fieldNames: RetirementFieldTypes[];
  pageContent: PageContentType;
};

export const EssentialOutgoings = ({
  pageContent,
  pageData,
  fieldNames,
}: PageProps) => {
  const [data, setData] = useState(pageData);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
  ) => {
    e.preventDefault();

    if (property && property.length > 0) {
      setData({ ...data, [property]: e.target.value });
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
                    <div className="space-y-2">
                      <MoneyInputFrequencyGroup
                        testId={`${item.moneyInputName}Id`}
                        labelInputName={item.inputLabelName}
                        labelInputValue={data[item.inputLabelName || '']}
                        moneyInputname={item.moneyInputName}
                        moneyInputValue={data[item.moneyInputName]}
                        frequencySelectName={item.frequencyName}
                        frequencySelectOptions={FREQUENCY_OPTIONS}
                        frequencySelectDefaultValue="month"
                        frequencySelectValue={data[item.frequencyName]}
                        labelText={item.labelText}
                        onLabelInputChange={(e) =>
                          handleChange(e, item.inputLabelName || '')
                        }
                        onMoneyInputChange={(e) =>
                          handleChange(e, item.moneyInputName)
                        }
                        onfrequencySelectChange={(e) =>
                          handleChange(e, item.frequencyName)
                        }
                      />
                      {item.moreInfo && (
                        <ExpandableSection
                          type="nested"
                          title={'More information'}
                        >
                          {item.moreInfo}
                        </ExpandableSection>
                      )}
                    </div>
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
