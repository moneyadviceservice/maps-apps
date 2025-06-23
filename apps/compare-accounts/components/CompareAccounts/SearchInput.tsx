import { twMerge } from 'tailwind-merge';

interface SearchInputProps {
  id: string;
  name: string;
  value?: string;
  defaultValue?: string;
  className?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchInput = ({
  id,
  name,
  value,
  defaultValue,
  className,
  onChange,
}: SearchInputProps) => {
  return (
    <input
      id={id}
      name={name}
      type="search"
      className={twMerge(
        'border',
        'border-gray-400',
        'rounded',
        'py-1',
        'px-2',
        'focus:shadow-select-focus',
        'focus:outline-0',
        'focus:border-purple-700',
        'tool-field',
        className,
      )}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
    />
  );
};

export default SearchInput;
