/* eslint-disable no-multi-str */
export const defaultCspHeader = {
  'default-src': "'self'",
  'script-src':
    "'self' *.civiccomputing.com *.cdn.civiccomputing.com *.clarity.ms *.bing.com *.bing.net *.adobedtm.com *.everesttech.net *.demdex.net *.omtrdc.net *.netlify.app *.moneyhelper.org.uk \
    *.linkedin.com *.licdn.com *.nr-data.net insitez.blob.core.windows.net masassets.blob.core.windows.net c0.adalyser.com *.informizely.com *.googleadservices.com *.g.doubleclick.net \
    *.doubleclick.net *.google-analytics.com www.googletagmanager.com www.google.co.uk/ads/ga-audiences *.analytics.google.com ampcid.google.com www.google.com apis.google.com/js/platform.js \
    static.cloudflareinsights.com/beacon.min.js js-agent.newrelic.com/nr-spa.1097a448-1.238.0.min.js js-agent.newrelic.com/nr-1210.min.js apps.euw2.pure.cloud api-cdn.euw2.pure.cloud \
    prod-webforms.powerappsportals.com www.gstatic.com smetrics.moneyhelper.org.uk starget.moneyhelper.org.uk *.pensionsadvisoryservice.org.uk *.ads-twitter.com \
    cdn.jsdelivr.net/npm/search-insights@2.17.3/dist/search-insights.min.js *.adsymptotic.com cdn.optimizely.com connect.facebook.net \
    www.youtube.com *.bugcrowd.com assets.bugcrowdusercontent.com ",
  'style-src':
    "'self' 'unsafe-inline' *.civiccomputing.com *.clarity.ms *.bing.com cdn.jsdelivr.net prod-webforms.powerappsportals.com *.pensionsadvisoryservice.org.uk masassets.blob.core.windows.net \
    www.fingodev.co.uk www.fingo.co.uk fonts.googleapis.com fonts.gstatic.com",
  'img-src':
    "'self' maps-uk.sc.omtrdc.net px.ads.linkedin.com t.co analytics.twitter.com www.google.co.uk smetrics.moneyhelper.org.uk starget.moneyhelper.org.uk prod-webforms.powerappsportals.com \
    *.clarity.ms *.google-analytics.com *.bing.com masassets.blob.core.windows.net *.facebook.net *.facebook.com *.linkedin.com *.google.com www.fingodev.co.uk \
    *.adalyser.com cm.everesttech.net *.demdex.net *.omtrdc.net *.googletagmanager.com img.youtube.com *.bugcrowd.com assets.bugcrowdusercontent.com \
    *.glassboxdigital.com *.glassboxdigital.io",
  'connect-src':
    "'self' *.demdex.net *.omtrdc.net www.google.co.uk/ads/ga-audiences wss://webmessaging.euw2.pure.cloud bat.bing.com *.google.com px.ads.linkedin.com api-cdn.euw2.pure.cloud \
    prodpowerpagesapi.azure-api.net *.clarity.ms *.moneyhelper.org.uk wss://webchat.pensionsadvisoryservice.org.uk:8089 *.informizely.com \
    *.doubleclick.net masassets.blob.core.windows.net webchat.pensionsadvisoryservice.org.uk:8089 api.euw2.pure.cloud/api/v2/webdeployments/deployments/b497eee2-89d2-48a1-9c36-5c7d7fbebcbb \
    api.euw2.pure.cloud/api/v2/webdeployments/deployments/f0f953c7-9a2a-4b99-bf3b-0a9e4dbc63f7 apps.euw2.pure.cloud api.euw2.pure.cloud/api/v2/webmessaging/messages *.civiccomputing.com \
    *.google-analytics.com *.analytics.google.com maps-uk.sc.omtrdc.net *.googletagmanager.com moneypensions.tt.omtrdc.net cdn.linkedin.oribi.io pagead2.googlesyndication.com *.bugcrowd.com \
    assets.bugcrowdusercontent.com",
  'frame-src':
    "'self' *.netlify.app *.netlify.com *.moneyhelper.org.uk *.demdex.net www.googletagmanager.com www.google.com apps.euw2.pure.cloud benefits.inbest.ai www.pensionwise.gov.uk \
    partner-tools.moneyadviceservice.org.uk www.youtube.com www.facebook.com forms.office.com *.fls.doubleclick.net assets.bugcrowdusercontent.com",
  'font-src': "'self'",
  'object-src': "'none'",
  'base-uri': "'self'",
  'form-action': "'self' prod-webforms.powerappsportals.com www.facebook.com",
  'frame-ancestors': "'none'",
};
