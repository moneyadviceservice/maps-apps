import { useEffect, useRef } from 'react';

import { InputGroup } from 'components/InputGroup/InputGroup';
import { VisibleSection } from 'components/VisibleSection';
import {
  BasicGroupFieldType,
  DataProps,
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type Props = {
  sections: RetirementFieldTypes[];
  sectionIndex: number;
  data: DataProps;
  sessionId: string | undefined | null;
  addButtonLabel?: string;
  removeButtonLabel?: string;
  handleFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
  ) => void;
  handleRemoveItem: (
    e: React.MouseEvent<HTMLButtonElement>,
    itemIndex: number,
    sectionName: string,
    fieldName: string,
    label: string | undefined,
    frequency: string,
    moneyInput: string,
  ) => void;
  sectionName: string;
  handleFocusOut: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
    sectionName: string,
  ) => void;
  handleAddItem: (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionName: string,
    fieldName: string,
    maxIndex: number,
  ) => void;
};

// Helper function to focus on newly added item's input field
const focusOnNewItem = (newItem: RetirementGroupFieldType) => {
  const inputToFocus =
    (newItem.inputLabelName &&
      document.getElementById(newItem.inputLabelName)) ||
    document.getElementById(newItem.moneyInputName);

  if (inputToFocus) {
    inputToFocus.focus();
  }
};

// Helper function to handle item count changes and focus management
const handleItemCountChange = (
  key: string,
  items: BasicGroupFieldType[] | RetirementGroupFieldType[],
  prevItemCountsRef: { current: Map<string, number> },
  pendingFocusKeysRef: { current: Set<string> },
) => {
  const prevCount = prevItemCountsRef.current.get(key) || 0;
  const currentCount = items.length;

  // Focus only when a user explicitly clicked "add" for this key.
  if (
    currentCount > prevCount &&
    currentCount > 0 &&
    pendingFocusKeysRef.current.has(key)
  ) {
    const newItem = items[currentCount - 1] as RetirementGroupFieldType;
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => focusOnNewItem(newItem), 100);
    pendingFocusKeysRef.current.delete(key);
  }

  // Update the tracked count
  prevItemCountsRef.current.set(key, currentCount);
};

export const IncomeSections = ({
  sections,
  sectionIndex,
  data,
  sessionId,
  addButtonLabel,
  removeButtonLabel,
  handleFieldChange,
  handleRemoveItem,
  sectionName,
  handleFocusOut,
  handleAddItem,
}: Props) => {
  // Track the previous item counts to detect when new items are added
  const prevItemCountsRef = useRef<Map<string, number>>(new Map());
  // Track which dynamic groups requested focus via explicit add clicks.
  const pendingFocusKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    sections?.forEach((sectionGroup) => {
      sectionGroup.fields.forEach(({ items, field }) => {
        const key = `${sectionGroup.sectionName}-${field}`;
        handleItemCountChange(
          key,
          items,
          prevItemCountsRef,
          pendingFocusKeysRef,
        );
      });
    });
  }, [sections]);

  return (
    <div className="space-y-5">
      {sections?.length > 0 &&
        sections.map((sectionGroup, groupIdx) =>
          sectionGroup.fields.map(
            (
              { items, field, maxItems, isDynamic, title, description },
              index,
            ) => {
              const maxIndex: number = items.reduce((acc, item) => {
                return Math.max(acc, item.index);
              }, 0);
              const focusKey = `${sectionGroup.sectionName}-${field}`;

              return (
                <div
                  key={`${sectionIndex}-${groupIdx}-${index}`}
                  className="flex flex-col items-start gap-4"
                >
                  {title && (
                    <Heading component="h3" level="h5">
                      {title}
                    </Heading>
                  )}
                  {description && (
                    <Markdown content={description} className="font-normal" />
                  )}
                  <DisplayIncomeSections
                    items={items}
                    data={data}
                    isDynamic={isDynamic}
                    sectionName={sectionName}
                    sessionId={sessionId}
                    field={field}
                    removeButtonLabel={removeButtonLabel}
                    handleFieldChange={handleFieldChange}
                    handleRemoveItem={handleRemoveItem}
                    handleFocusOut={handleFocusOut}
                  />

                  <VisibleSection visible={!!isDynamic}>
                    <Button
                      variant="primary"
                      formAction={`/api/cache-to-memory?${new URLSearchParams({
                        sectionName: sectionGroup.sectionName,
                        sessionId: sessionId as string,
                        fieldName: field,
                        maxIndex: maxIndex.toString(),
                      })}`}
                      onClick={(e) => {
                        pendingFocusKeysRef.current.add(focusKey);
                        handleAddItem(
                          e,
                          sectionGroup.sectionName,
                          field,
                          maxIndex,
                        );
                      }}
                      className={twMerge(
                        'mt-5',
                        maxItems && items.length >= maxItems && 'hidden',
                      )}
                      data-testid={`add-${field}-button`}
                    >
                      {addButtonLabel}
                    </Button>
                  </VisibleSection>
                </div>
              );
            },
          ),
        )}
    </div>
  );
};
type DisplayIncomeSectionsProps = {
  items: BasicGroupFieldType[] | RetirementGroupFieldType[];
  data: DataProps;
  isDynamic: boolean;
  sectionName: string;
  sessionId: string | undefined | null;
  field: string;
  removeButtonLabel?: string;
  handleFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
  ) => void;
  handleRemoveItem: (
    e: React.MouseEvent<HTMLButtonElement>,
    itemIndex: number,
    sectionName: string,
    fieldName: string,
    label: string | undefined,
    frequency: string,
    moneyInput: string,
  ) => void;
  handleFocusOut: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
    sectionName: string,
  ) => void;
};
const DisplayIncomeSections = ({
  items,
  data,
  isDynamic,
  sectionName,
  sessionId,
  field,
  removeButtonLabel,
  handleFieldChange,
  handleRemoveItem,
  handleFocusOut,
}: DisplayIncomeSectionsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {items.map((item: RetirementGroupFieldType, itemIndex: number) => {
        item = {
          ...item,
          moneyInputLabelText: t('income.moneyInputLabelText'),
          frequencySelectLabelText: t('income.frequencySelectLabelText'),
        };

        const hasRemoveButton = itemIndex !== 0 && !!item.enableRemove;

        return (
          <div
            className="flex flex-col w-full gap-4 lg:gap-6 lg:flex-row"
            key={item.moneyInputName}
          >
            <InputGroup
              item={item}
              data={data}
              isDynamic={isDynamic}
              itemIndex={itemIndex}
              onLabelChange={(e) =>
                handleFieldChange(e, item.inputLabelName || '')
              }
              onInputChange={(e) => handleFieldChange(e, item.moneyInputName)}
              onFrequencyChange={(e) =>
                handleFieldChange(e, item.frequencyName)
              }
              onElementFocusOut={(e) => handleFocusOut(e, sectionName)}
              className={twMerge(!hasRemoveButton && 'w-full')}
            />
            <VisibleSection visible={hasRemoveButton}>
              <input type="hidden" value={itemIndex} name="itemIndex" />
              <Button
                variant="secondary"
                formAction={`/api/remove-fields?${new URLSearchParams({
                  sectionName,
                  id: String(item.index),
                  sessionId: sessionId as string,
                  fieldName: field,
                })}`}
                onClick={(e) =>
                  handleRemoveItem(
                    e,
                    item.index,
                    sectionName,
                    field,
                    item.inputLabelName,
                    item.frequencyName,
                    item.moneyInputName,
                  )
                }
                className="self-start lg:self-end"
              >
                {removeButtonLabel}
              </Button>
            </VisibleSection>
          </div>
        );
      })}
    </>
  );
};
