import { InputGroup } from 'components/InputGroup';
import { DataProps, RetirementGroupFieldType } from 'lib/types/page.type';
import { saveDataToMemoryOnFocusOut } from 'lib/util/contentFilter';
import { twMerge } from 'tailwind-merge';
type EssentialOutgoingSectionProps = {
  item: RetirementGroupFieldType;
  data: DataProps;
  sectionName: string;
  tabName: string;
  sessionId: string | undefined;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string,
  ) => void;
};

export const EssentialOutgoingSection = ({
  item,
  data,
  sectionName,
  tabName,
  sessionId,
  handleChange,
}: EssentialOutgoingSectionProps) => {
  const handleFocusOut = async (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.preventDefault();
    await saveDataToMemoryOnFocusOut(e, sectionName, tabName, sessionId ?? '');
  };

  return (
    <div
      className={twMerge(
        'flex flex-col gap-6 font-normal',
        (!item.labelText || item.hideLabel) && 'pt-4',
      )}
      key={item.moneyInputName}
    >
      <InputGroup
        item={item}
        data={data}
        isDynamic={false}
        itemIndex={0}
        onLabelChange={(e) => handleChange(e, item.inputLabelName || '')}
        onInputChange={(e) => handleChange(e, item.moneyInputName)}
        onFrequencyChange={(e) => handleChange(e, item.frequencyName)}
        onElementFocusOut={handleFocusOut}
      />
    </div>
  );
};
