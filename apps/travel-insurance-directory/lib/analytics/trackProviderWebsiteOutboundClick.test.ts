import {
  PROVIDER_WEBSITE_OUTBOUND_LINK_TYPE,
  buildProviderWebsiteOutboundClickEventInfo,
} from './trackProviderWebsiteOutboundClick';

describe('trackProviderWebsiteOutboundClick', () => {
  it('returns outboundClick eventInfo shape', () => {
    expect(
      buildProviderWebsiteOutboundClickEventInfo({
        linkUrl: 'https://example.com',
        linkText: 'Visit provider website (opens in new tab)',
        providerName: 'Acme Insurance Ltd',
      }),
    ).toEqual({
      link: {
        url: 'https://example.com',
        text: 'Visit provider website (opens in new tab)',
        type: PROVIDER_WEBSITE_OUTBOUND_LINK_TYPE,
      },
      provider: 'Acme Insurance Ltd',
    });
  });
});
