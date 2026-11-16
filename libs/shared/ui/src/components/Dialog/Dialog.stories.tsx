import { StoryFn } from '@storybook/nextjs';

import { Dialog } from '.';
import { H2 } from '../Heading';

const StoryProps = {
  title: 'Components/COMMON/Dialog',
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
      <H2 className="mb-6 text-4xl text-blue-700 md:text-5xl">
        This is some dialog content
      </H2>
      <p>This is some dialog content</p>
    </>
  </Dialog>
);

export const Default = Template;

export default StoryProps;
