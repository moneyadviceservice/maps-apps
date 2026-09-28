import { StoryFn } from '@storybook/react';

import pensionCalculatorImage from '../../assets/pension-calculator.svg?url';
import workplacePensionCalculatorImage from '../../assets/workplace-pension-calculator.svg?url';
import { OtherToolsToTry } from './OtherToolsToTry';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/OtherToolsToTry',
  component: OtherToolsToTry,
  argTypes: {
    level: {
      options: ['h2', 'h3'],
      description: 'Heading level for the title',
      defaultValue: 'h2',
    },
    variant: {
      options: ['primary', 'secondary'],
      description: 'Heading variant',
      defaultValue: 'secondary',
    },
  },
};

const Template: StoryFn<typeof OtherToolsToTry> = (args) => (
  <OtherToolsToTry {...args} />
);

export default StoryProps;

export const Default = Template.bind({});
Default.args = {
  content: {
    title: 'Other tools to try',
    toolCards: [
      {
        id: 1,
        href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-calculator',
        image: pensionCalculatorImage,
        title: 'Pension calculator',
        description:
          "Find out how much you might need to save for retirement and the income you're on track to get.",
      },
      {
        id: 2,
        href: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        image: workplacePensionCalculatorImage,
        title: 'Workplace pension calculator',
        description:
          "Check if you're on track to get the workplace pension you expect, and how much more you might need to save.",
      },
    ],
  },
  level: 'h2',
  variant: 'secondary',
};

export const WithH3Heading = Template.bind({});
WithH3Heading.args = {
  content: {
    title: 'Related tools',
    toolCards: [
      {
        id: 1,
        href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-calculator',
        image: pensionCalculatorImage,
        title: 'Pension calculator',
        description: 'Find out how much you might need to save for retirement.',
      },
      {
        id: 2,
        href: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        image: workplacePensionCalculatorImage,
        title: 'Workplace pension calculator',
        description:
          "Check if you're on track to get the workplace pension you expect, and how much more you might need to save.",
      },
    ],
  },
  level: 'h3',
  variant: 'secondary',
};

export const PrimaryVariant = Template.bind({});
PrimaryVariant.args = {
  content: {
    title: 'Explore more tools',
    toolCards: [
      {
        id: 1,
        href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-calculator',
        image: pensionCalculatorImage,
        title: 'Pension calculator',
        description:
          "Find out how much you might need to save for retirement and the income you're on track to get.",
      },
      {
        id: 2,
        href: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        image: workplacePensionCalculatorImage,
        title: 'Workplace pension calculator',
        description:
          "Check if you're on track to get the workplace pension you expect, and how much more you might need to save.",
      },
    ],
  },
  level: 'h2',
  variant: 'primary',
};
