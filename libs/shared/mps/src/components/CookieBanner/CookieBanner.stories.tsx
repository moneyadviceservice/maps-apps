import { StoryFn } from '@storybook/nextjs';

import { CookieBanner, CookieBannerProps, createCookieBannerConfig } from '.';

const StoryProps = {
  title: 'Components/MPS/CookieBanner',
  component: CookieBanner,
};

const defaultConfig = createCookieBannerConfig({
  siteName: 'Evidence Hub',
  cookiePolicyUrl: 'https://maps.org.uk/en/about-us/cookie-policy',
  privacyPolicyUrl: 'https://maps.org.uk/en/about-us/privacy-notice',
});

const welshConfig = createCookieBannerConfig({
  siteName: 'Evidence Hub',
  cookiePolicyUrl: {
    en: 'https://maps.org.uk/en/about-us/cookie-policy',
    cy: 'https://maps.org.uk/cy/about-us/cookie-policy',
  },
  privacyPolicyUrl: {
    en: 'https://maps.org.uk/en/about-us/privacy-notice',
    cy: 'https://maps.org.uk/cy/about-us/privacy-notice',
  },
});

const Template: StoryFn<CookieBannerProps> = (args) => (
  <CookieBanner {...args} />
);

export const Default = Template.bind({});
Default.args = {
  config: defaultConfig,
};

export const ComponentDefaults = Template.bind({});
ComponentDefaults.args = {};

export const Welsh = Template.bind({});
Welsh.args = {
  config: welshConfig,
};
Welsh.parameters = {
  nextjs: {
    router: {
      query: { language: 'cy' },
      asPath: '/cy',
    },
  },
};

export default StoryProps;
