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
  handleFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    property: string,
    sectionName: string,
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
};

export const IncomeSections = ({
  sectionItems,
  sectionIndex,
  data,
  handleFieldChange,
  handleRemoveItem,
  sectionName,
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
          onLabelChange={(e) =>
            handleFieldChange(e, item.inputLabelName || '', sectionName)
          }
          onInputChange={(e) =>
            handleFieldChange(e, item.moneyInputName, sectionName)
          }
          onFrequencyChange={(e) =>
            handleFieldChange(e, item.frequencyName, sectionName)
          }
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
            formAction={`/api/remove-fields?sectionName=${sectionName}&id=${item.index}`}
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
