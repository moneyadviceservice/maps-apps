export const PROVIDER_WEBSITE_OUTBOUND_LINK_TYPE = 'external' as const;

/**
 * Adobe `eventInfo` for "Visit provider website" on firm listings (`outboundClick`).
 */
export function buildProviderWebsiteOutboundClickEventInfo(params: {
  linkUrl: string;
  linkText: string;
  providerName: string;
}): {
  link: {
    url: string;
    text: string;
    type: typeof PROVIDER_WEBSITE_OUTBOUND_LINK_TYPE;
  };
  provider: string;
} {
  return {
    link: {
      url: params.linkUrl,
      text: params.linkText,
      type: PROVIDER_WEBSITE_OUTBOUND_LINK_TYPE,
    },
    provider: params.providerName,
  };
}
