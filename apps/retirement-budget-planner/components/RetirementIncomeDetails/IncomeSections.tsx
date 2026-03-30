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
import { H5 } from '@maps-react/common/components/Heading';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type Props = {
  sections: RetirementFieldTypes[];
  sectionIndex: number;
  data: DataProps;
  sessionId: string | undefined | null;
  sectionLabel: string | null | undefined;
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

export const IncomeSections = ({
  sections,
  sectionIndex,
  data,
  sessionId,
  sectionLabel,
  handleFieldChange,
  handleRemoveItem,
  sectionName,
  handleFocusOut,
  handleAddItem,
}: Props) => {
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
              return (
                <div
                  key={`${sectionIndex}-${groupIdx}-${index}`}
                  className="space-y-4"
                >
                  {title && <H5>{title}</H5>}
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
                      onClick={(e) =>
                        handleAddItem(
                          e,
                          sectionGroup.sectionName,
                          field,
                          maxIndex,
                        )
                      }
                      className={twMerge(
                        'mt-5',
                        maxItems && items.length >= maxItems && 'hidden',
                      )}
                      data-testid={`add-${field}-button`}
                    >
                      {sectionLabel}
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
  handleFieldChange,
  handleRemoveItem,
  handleFocusOut,
}: DisplayIncomeSectionsProps) => {
  return (
    <>
      {items.map((item: RetirementGroupFieldType, itemIndex: number) => (
        <div className="flex gap-6 font-normal" key={item.moneyInputName}>
          <InputGroup
            item={item}
            data={data}
            isDynamic={isDynamic}
            onLabelChange={(e) =>
              handleFieldChange(e, item.inputLabelName || '')
            }
            onInputChange={(e) => handleFieldChange(e, item.moneyInputName)}
            onFrequencyChange={(e) => handleFieldChange(e, item.frequencyName)}
            onElementFocusOut={(e) => handleFocusOut(e, sectionName)}
          />
          <VisibleSection visible={itemIndex !== 0 && !!item.enableRemove}>
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
              className="self-end"
            >
              {'Remove'}
            </Button>
          </VisibleSection>
        </div>
      ))}
    </>
  );
};
