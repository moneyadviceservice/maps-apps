/* eslint-disable no-multi-str */
export const defaultCspHeader = {
  'default-src': "'self'",

  'script-src': [
    "'self'",

    // Civic / internal
    '*.civiccomputing.com',
    '*.cdn.civiccomputing.com',

    // Google & ads
    '*.google.com',
    '*.google.co.uk',
    '*.googletagmanager.com',
    '*.google-analytics.com',
    '*.analytics.google.com',
    '*.doubleclick.net',
    '*.g.doubleclick.net',
    '*.googleadservices.com',
    '*.gstatic.com',

    // Microsoft / Bing
    '*.bing.com',
    '*.bing.net',
    '*.clarity.ms',

    // Adobe / analytics
    '*.adobedtm.com',
    '*.demdex.net',
    '*.everesttech.net',
    '*.omtrdc.net',
    '*.adalyser.com',
    '*.optimizely.com',

    // Owned
    '*.moneyhelper.org.uk',
    '*.pensionsadvisoryservice.org.uk',

    // Social / marketing
    '*.linkedin.com',
    '*.licdn.com',
    '*.ads-twitter.com',
    'connect.facebook.net',

    // Hosting / CDNs
    '*.netlify.app',
    'cdn.jsdelivr.net',
    'static.cloudflareinsights.com',

    // Monitoring
    '*.nr-data.net',
    'js-agent.newrelic.com',

    // Azure / Power Apps
    '*.powerappsportals.com',
    'masassets.blob.core.windows.net',
    'insitez.blob.core.windows.net',

    // Other vendors
    '*.informizely.com',
    '*.adsymptotic.com',
    '*.bugcrowd.com',
    'assets.bugcrowdusercontent.com',

    // Glassbox
    'cdn.gbqofs.com',
    'c1001.report.gbss.io',
    'c2001.report.gbss.io',
    'report.c1101.gbqofs.io',
    'report.c2101.gbqofs.io',

    // YouTube
    'www.youtube.com',
  ].join(' '),

  'style-src': [
    "'self'",
    "'unsafe-inline'",
    '*.civiccomputing.com',
    '*.clarity.ms',
    '*.bing.com',
    'cdn.jsdelivr.net',
    '*.powerappsportals.com',
    'masassets.blob.core.windows.net',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.fingodev.co.uk',
    'www.fingo.co.uk',
    '*.pensionsadvisoryservice.org.uk',
  ].join(' '),

  'img-src': [
    "'self'",
    '*.google.com',
    '*.google.co.uk',
    '*.google-analytics.com',
    '*.googletagmanager.com',
    '*.bing.com',
    '*.clarity.ms',
    '*.doubleclick.net',

    // Twitter / Social Media
    '*.twitter.com',
    't.co',
    '*.facebook.com',
    '*.facebook.net',
    '*.linkedin.com',
    '*.ads.linkedin.com',
    '*.youtube.com',

    // Adobe / analytics
    '*.demdex.net',
    '*.everesttech.net',
    '*.adobecqms.net',

    // Hosting / misc
    'maps-uk.sc.omtrdc.net',
    '*.omtrdc.net',
    'masassets.blob.core.windows.net',
    '*.moneyhelper.org.uk',
    '*.bugcrowd.com',
    'assets.bugcrowdusercontent.com',
    '*.glassboxdigital.com',
    '*.glassboxdigital.io',
    '*.powerappsportals.com',
    '*.fingodev.co.uk',
    '*.adalyser.com',
  ].join(' '),

  'connect-src': [
    "'self'",

    // Google / ads / analytics
    '*.google.com',
    '*.google.co.uk',
    '*.google-analytics.com',
    '*.analytics.google.com',
    '*.doubleclick.net',
    'pagead2.googlesyndication.com',

    // Adobe / analytics
    '*.adobedtm.com',
    '*.adobecqms.net',
    '*.demdex.net',
    '*.everesttech.net',
    '*.omtrdc.net',
    'maps-uk.sc.omtrdc.net',
    'moneypensions.tt.omtrdc.net',

    // Microsoft / Bing
    '*.bing.com',
    '*.bing.net',
    '*.clarity.ms',

    // Social
    '*.twitter.com',
    't.co',
    '*.linkedin.com',
    '*.facebook.com',
    'cdn.linkedin.oribi.io',

    // Azure / PureCloud
    'apps.euw2.pure.cloud',
    'api.euw2.pure.cloud',
    'api-cdn.euw2.pure.cloud',
    'wss://webmessaging.euw2.pure.cloud',
    '*.azure-api.net',

    // Hosting / misc
    '*.moneyhelper.org.uk',
    '*.civiccomputing.com',
    'masassets.blob.core.windows.net',
    '*.bugcrowd.com',
    'assets.bugcrowdusercontent.com',
    'wss://webchat.pensionsadvisoryservice.org.uk:8089',
    'webchat.pensionsadvisoryservice.org.uk:8089',

    // Others
    '*.informizely.com',
    '*.gbqofs.io',
    '*.gbqofs.com',
    '*.nsvcs.net',
    'c1001.report.gbss.io',
    'c2001.report.gbss.io',
    'report.c1101.gbqofs.io',
    'report.c2101.gbqofs.io',
  ].join(' '),

  'frame-src': [
    "'self'",
    '*.netlify.app',
    '*.netlify.com',
    '*.moneyhelper.org.uk',
    '*.demdex.net',
    'www.google.com',
    'www.youtube.com',
    'www.facebook.com',
    'forms.office.com',
    '*.powerappsportals.com',
    'apps.euw2.pure.cloud',
    '*.doubleclick.net',
    'assets.bugcrowdusercontent.com',
    'www.googletagmanager.com',
    'benefits.inbest.ai',
    'www.pensionwise.gov.uk',
    'partner-tools.moneyadviceservice.org.uk',
    '*.fls.doubleclick.net',
  ].join(' '),

  'font-src': ["'self'", 'fonts.gstatic.com'].join(' '),

  'object-src': "'none'",
  'base-uri': "'self'",
  'frame-ancestors': "'none'",

  'form-action': [
    "'self'",
    '*.find-your-pensions.service.gov.uk',
    '*.netlify.app',
    '*.netlify.com',
    '*.moneyhelper.org.uk',
    '*.powerappsportals.com',
    '*.pensionsdashboards.org.uk',
    'www.facebook.com',
  ].join(' '),
};
