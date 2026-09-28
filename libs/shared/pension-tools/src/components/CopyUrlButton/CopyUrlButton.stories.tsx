import { StoryFn } from '@storybook/nextjs';

import { CopyUrlButton, type CopyUrlButtonProps } from '.';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/CopyUrlButton',
  component: CopyUrlButton,
};

const Template: StoryFn<CopyUrlButtonProps> = (args) => (
  <CopyUrlButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: 'Copy URL',
};

/**
 * Set custom labels for the default and confirmation states
 *
 * e.g. `Copy link to your results` and `Results link copied!`
 */
export const CustomLabels = Template.bind({});
CustomLabels.args = {
  label: 'Copy link to your results',
  labelConfirmation: 'Results link copied!',
};

/**
 * Set a custom delay for the confirmation label to reset
 *
 * e.g. `500`ms (0.5 seconds) instead of the default `3000`ms (3 seconds)
 */
export const CustomResetDelay = Template.bind({});
CustomResetDelay.args = {
  label: 'Copy URL',
  labelResetDelay: 500,
};

/**
 * Copy a custom URL instead of the current page URL
 *
 * e.g. `https://moneyhelper.org.uk` instead of `window.location.href`
 */
export const CustomUrl = Template.bind({});
CustomUrl.args = {
  label: 'Copy URL',
  url: 'https://moneyhelper.org.uk',
};

/**
 * Use a different button variant style
 *
 * e.g. `secondary` instead of `primary`
 */
export const CustomButtonVariant = Template.bind({});
CustomButtonVariant.args = {
  label: 'Copy URL',
  variant: 'secondary',
};

export default StoryProps;
