import { CookieConsentConfig } from '@maps-react/hooks/useCookieConsent';

export const config: CookieConsentConfig = {
  subDomains: false,
  tagManager: 'AA',
  rejectButton: false,
  necessaryCookies: [
    'mhpdSessionConfig',
    'beaconId',
    'codeVerifier',
    '_iz_sd_ss_',
    '_iz_uh_ps_',
    'iPlanetDirectoryPro',
    'amlbcookie',
    'route',
    'reentry',
    'OAUTH_REQUEST_ATTRIBUTES',
  ],
  text: {
    accept: 'Accept all cookies',
    settings: 'Learn more and set preferences',
    notifyTitle:
      "<h2 style='margin-top:20px'>Cookies on MoneyHelper Pensions Dashboard</h2>",
    notifyDescription:
      "<style>#ccc-notify .ccc-notify-buttons { display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 1px !important; } #ccc-notify .ccc-notify-button, #ccc-notify a { margin: 0 !important; align-self: flex-start !important; } #ccc-notify a { padding: 8px 0 !important; } #ccc-notify *:last-child { margin-left: 0 !important; padding-left: 0 !important; }</style><div style='margin-bottom: 20px; max-width: 650px;'><p>We use some essential cookies to make this website work.</p><p>We'd also like to use analytics cookies to understand how you use this site and help us improve it.</p><p><img width='190' height='64' src='/footer/gov.svg' alt='' aria-label='HM Government logo'/></p></div>",
    title: '<h2>Cookies on MoneyHelper Pensions Dashboard</h2>',
    acceptSettings: 'Accept all cookies',
    closeLabel: 'Save preferences',
    intro:
      '<p>Cookies are files saved on your phone, tablet or computer when you visit a website.</p><p>We use cookies to store information about how you use MoneyHelper, such as the pages you visit.</p><p>For more information visit our <a href="/en/dashboard-cookie-policy" target="_blank">Cookie policy</a> and <a href="/en/dashboard-privacy-notice" target="_blank">Privacy policy</a>.</p>',
    necessaryTitle: '<h2>Essential cookies</h2>',
    necessaryDescription:
      '<p>Some cookies are essential for the site to function correctly, such as those remembering your progress through our tools, or using our webchat service.</p>',
  },
  optionalCookies: [
    {
      name: 'analytics',
      label: '<h3>Analytics Cookies</h3>',
      description:
        '<p>These cookies allow us to collect anonymised data about how our website is being used, helping us improve our services.</p>',
      recommendedState: false,
      lawfulBasis: 'consent',
      cookies: [
        '_clck',
        '_clsk',
        'CLID',
        'ANONCHK',
        'MR',
        'MUID',
        'SM',
        '_ga',
        '_gid',
        '_ga_<container-id>',
        '_utma',
        '_gat_UA',
        '_cls_s',
        '_cls_v',
        'Bc',
        '_cls_cfgver',
        '_cls_e',
        '_cls_subs',
        'rto',
        's_ecid',
        's_cc',
        's_sq',
        's_vi',
        's_fid',
        's_ac',
        'mbox',
        'at_check',
      ],
    },
  ],
};
