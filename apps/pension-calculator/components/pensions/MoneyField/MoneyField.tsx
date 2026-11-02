import { Errors } from '@maps-react/common/components/Errors';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';

export const MoneyField = ({
  id,
  label,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) => (
  <Errors errors={error ? [error] : []}>
    <label htmlFor={id} className="mb-2 block text-xl">
      {label}
    </label>
    {error && <p className="text-red-700">{error}</p>}
    <MoneyInput
      id={id}
      name={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-invalid={!!error}
      containerClassName="w-full max-w-[412px]"
    />
  </Errors>
);
