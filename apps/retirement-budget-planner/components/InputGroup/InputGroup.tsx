import { FREQUENCY_OPTIONS } from 'lib/constants/pageConstants';
import { DataProps, RetirementGroupFieldType } from 'lib/types/page.type';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import MoneyInputFrequencyGroup from '@maps-react/pension-tools/components/MoneyInputFrequencyGroup';

type Props = {
  item: RetirementGroupFieldType;
  data: DataProps;
  onLabelChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onFrequencyChange: React.ChangeEventHandler<HTMLSelectElement>;
};

export const InputGroup = ({
  item,
  data,
  onLabelChange,
  onInputChange,
  onFrequencyChange,
}: Props) => {
  return (
    <div className="space-y-2">
      <MoneyInputFrequencyGroup
        testId={`${item.moneyInputName}Id`}
        moneyInputname={item.moneyInputName}
        moneyInputValue={data[item.moneyInputName] || '0'}
        frequencySelectName={item.frequencyName}
        frequencySelectDefaultValue={'month'}
        frequencySelectOptions={FREQUENCY_OPTIONS}
        frequencySelectValue={data[item.frequencyName] || 'month'}
        labelText={item.labelText}
        labelInputName={item.inputLabelName}
        labelInputValue={
          item.inputLabelName
            ? data[item.inputLabelName]
              ? data[item.inputLabelName]
              : ''
            : ''
        }
        onLabelInputChange={onLabelChange}
        onMoneyInputChange={onInputChange}
        onfrequencySelectChange={onFrequencyChange}
      />
      {item.moreInfo && (
        <ExpandableSection
          type="nested"
          title={'More information'}
          variant="hyperlink"
        >
          {item.moreInfo}
        </ExpandableSection>
      )}
    </div>
  );
};
