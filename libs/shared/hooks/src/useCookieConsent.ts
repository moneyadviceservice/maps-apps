import { useLanguage } from './useLanguage';

type CivicConsent = 'granted' | 'denied';

type CivicCookieConsentUpdateModel = {
  analytics_storage?: CivicConsent;
  ad_storage?: CivicConsent;
};

declare global {
  interface Window {
    CookieControl: {
      load: (config: unknown) => void;
      open: () => void;
    };
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

export const useCookieConsent = () => {
  const lang = useLanguage();

  const initCookieConsent = () => window.CookieControl?.load(config);

  const config = {
    apiKey: process.env.NEXT_PUBLIC_CIVIC_COOKIE_API_KEY,
    product: 'PRO_MULTISITE',
    mode: 'GDPR',
    consentCookieExpiry: '360',
    logConsent: true,
    sameSiteCookie: false,
    initialState: 'top',
    rejectButton: true,
    layout: 'slideout',
    position: 'LEFT',
    setInnerHTML: true,
    wrapInnerHTML: true,
    notifyDismissButton: false,
    closeOnGlobalChange: true,
    closeStyle: 'button',
    subDomains: true,
    locale: lang,

    // WELSH
    locales: [
      {
        locale: 'cy',
        text: {
          accept: 'Derbyn cwcis ychwanegol',
          reject: 'Gwrthod cwcis ychwanegol',
          settings: 'Gosod dewisiadau',
          on: 'Ymlaen',
          off: 'I ffwrdd',
          notifyTitle: '<h2>Cwcis ar HelpwrArian</h2>',
          notifyDescription:
            "<p>Rydym yn defnyddio rhai cwcis hanfodol i wneud i'r wefan hon weithio.</p><p>Hoffem osod <a href='/en/about-us/cookie-policy'>cwcis ychwanegol</a> i ddeall sut rydych yn defnyddio HelpwrArian, cofio eich gosodiadau a gwella ein gwasanaethau.<p></p><p><img width='190' height='64' src='/footer/gov-cy.svg' /></p>",
          title: '<h2>Cwcis ar HelpwrArian</h2>',
          acceptSettings: 'Derbyn pob cwci',
          closeLabel: 'Arbed dewisiadau',
          intro:
            '<p>Mae cwcis yn ffeiliau a arbedir ar eich ffôn, llechen neu gyfrifiadur pan ymwelwch â gwefan.</p><p>Rydym yn defnyddio cwcis i storio gwybodaeth am sut rydych yn defnyddio HelpwrArian, fel y tudalennau rydych chi\'n ymweld â nhw.</p><p>I gael mwy o wybodaeth, ymwelwch â\'n <a href="https://www.moneyhelper.org.uk/cy/about-us/cookie-policy">Polisi Cwcis</a> a\'n <a href="https://www.moneyhelper.org.uk/cy/about-us/privacy-notice">Polisi Preifatrwydd</a>.</p>',
          necessaryTitle: '<h2>Cwcis sydd eu hangen</h2>',
          necessaryDescription:
            "<p>Mae rhai cwcis yn hanfodol er mwyn i'r wefan weithredu'n gywir, fel y rhai sy'n cofio'ch datbliygad trwy ein teclynnau, neu ddefnyddio ein gwasanaeth gwe-sgwrs.</p>",
        },

        optionalCookies: [
          {
            name: 'analytics',
            label: '<h3>Cwcis dadansoddi</h3>',
            description:
              "<p>Mae'r cwcis hyn yn caniatáu i ni gasglu data dienw am sut mae ein gwefan yn cael ei defnyddio, gan ein helpu i wneud gwelliannau i'r gwasanaethau rydym yn eu darparu i chi.</p>",
          },
          {
            name: 'marketing',
            label: '<h3>Cwcis marchnata</h3>',
            description:
              "<p>Mae'r cwcis hyn yn caniatáu i ni ddeall pa ymgyrchoedd sy'n gweithio orau wrth gynyddu ymwybyddiaeth o'n gwasanaethau ymhlith y rhai sydd eu hangen.</p>",
          },
        ],
      },
    ],

    text: {
      accept: 'Accept additional cookies',
      reject: 'Reject additional cookies',
      settings: 'Set preferences',
      notifyTitle: '<h2>Cookies on MoneyHelper</h2>',
      notifyDescription:
        "<p>We use some essential cookies to make this website work.</p><p>We'd like to set <a href='https://www.moneyhelper.org.uk/en/about-us/cookie-policy'>additional cookies</a> to understand how you use MoneyHelper, remember your settings and improve our services.</p><p></p><p><img width='190' height='64' src='/footer/gov.png' /></p>",
      title: '<h2>Cookies on MoneyHelper</h2>',
      acceptSettings: 'Accept all cookies',
      closeLabel: 'Save preferences',
      intro:
        '<p>Cookies are files saved on your phone, tablet or computer when you visit a website.</p><p>We use cookies to store information about how you use MoneyHelper, such as the pages you visit.</p><p>For more information visit our <a href="https://www.moneyhelper.org.uk/en/about-us/cookie-policy">Cookie Policy</a> and <a href="https://www.moneyhelper.org.uk/en/about-us/privacy-notice">Privacy Policy</a>.</p>',
      necessaryTitle: '<h2>Necessary Cookies</h2>',
      necessaryDescription:
        '<p>Some cookies are essential for the site to function correctly, such as those remembering your progress through our tools, or using our webchat service.</p>',
    },

    branding: {
      fontSizeIntro: '16px',
      fontSize: '16px',
      fontFamily: "'Roobert', sans-serif",
      notifyBackgroundColor: '#FFF',
      backgroundColor: '#fff',
      toggleText: '#000',
      toggleBackground: '#F3F1F3',
      buttonIcon: null,
      buttonIconWidth: 120,
      buttonIconHeight: 120,
      removeIcon: true,
      removeAbout: true,
    },
    landmark: 'Cookie Preferences',

    necessaryCookies: [
      'JSESSIONID',
      'JSESSIONIDCORS',
      'abtest',
      '_ALGOLIA',
      'applicationgatewayaffinity',
      'applicationgatewayaffinityCORS',
      'dfqtmhApplicationGatewayAffinity',
      'dfqtmhApplicationGatewayAffinityCORS',
      'mas-overlay-hide',
      'tpas-overlay-hide',
      'pw-overlay-hide',
      'emergency_banner',
      'algoliasearch_id',
    ],

    optionalCookies: [
      {
        name: 'analytics',
        label: '<h3>Analytics Cookies</h3>',
        description:
          '<p>These cookies allow us to collect anonymised data about how our website is being used, helping us to make improvements to the services we provide to you.</p>',
        recommendedState: false,
        lawfulBasis: 'consent',
        cookies: [
          'AMCV_*',
          'AMCVS_*',
          '_ga',
          '_ga_*',
          '_gid',
          '_gat_*',
          '__utma',
          '__utmt',
          '__utmb',
          '__utmc',
          '__utmz',
          '__utmv',
          '_clsk',
          '_clck',
          'CLID',
          'MUID',
        ],

        onAccept: () =>
          updateConsent('civicConsent_anaAccept', {
            analytics_storage: 'granted',
          }),

        onRevoke: () =>
          updateConsent('civicConsent_anaReject', {
            analytics_storage: 'denied',
          }),
      },
      {
        name: 'marketing',
        label: '<h3>Marketing Cookies</h3>',
        description:
          '<p>These cookies allow us to understand which campaigns work best in increasing awareness of our services among those who need them.</p>',
        recommendedState: false,
        lawfulBasis: 'consent',
        cookies: [
          '_adal_ca',
          '_adal_cw',
          '_adal_id',
          '_adal_ses',
          'ev_sync_dd',
          '_dc_gtm_UA-4205932-25',
          'everest_g_v2',
          'fr',
          '_fbp',
          '_gcl_au',
          'MUID',
          '_uetvid',
          '_uetsid',
        ],
        onAccept: () =>
          updateConsent('civicConsent_mktAccept', { ad_storage: 'granted' }),

        onRevoke: () =>
          updateConsent('civicConsent_mktReject', { ad_storage: 'denied' }),
      },
    ],
  };

  const updateConsent = (
    event: string,
    consent: CivicCookieConsentUpdateModel,
  ) => {
    window.gtag && window.gtag('consent', 'update', consent);

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: event,
    });
  };

  return {
    initCookieConsent,
  };
};
