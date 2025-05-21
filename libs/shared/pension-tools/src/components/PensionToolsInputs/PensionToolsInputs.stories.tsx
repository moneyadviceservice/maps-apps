import { StoryFn } from '@storybook/react';

import {
  mockerrors,
  mockQuestions,
} from '../PensionPotCalculator/mockTestData';
import {
  PensionToolsInputs,
  PensionToolsInputsProps,
} from './PensionToolsInputs';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/PensionToolsInputs',
  component: PensionToolsInputs,
};

const Template: StoryFn<PensionToolsInputsProps> = (args) => (
  <PensionToolsInputs {...args} />
);

export const Default = Template.bind({});
Default.args = {
  field: mockQuestions[0],
  errors: mockerrors,
  queryData: {
    pot: '1000',
    age: '30',
  },
};

export default StoryProps;
