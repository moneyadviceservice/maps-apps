import Script from 'next/script';

export const InformizelyGetToolName = ({
  nonce,
}: {
  nonce?: string | undefined;
}) => {
  return (
    <Script
      id="informizely-script-tag"
      type="text/javascript"
      strategy="afterInteractive"
      nonce={nonce}
    >
      {`
        var IzWidget = IzWidget || {}; 
        var informizelyApi = null;
        IzWidget['insitez.ready'] = function (api) {
          var toolName = '';
          if (window.adobeDataLayer && window.adobeDataLayer.length > 0) {
            toolName = window.adobeDataLayer[0]?.tool?.toolName || 'unknown';
          }
          api.set('custom', { 'tool-name': toolName });
      
        informizelyApi = api;
        window.informizelyApi = api;
        };
      `}
    </Script>
  );
};

export const InformizelyDevScript = ({
  siteId,
  nonce,
}: {
  siteId: string;
  nonce?: string | undefined;
}) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    return null;
  }

  return (
    <Script
      id="_informizely_script_tag"
      type="text/javascript"
      strategy="afterInteractive"
      nonce={nonce}
    >
      {`var IzWidget = IzWidget || {};
          (function (d) {
            var scriptElement = d.createElement('script');
            scriptElement.type = 'text/javascript'; scriptElement.async = true;
            scriptElement.src = "https://insitez.blob.core.windows.net/site/${siteId}.js";
            var node = d.getElementById('_informizely_script_tag');
            node.parentNode.insertBefore(scriptElement, node);
          })(document);
          `}
    </Script>
  );
};
