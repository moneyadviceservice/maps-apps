import { createCookieBannerConfig } from '@maps-react/mps/components/CookieBanner';

export const COOKIE_POLICY_URL =
  'https://maps.org.uk/en/about-us/cookie-policy';
export const PRIVACY_POLICY_URL =
  'https://maps.org.uk/en/about-us/privacy-notice';

export const config = createCookieBannerConfig({
  siteName: 'MaPS',
  cookiePolicyUrl: COOKIE_POLICY_URL,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
});
