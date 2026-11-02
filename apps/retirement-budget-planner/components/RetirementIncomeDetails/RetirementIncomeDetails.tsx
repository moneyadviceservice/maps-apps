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

import { Heading } from '@maps-react/common/components/Heading';
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
  const { setSummary } = useSummaryContext();
  const [data, setData] = useState<DataProps>(pageData);
  const [fields, setFields] = useState<RetirementFieldTypes[]>(fieldNames);

  const getFieldSections = (sectionName: string) =>
    fields?.filter((f) => f.sectionName === sectionName) ?? [];

  const [openSectionNames] = useState(() =>
    content.content
      .map((section, sectionIndex) =>
        sectionIndex === 0 ||
        doesMoneyInputFieldSectionsHaveValue({
          fieldSections: getFieldSections(section.sectionName),
          data,
        })
          ? section.sectionName
          : undefined,
      )
      .filter(Boolean),
  );

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

      setSummary((currentSummary) => ({
        ...currentSummary,
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
    const newData = { ...data };

    if (label) delete newData[label];
    delete newData[frequency];
    delete newData[moneyInput];
    setData(newData);

    setSummary((currentSummary) => ({
      ...currentSummary,
      income: sumFields(newData, incomeDefaultFrequencies, 'Frequency'),
    }));

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

  return (
    <>
      {content.content.map((section, sectionIndex) => {
        const fieldSections = getFieldSections(section.sectionName);
        const isSectionOpen = openSectionNames.includes(section.sectionName);

        return (
          <ExpandableSection
            key={section.sectionName}
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
                addButtonLabel={section.addButtonLabel}
                removeButtonLabel={section.removeButtonLabel}
                handleFieldChange={handleFieldChange}
                handleRemoveItem={handleRemoveItem}
                sectionName={section.sectionName}
                handleFocusOut={handleFocusOut}
                handleAddItem={handleAddItem}
              />
            </div>
          </ExpandableSection>
        );
      })}
    </>
  );
};

export default RetirementIncomeDetails;
