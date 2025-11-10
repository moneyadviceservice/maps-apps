import { useEffect, useState } from 'react';

import { BACKGROUND_COLOUR, Theme } from 'components/Theme';
import { VisibleSection } from 'components/VisibleSection';
import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import {
  DataProps,
  PageContentType,
  RetirementFieldTypes,
} from 'lib/types/page.type';
import { SummaryType } from 'lib/types/summary.type';
import {
  createNewMoneyInputFrequencyItem,
  removeMoneyInputFrequencyItem,
  saveDataToMemoryOnFocusOut,
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
  sessionId: string | undefined | null;
  tabName: string;
  stepsEnabled: string;
  summaryData?: SummaryType;
};

const RetirementIncomeDetails = ({
  content,
  pageData,
  fieldNames,
  sessionId,
  tabName,
  summaryData,
  stepsEnabled,
}: Props) => {
  const { summary, setSummary } = useSummaryContext();
  const [data, setData] = useState<DataProps>(pageData);

  const [fields, setFields] = useState<RetirementFieldTypes[]>(fieldNames);

  useEffect(() => {
    if (summaryData) setSummary(summaryData);
  }, [summaryData, setSummary]);

  const handleFocusOut = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    sectionName: string,
  ) => {
    saveDataToMemoryOnFocusOut(e, sectionName, tabName, sessionId ?? '');
  };

  const handleFieldChange = (
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

  const handleAddItem = async (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionName: string,
  ) => {
    e.preventDefault();

    const result = createNewMoneyInputFrequencyItem(fields, sectionName);
    if (result) {
      setFields(result);
    }

    //Save additional fields to Redis
    const params = new URLSearchParams({
      sectionName,
      sessionId: sessionId ?? '',
    });

    try {
      const response = await fetch(`/api/add-fields?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tabName, dynamic: true }),
      });

      if (!response.ok) {
        console.error(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveItem = async (
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

    //Remove data from memory
    const params = new URLSearchParams({
      sectionName,
      id: String(itemIndex),
      sessionId: sessionId ?? '',
    });

    try {
      await fetch(`/api/remove-fields?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tabName, dynamic: true, newData }),
      });
    } catch (e) {
      console.error(e);
    }
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
            const sectionItems = fields?.filter(
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
                        sessionId={sessionId}
                        stepsEnabled={stepsEnabled}
                        handleFieldChange={handleFieldChange}
                        handleRemoveItem={handleRemoveItem}
                        sectionName={section.sectionName}
                        handleFocusOut={handleFocusOut}
                      />
                    )}
                  </div>
                  <VisibleSection visible={!!section.addButtonLabel}>
                    <Button
                      variant="primary"
                      formAction={`/api/add-fields?${new URLSearchParams({
                        sectionName: section.sectionName,
                        sessionId: sessionId as string,
                      })}`}
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
