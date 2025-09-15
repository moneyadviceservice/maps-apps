import { VisibleSection } from 'components/VisibleSection';
import { FREQUENCY_OPTIONS } from 'lib/constants/pageConstants';
import {
  DataProps,
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';

import { Button } from '@maps-react/common/components/Button';
import MoneyInputFrequencyGroup from '@maps-react/pension-tools/components/MoneyInputFrequencyGroup';

type Props = {
  sectionItems: RetirementFieldTypes[];
  sectionIndex: number;
  data: DataProps;
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
        <MoneyInputFrequencyGroup
          testId={`${item.moneyInputName}Id`}
          moneyInputname={item.moneyInputName}
          moneyInputValue={data[item.moneyInputName] || '0'}
          frequencySelectName={item.frequencyName}
          frequencySelectDefaultValue={'month'}
          frequencySelectOptions={FREQUENCY_OPTIONS}
          frequencySelectValue={data[item.frequencyName] || 'month'}
          labelInputName={item.inputLabelName}
          labelInputValue={
            item.inputLabelName
              ? data[item.inputLabelName]
                ? data[item.inputLabelName]
                : ''
              : ''
          }
          onLabelInputChange={(e) =>
            handleFieldChange(e, item.inputLabelName || '')
          }
          onMoneyInputChange={(e) => handleFieldChange(e, item.moneyInputName)}
          onfrequencySelectChange={(e) =>
            handleFieldChange(e, item.frequencyName)
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
