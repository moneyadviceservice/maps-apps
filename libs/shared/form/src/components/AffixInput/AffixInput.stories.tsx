import { StoryFn } from '@storybook/nextjs';

import { Errors } from '@maps-react/common/components/Errors';

import { AffixInput, AffixInputProps } from './AffixInput';

const StoryProps = {
  title: 'Components/TOOLS/AffixInput',
  component: AffixInput,
};

const Template: StoryFn<AffixInputProps> = (args) => <AffixInput {...args} />;
const BoundedTemplate: StoryFn<AffixInputProps> = (args) => (
  <div className="max-w-[660px]">
    <AffixInput {...args} />
  </div>
);

const externalLabel = 'What do you earn each year before tax?';
const externalHint = 'Enter your annual salary.';
const externalError =
  'Please enter your annual income or salary before tax. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make repayments.';

export const Money = Template.bind({});
Money.args = {
  id: 'money-input',
  name: 'money',
  variant: 'money',
  defaultValue: '1250.00',
};

export const Percent = Template.bind({});
Percent.args = {
  id: 'percent-input',
  name: 'percent',
  variant: 'percent',
  defaultValue: '5.0',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  ...Money.args,
  label: externalLabel,
  labelClassName: 'mb-1',
};

export const WithHint = Template.bind({});
WithHint.args = {
  ...WithLabel.args,
  hint: externalHint,
  hintClassName: 'mb-2 text-lg',
};

export const WithError = Template.bind({});
WithError.args = {
  ...WithLabel.args,
  error: externalError,
};

export const WithErrorAndHint = Template.bind({});
WithErrorAndHint.args = {
  ...WithError.args,
  ...WithHint.args,
};

export const WithErrorWrapper = BoundedTemplate.bind({});
WithErrorWrapper.args = {
  ...WithErrorAndHint.args,
  id: 'gross-income',
  name: 'gross-income',
  addon: 'per year',
  inputClassName: 'w-full',
  hasErrorWrapper: true,
};

export const WithExternalError: StoryFn<AffixInputProps> = () => {
  return (
    <div className="max-w-[660px]">
      <Errors errors={[externalError]}>
        <label className="block text-2xl mb-1" htmlFor="gross-income">
          {externalLabel}
        </label>
        <span
          id="gross-income-description"
          className="block text-lg text-gray-650 mb-2"
        >
          {externalHint}
        </span>
        <p id="gross-income-error" className="mb-2 text-red-700">
          {externalError}
        </p>
        <AffixInput
          variant="money"
          id="gross-income"
          name="gross-income"
          addon="per year"
          inputClassName="w-full"
          hasError
          aria-describedby="gross-income-error gross-income-description"
        />
      </Errors>
    </div>
  );
};

export const MoneyWithAddon = Template.bind({});
MoneyWithAddon.args = {
  ...Money.args,
  addon: 'per month',
};

export const MoneyWithAddonAndErrorWrapper = BoundedTemplate.bind({});
MoneyWithAddonAndErrorWrapper.args = {
  ...WithErrorAndHint.args,
  ...MoneyWithAddon.args,
  inputClassName: 'w-full',
  hasErrorWrapper: true,
};

export default StoryProps;
