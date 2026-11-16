import FalseIcon from '@maps-react/common/assets/images/close-red.svg';
import Tick from '@maps-react/common/assets/images/tick-green.svg';

export type AccountCheckboxField = {
  label: string;
  checked: boolean;
};

export type AccountCheckboxProps = {
  title: string;
  fields: AccountCheckboxField[];
};

const AccountCheckboxes = ({ title, fields }: AccountCheckboxProps) => {
  return (
    <div>
      <div className="mb-4 text-[19px] font-bold text-gray-800">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4">
        {fields.map((field, i) => (
          <div key={i} className="flex items-center space-x-2 text-gray-800">
            {field.checked ? (
              <div className="text-gray-800">
                <Tick style={{ width: 24, height: 24 }} />
              </div>
            ) : (
              <div className="text-gray-800">
                <FalseIcon />
              </div>
            )}
            <div>{field.label}</div>
            {field.checked ? (
              <div className="sr-only">&nbsp;(checked)</div>
            ) : (
              <div className="sr-only">&nbsp;(not checked)</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountCheckboxes;
