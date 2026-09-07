import { ReactNode, useMemo } from 'react';

import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

import { Decorator, StoryFn } from '@storybook/nextjs';
import { getRouter } from '@storybook/nextjs/router.mock';

import { SideNavigation, SideNavigationProps } from '.';
import { mockSideNavigation } from './sideNavigationMocks';

const RouteProvider = ({
  asPath,
  children,
}: {
  asPath: string;
  children: ReactNode;
}) => {
  const router = useMemo(() => ({ ...getRouter(), asPath }), [asPath]);

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};

const withRoute =
  (asPath: string): Decorator =>
  (Story) =>
    (
      <RouteProvider asPath={asPath}>
        <Story />
      </RouteProvider>
    );

const StoryProps = {
  title: 'Components/MPS/SideNavigation',
  component: SideNavigation,
  argTypes: {
    lang: {
      control: 'radio',
      options: ['en', 'cy'],
      description: 'Language prefix applied to every navigation link.',
    },
    navigation: {
      control: 'object',
      description:
        'Navigation authored in AEM. Items without a title or link are omitted, and the component renders nothing when this is null.',
    },
  },
};

const Template: StoryFn<SideNavigationProps> = (args) => (
  <div className="max-w-xs">
    <SideNavigation {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  lang: 'en',
  navigation: mockSideNavigation,
};
Default.decorators = [withRoute('/en/framework/other-framework-page')];

export const PathwayDetailPage = Template.bind({});
PathwayDetailPage.args = {
  lang: 'en',
  navigation: mockSideNavigation,
};
PathwayDetailPage.decorators = [
  withRoute('/en/learning-pathway/getting-started'),
];

export const LandingPage = Template.bind({});
LandingPage.args = {
  lang: 'en',
  navigation: mockSideNavigation,
};
LandingPage.decorators = [withRoute('/en')];

export const PartiallyAuthored = Template.bind({});
PartiallyAuthored.args = {
  lang: 'en',
  navigation: {
    ...mockSideNavigation,
    links: [
      mockSideNavigation.links[0],
      { title: '', link: '' },
      mockSideNavigation.links[2],
    ],
  },
};
PartiallyAuthored.decorators = [
  withRoute('/en/framework/other-framework-page'),
];

export default StoryProps;
