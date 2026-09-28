import Script from 'next/script';

type Props = {
  nonce?: string;
};

export const AdobeAnalytics = ({ nonce }: Props) => (
  <Script
    src={process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT}
    strategy="beforeInteractive"
    data-testid="adobe-analytics"
    nonce={nonce}
    async={true}
    defer={false}
  />
);
