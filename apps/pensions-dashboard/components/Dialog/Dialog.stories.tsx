import { StoryFn } from '@storybook/react';

import { H2 } from '@maps-react/common/components/Heading';

import { Dialog } from '.';

const StoryProps = {
  title: 'Components/MHPD/Dialog',
  component: Dialog,
};

const Template: StoryFn = () => (
  <Dialog
    accessibilityLabelClose="close"
    accessibilityLabelReset="reset"
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCloseClick={() => {}}
    isOpen
  >
    <>
      <H2 className="mb-6 text-4xl text-blue-800 md:text-5xl">
        This is some dialog content
      </H2>
      <p>This is some dialog content</p>
    </>
  </Dialog>
);

export const Default = Template;

export default StoryProps;
