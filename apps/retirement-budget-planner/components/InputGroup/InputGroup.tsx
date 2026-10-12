import { FREQUENCY_OPTIONS } from 'lib/constants/pageConstants';
import { DataProps, RetirementGroupFieldType } from 'lib/types/page.type';
import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import MoneyInputFrequencyGroup from '@maps-react/pension-tools/components/MoneyInputFrequencyGroup';

type Props = {
  item: RetirementGroupFieldType;
  data: DataProps;
  isDynamic: boolean;
  className?: string;
  itemIndex: number;
  onLabelChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onFrequencyChange: React.ChangeEventHandler<HTMLSelectElement>;
  onElementFocusOut: React.FocusEventHandler<
    HTMLInputElement | HTMLSelectElement
  >;
};

const getLabelInputValue = (options: {
  item: RetirementGroupFieldType;
  data: DataProps;
}) => {
  const { item, data } = options;

  if (!item.inputLabelName) return '';
  return data[item.inputLabelName] ?? '';
};

export const InputGroup = ({
  item,
  data,
  isDynamic,
  className,
  itemIndex,
  onLabelChange,
  onInputChange,
  onFrequencyChange,
  onElementFocusOut,
}: Props) => {
  const { t } = useTranslation();

  const labelText = isDynamic
    ? `${item.labelText} ${itemIndex + 1}`
    : item.labelText;

  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <div className="max-w-[28rem]">
        <MoneyInputFrequencyGroup
          testId={`${item.moneyInputName}Id`}
          moneyInputname={item.moneyInputName}
          moneyInputLabelText={item.moneyInputLabelText}
          moneyInputValue={data[item.moneyInputName] || '0'}
          frequencySelectName={item.frequencyName}
          frequencySelectLabelText={item.frequencySelectLabelText}
          frequencySelectDefaultValue={item.defaultFrequency}
          frequencySelectOptions={FREQUENCY_OPTIONS(t)}
          frequencySelectValue={
            data[item.frequencyName] ?? item.defaultFrequency
          }
          labelText={labelText}
          hideLabel={item.hideLabel}
          labelInputName={item.inputLabelName}
          labelInputLabelText={item.labelInputLabelText}
          labelInputValue={getLabelInputValue({ item, data })}
          labelPlaceholder={item.labelPlaceholder}
          onLabelInputChange={onLabelChange}
          onMoneyInputChange={onInputChange}
          onfrequencySelectChange={onFrequencyChange}
          onValueUpdate={onElementFocusOut}
          ariaLabelSuffix={t('income.poundAria')}
        />
      </div>
      {item.moreInfo && (
        <ExpandableSection
          type="nested"
          title={t('moreInformationToggle')}
          variant="hyperlink"
          className="w-full"
        >
          {item.infoType === 'text' ? (
            <p>{item.moreInfo}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: item.moreInfo }} />
          )}
        </ExpandableSection>
      )}
    </div>
  );
};
