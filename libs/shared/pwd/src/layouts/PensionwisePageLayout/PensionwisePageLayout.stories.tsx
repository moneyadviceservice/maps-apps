import { StoryFn } from '@storybook/react';

import { PensionwisePageLayout, PensionwisePageLayoutProps } from '.';
import mockSharedContent from './PensionwisePageLayout.mock.json';

const StoryProps = {
  title: 'Layouts/PWD/PensionwisePageLayout',
  component: PensionwisePageLayout,
};

const Template: StoryFn<PensionwisePageLayoutProps> = (args) => (
  <PensionwisePageLayout
    route={{ query: { test: 'something' }, app: 'some-app' }}
    sharedContent={mockSharedContent}
  >
    test content
  </PensionwisePageLayout>
);

export const Default = Template.bind({});
Default.args = {
  children: 'PensionwisePageLayout contents',
};

export default StoryProps;
