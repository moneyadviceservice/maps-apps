import { useState } from 'react';

import { BACKGROUND_COLOUR, Theme } from 'components/Theme';
import { VisibleSection } from 'components/VisibleSection';
import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import {
  DataProps,
  PageContentType,
  RetirementFieldTypes,
} from 'lib/types/page.type';
import {
  createNewMoneyInputFrequencyItem,
  removeMoneyInputFrequencyItem,
} from 'lib/util/contentFilter/contentFilter';
import { sumFields } from 'lib/util/summaryCalculations/calculations';
import { twMerge } from 'tailwind-merge';
import { ExpandableSection } from '@maps-digital/shared/ui/components/ExpandableSection';

import { Button } from '@maps-react/common/components/Button';
import { H4 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { IncomeSections } from './IncomeSections';

type Props = {
  pageData: DataProps;
  fieldNames: RetirementFieldTypes[];
  content: PageContentType[];
};

const RetirementIncomeDetails = ({ content, pageData, fieldNames }: Props) => {
  const { summary, setSummary } = useSummaryContext();
  const [data, setData] = useState<DataProps>(pageData);
  const [fields, setFields] = useState<RetirementFieldTypes[]>(fieldNames);

  const handleFieldChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
  ) => {
    e.preventDefault();

    if (property && property.length > 0) {
      const newData = { ...data, [property]: e.target.value };
      setData(newData);

      setSummary(() => ({
        ...summary,
        income: sumFields(newData, 'Frequency'),
      }));
    }
  };

  const handleAddItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionName: string,
  ) => {
    e.preventDefault();

    const result = createNewMoneyInputFrequencyItem(fields, sectionName);
    if (result) {
      setFields(result);
    }
  };

  const handleRemoveItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    itemIndex: number,
    sectionName: string,
    label: string | undefined,
    frequency: string,
    moneyInput: string,
  ) => {
    e.preventDefault();

    const updatedFields = removeMoneyInputFrequencyItem(
      fields,
      sectionName,
      itemIndex,
    );

    setFields(updatedFields);
    const newData = Object.assign(data);
    if (label) delete newData[label];
    delete newData[frequency];
    delete newData[moneyInput];
    setData(newData);
  };

  return (
    <div className="space-y-6 md:space-y-14">
      {content.map((partner, partnerIdx) => (
        <Theme
          theme={
            partnerIdx === 1
              ? BACKGROUND_COLOUR.GREY
              : BACKGROUND_COLOUR.DEFAULT
          }
          key={`${partnerIdx}`}
        >
          <input
            type="hidden"
            name="partnerIndex"
            value={`p${partnerIdx + 1}`}
          />
          <H4 className=" text-magenta-500">{partner.partnerName}</H4>
          {partner.content.map((section, sectionIndex) => {
            const sectionItems = fields.filter(
              (f) => f.sectionName === section.sectionName,
            );

            return (
              <div
                key={sectionIndex}
                className="text-2xl font-bold no-underline"
              >
                <ExpandableSection
                  title={section.sectionTitle}
                  open={sectionIndex === 0}
                  variant="mainLeftIcon"
                  className="border-b-0"
                >
                  {section.sectionDescription && (
                    <Paragraph className="font-normal">
                      {section.sectionDescription}
                    </Paragraph>
                  )}
                  <div className="space-y-5">
                    {sectionItems?.length > 0 && (
                      <IncomeSections
                        sectionItems={sectionItems}
                        sectionIndex={sectionIndex}
                        data={data}
                        handleFieldChange={handleFieldChange}
                        handleRemoveItem={handleRemoveItem}
                        sectionName={section.sectionName}
                      />
                    )}
                  </div>
                  <VisibleSection visible={!!section.addButtonLabel}>
                    <Button
                      variant="primary"
                      formAction={`/api/add-fields?sectionName=${section.sectionName}`}
                      onClick={(e) => handleAddItem(e, section.sectionName)}
                      className={twMerge(
                        'mt-5',
                        sectionItems[0]?.maxItems <
                          sectionItems[0]?.items.length && 'hidden',
                      )}
                    >
                      {section.addButtonLabel}
                    </Button>
                  </VisibleSection>
                </ExpandableSection>
              </div>
            );
          })}
        </Theme>
      ))}
    </div>
  );
};

export default RetirementIncomeDetails;
