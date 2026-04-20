import { useEffect, useState } from 'react';

import { useSummaryContext } from 'context/SummaryContextProvider/SummaryContextProvider';
import { incomeDefaultFrequencies } from 'data/retirementIncomeData';
import type {
  DataProps,
  PageContentType,
  RetirementFieldTypes,
} from 'lib/types/page.type';
import { SummaryType } from 'lib/types/summary.type';
import {
  createNewFieldsDataGroup,
  removeFieldDataGroup,
  saveDataToMemoryOnFocusOut,
} from 'lib/util/contentFilter/contentFilter';
import { doesMoneyInputFieldSectionsHaveValue } from 'lib/util/moneyInputFields/moneyInputFields';
import { sumFields } from 'lib/util/summaryCalculations/calculations';
import { ExpandableSection } from '@maps-digital/shared/ui/components/ExpandableSection';

import { Markdown } from '@maps-react/vendor/components/Markdown';

import { IncomeSections } from './IncomeSections';

type Props = {
  pageData: DataProps;
  fieldNames: RetirementFieldTypes[];
  content: PageContentType;
  sessionId: string | undefined | null;
  tabName: string;
  summaryData?: SummaryType;
};

const RetirementIncomeDetails = ({
  content,
  pageData,
  fieldNames,
  sessionId,
  tabName,
  summaryData,
}: Props) => {
  const { summary, setSummary } = useSummaryContext();
  const [data, setData] = useState<DataProps>(pageData);
  const [fields, setFields] = useState<RetirementFieldTypes[]>(fieldNames);

  useEffect(() => {
    if (summaryData) setSummary(summaryData);
  }, [summaryData, setSummary]);

  const handleFocusOut = async (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
    sectionName: string,
  ) => {
    e.preventDefault();
    await saveDataToMemoryOnFocusOut(e, sectionName, tabName, sessionId ?? '');
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
        income: sumFields(newData, incomeDefaultFrequencies, 'Frequency'),
      }));
    }
  };

  const handleAddItem = async (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionName: string,
    fieldName: string,
    maxIndex: number,
  ) => {
    e.preventDefault();
    const result = createNewFieldsDataGroup(
      fields,
      sectionName,
      fieldName,
      true,
      maxIndex,
    );

    if (result) {
      setFields(result);
    }

    //Save additional fields to Redis
    const params = new URLSearchParams({
      sectionName,
      sessionId: sessionId ?? '',
      fieldName: fieldName,
      maxIndex: maxIndex.toString(),
    });

    try {
      const response = await fetch(`/api/cache-to-memory?${params}`, {
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
    fieldName: string,
    label: string | undefined,
    frequency: string,
    moneyInput: string,
  ) => {
    e.preventDefault();

    //update data model
    const updatedFields = removeFieldDataGroup(
      fields,
      sectionName,
      fieldName,
      itemIndex,
    );

    setFields(updatedFields);
    // Remove cached values
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
      fieldName,
    });

    try {
      await fetch(`/api/remove-fields?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tabName, dynamic: true, ...newData }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getFieldSections = (sectionName: string) =>
    fields?.filter((f) => f.sectionName === sectionName) ?? [];

  return (
    <div className="space-y-2">
      {content.content.map((section, sectionIndex) => {
        const fieldSections = getFieldSections(section.sectionName);

        const isSectionOpen =
          sectionIndex === 0 ||
          doesMoneyInputFieldSectionsHaveValue({
            fieldSections,
            data,
          });

        return (
          <div
            key={section.sectionName}
            className="text-2xl font-bold no-underline"
          >
            <ExpandableSection
              title={section.sectionTitle}
              open={isSectionOpen}
              variant="mainLeftIcon"
              className="border-b-0"
              testId="retirement-income-section"
            >
              <div
                className="mb-4 md:mb-9"
                data-testid="retirement-income-section-content"
              >
                {section.sectionDescription && (
                  <Markdown
                    content={section.sectionDescription}
                    className="font-normal"
                  />
                )}
                <IncomeSections
                  sections={fieldSections}
                  sectionIndex={sectionIndex}
                  data={data}
                  sessionId={sessionId}
                  sectionLabel={section.addButtonLabel}
                  handleFieldChange={handleFieldChange}
                  handleRemoveItem={handleRemoveItem}
                  sectionName={section.sectionName}
                  handleFocusOut={handleFocusOut}
                  handleAddItem={handleAddItem}
                />
              </div>
            </ExpandableSection>
          </div>
        );
      })}
    </div>
  );
};

export default RetirementIncomeDetails;
