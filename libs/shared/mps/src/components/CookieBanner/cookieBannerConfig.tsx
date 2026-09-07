import { Link } from '@maps-react/common/components/Link';
import { TranslationGroupString } from '@maps-react/form/types';
import { TranslationGroup } from '@maps-react/hooks/types';

export const COOKIE_PREFERENCE_HASH = '#cookie-preferences-banner';

type CookieBannerOptionalCookieContent = {
  label: TranslationGroup;
  description: TranslationGroup;
};

export type CookieBannerText = {
  title: TranslationGroup;
  intro: TranslationGroup;
  necessaryTitle: TranslationGroup;
  necessaryDescription: TranslationGroup;
  optionalCookies: {
    analytics: CookieBannerOptionalCookieContent;
    marketing: CookieBannerOptionalCookieContent;
  };
  reject: TranslationGroup;
  closeLabel: TranslationGroup;
  accept: TranslationGroup;
};

export type CookieBannerConfig = {
  siteName: string;
  cookiePolicyUrl: TranslationGroupString;
  privacyPolicyUrl: TranslationGroupString;
  text: CookieBannerText;
};

type CookieBannerUrlInput = string | TranslationGroupString;

export type CreateCookieBannerConfigInput = {
  siteName: string;
  cookiePolicyUrl: CookieBannerUrlInput;
  privacyPolicyUrl: CookieBannerUrlInput;
};

const normalizeLocaleUrl = (
  url: CookieBannerUrlInput,
): TranslationGroupString => {
  if (typeof url === 'string') {
    return { en: url, cy: url };
  }

  return {
    en: url.en,
    cy: url.cy,
  };
};

const buildDefaultText = ({
  siteName,
  cookiePolicyUrl,
  privacyPolicyUrl,
}: {
  siteName: string;
  cookiePolicyUrl: TranslationGroupString;
  privacyPolicyUrl: TranslationGroupString;
}): CookieBannerText => ({
  title: {
    en: 'Cookies on maps.org.uk',
    cy: 'Cwcis ar maps.org.uk',
  },
  intro: {
    en: (
      <>
        Cookies are files saved on your phone, tablet or computer when you visit
        a website. We use cookies to store information about how you use{' '}
        {siteName}, such as the pages you visit. For more information visit our{' '}
        <Link href={cookiePolicyUrl.en}>Cookie Policy</Link>
        {' and '}
        <Link href={privacyPolicyUrl.en}>Privacy Policy</Link>.
      </>
    ),
    cy: (
      <>
        Mae cwcis yn ffeiliau a arbedir ar eich ffôn, llechen neu gyfrifiadur
        pan fyddwch yn ymweld â gwefan. Rydym yn defnyddio cwcis i storio
        gwybodaeth am sut rydych yn defnyddio {siteName}, megis y tudalennau
        rydych chi&apos;n ymweld â nhw. I gael mwy o wybodaeth, ewch i&apos;n{' '}
        <Link href={cookiePolicyUrl.cy}>Polisi Cwcis</Link>
        {" a'n "}
        <Link href={privacyPolicyUrl.cy}>Polisi Preifatrwydd</Link>.
      </>
    ),
  },
  necessaryTitle: {
    en: 'Necessary Cookies',
    cy: 'Cwcis sydd eu hangen',
  },
  necessaryDescription: {
    en: 'Some cookies are essential for the site to function correctly, such as those remembering your progress through our tools, or using our webchat service.',
    cy: "Mae rhai cwcis yn hanfodol er mwyn i'r wefan weithredu'n gywir, fel y rhai sy'n cofio'ch datblygiad trwy ein teclynnau, neu ddefnyddio ein gwasanaeth gwe-sgwrs.",
  },
  optionalCookies: {
    analytics: {
      label: {
        en: 'Analytics Cookies',
        cy: 'Cwcis dadansoddi',
      },
      description: {
        en: 'These cookies allow us to collect anonymised data about how our website is being used, helping us to make improvements to the services we provide to you.',
        cy: "Mae'r cwcis hyn yn caniatáu i ni gasglu data dienw am sut mae ein gwefan yn cael ei defnyddio, gan ein helpu i wneud gwelliannau i'r gwasanaethau rydym yn eu darparu i chi.",
      },
    },
    marketing: {
      label: {
        en: 'Marketing Cookies',
        cy: 'Cwcis marchnata',
      },
      description: {
        en: 'These cookies allow us to understand which campaigns work best in increasing awareness of our services among those who need them.',
        cy: "Mae'r cwcis hyn yn caniatáu i ni ddeall pa ymgyrchoedd sy'n gweithio orau wrth gynyddu ymwybyddiaeth o'n gwasanaethau ymhlith y rhai sydd eu hangen.",
      },
    },
  },
  reject: {
    en: 'Reject additional cookies',
    cy: 'Gwrthod cwcis ychwanegol',
  },
  closeLabel: {
    en: 'Save preferences',
    cy: 'Arbed dewisiadau',
  },
  accept: {
    en: 'Accept all cookies',
    cy: 'Derbyn pob cwci',
  },
});

export const createCookieBannerConfig = ({
  siteName,
  cookiePolicyUrl,
  privacyPolicyUrl,
}: CreateCookieBannerConfigInput): CookieBannerConfig => {
  const normalizedCookiePolicyUrl = normalizeLocaleUrl(cookiePolicyUrl);
  const normalizedPrivacyPolicyUrl = normalizeLocaleUrl(privacyPolicyUrl);

  return {
    siteName,
    cookiePolicyUrl: normalizedCookiePolicyUrl,
    privacyPolicyUrl: normalizedPrivacyPolicyUrl,
    text: buildDefaultText({
      siteName,
      cookiePolicyUrl: normalizedCookiePolicyUrl,
      privacyPolicyUrl: normalizedPrivacyPolicyUrl,
    }),
  };
};

export const DEFAULT_COOKIE_BANNER_CONFIG = createCookieBannerConfig({
  siteName: 'MaPS',
  cookiePolicyUrl: 'https://maps.org.uk/en/about-us/cookie-policy',
  privacyPolicyUrl: 'https://maps.org.uk/en/about-us/privacy-notice',
});
