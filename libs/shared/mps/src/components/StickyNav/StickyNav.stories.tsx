import { StoryFn } from '@storybook/nextjs';

import { StickyNav, StickyNavProps } from '.';
import { mockSideNavigation } from '../SideNavigation/sideNavigationMocks';

const StoryProps = {
  title: 'Components/MPS/StickyNav',
  component: StickyNav,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  argTypes: {
    lang: {
      control: 'radio',
      options: ['en', 'cy'],
      description: 'Language prefix applied to every navigation link.',
    },
    navigation: {
      control: 'object',
      description: 'Navigation title and links authored in AEM.',
    },
    navSections: {
      control: 'object',
      description: 'Additional routes associated with a navigation item.',
    },
    label: {
      control: 'text',
      description: 'Label shown on the sticky navigation banner.',
    },
    closeLabel: {
      control: 'text',
      description: 'Label shown beside the close icon when expanded.',
    },
  },
};

const Template: StoryFn<StickyNavProps> = (args) => (
  <div className="relative min-h-[400px] bg-gray-100 p-4" data-sticky-nav-story>
    <style>{`
      [data-sticky-nav-story] [data-testid='sticky-nav'] {
        display: block !important;
        position: absolute;
      }
    `}</style>
    <StickyNav {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  lang: 'en',
  navigation: mockSideNavigation,
  label: 'Explore this topic',
  closeLabel: 'Close',
};
Default.parameters = {
  nextjs: {
    router: {
      asPath: '/en/framework/other-framework-page',
    },
  },
};

export const CurrentPage = Template.bind({});
CurrentPage.args = {
  ...Default.args,
  navSections: {
    '/learning-pathway-intro': ['/learning-pathway'],
  },
};
CurrentPage.parameters = {
  nextjs: {
    router: {
      asPath: '/en/learning-pathway/getting-started',
    },
  },
};

export default StoryProps;
