import { InputGroup } from 'components/InputGroup/InputGroup';
import { VisibleSection } from 'components/VisibleSection';
import {
  DataProps,
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';

import { Button } from '@maps-react/common/components/Button';
import { twMerge } from 'tailwind-merge';

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
        sections[0].fields.map(
          ({ items, field, maxItems, isDynamic }, index) => {
            const maxIndex: number = items.reduce((acc, item) => {
              return Math.max(acc, item.index);
            }, 0);
            return (
              <div key={`${sectionIndex}-${index}`} className="space-y-4">
                {items.map(
                  (item: RetirementGroupFieldType, itemIndex: number) => (
                    <div
                      className="flex gap-6 font-normal"
                      key={item.moneyInputName}
                    >
                      <InputGroup
                        item={item}
                        data={data}
                        isDynamic={isDynamic}
                        onLabelChange={(e) =>
                          handleFieldChange(e, item.inputLabelName || '')
                        }
                        onInputChange={(e) =>
                          handleFieldChange(e, item.moneyInputName)
                        }
                        onFrequencyChange={(e) =>
                          handleFieldChange(e, item.frequencyName)
                        }
                        onElementFocusOut={(e) =>
                          handleFocusOut(e, sectionName)
                        }
                      />
                      <VisibleSection
                        visible={itemIndex !== 0 && !!item.enableRemove}
                      >
                        <input
                          type="hidden"
                          value={itemIndex}
                          name="itemIndex"
                        />
                        <Button
                          variant="secondary"
                          formAction={`/api/remove-fields?${new URLSearchParams(
                            {
                              sectionName,
                              id: String(item.index),
                              sessionId: sessionId as string,
                              fieldName: field,
                            },
                          )}`}
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
                  ),
                )}

                <VisibleSection visible={!!isDynamic}>
                  <Button
                    variant="primary"
                    formAction={`/api/cache-to-memory?${new URLSearchParams({
                      sectionName: sections[0].sectionName,
                      sessionId: sessionId as string,
                      fieldName: field,
                      maxIndex: maxIndex.toString(),
                    })}`}
                    onClick={(e) =>
                      handleAddItem(e, sections[0].sectionName, field, maxIndex)
                    }
                    className={twMerge(
                      'mt-5',
                      maxItems && maxItems < items.length && 'hidden',
                    )}
                  >
                    {sectionLabel}
                  </Button>
                </VisibleSection>
              </div>
            );
          },
        )}
    </div>
  );
};
