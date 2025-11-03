import { InputGroup } from 'components/InputGroup/InputGroup';
import { VisibleSection } from 'components/VisibleSection';
import {
  DataProps,
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';

import { Button } from '@maps-react/common/components/Button';

type Props = {
  sectionItems: RetirementFieldTypes[];
  sectionIndex: number;
  data: DataProps;
  sessionId: string | undefined | null;
  stepsEnabled: string;
  handleFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
  ) => void;
  handleRemoveItem: (
    e: React.MouseEvent<HTMLButtonElement>,
    itemIndex: number,
    sectionName: string,
    label: string | undefined,
    frequency: string,
    moneyInput: string,
  ) => void;
  sectionName: string;
  handleFocusOut: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
    sectionName: string,
  ) => void;
};

export const IncomeSections = ({
  sectionItems,
  sectionIndex,
  data,
  sessionId,
  stepsEnabled,
  handleFieldChange,
  handleRemoveItem,
  sectionName,
  handleFocusOut,
}: Props) => {
  return sectionItems[0].items.map(
    (item: RetirementGroupFieldType, itemIndex: number) => (
      <div
        className="flex gap-6 justify-items-end font-normal"
        key={`${sectionIndex}-${itemIndex}`}
      >
        <InputGroup
          item={item}
          data={data}
          onLabelChange={(e) => handleFieldChange(e, item.inputLabelName || '')}
          onInputChange={(e) => handleFieldChange(e, item.moneyInputName)}
          onFrequencyChange={(e) => handleFieldChange(e, item.frequencyName)}
          onElementFocusOut={(e) => handleFocusOut(e, sectionName)}
        />
        <VisibleSection
          visible={
            !!item.inputLabelName &&
            itemIndex !== 0 &&
            sectionItems[0].enableRemove
          }
        >
          <input type="hidden" value={itemIndex} name="itemIndex" />
          <Button
            variant="secondary"
            formAction={`/api/remove-fields?${new URLSearchParams({
              sectionName,
              id: String(item.index),
              sessionId: sessionId as string,
            })}`}
            onClick={(e) =>
              handleRemoveItem(
                e,
                item.index,
                sectionName,
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
  );
};
