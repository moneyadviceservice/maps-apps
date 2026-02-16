import Script from 'next/script';

declare global {
  interface Window {
    ContactUsWidget?: {
      init: (config: {
        deploymentId: { en: string; cy: string };
        environment: string;
      }) => void;
    };
  }
}

type ContactUsWidgetProps = {
  src?: string;
  deploymentId?: {
    en?: string;
    cy?: string;
  };
  environment?: string;
};

export const ContactUsWidget = ({
  src,
  deploymentId,
  environment = 'euw2',
}: ContactUsWidgetProps) => {
  if (!src || !deploymentId?.en || !deploymentId?.cy) {
    return null;
  }

  const { en, cy } = deploymentId;

  return (
    <Script
      id="contact-us-widget"
      src={src}
      strategy="afterInteractive"
      data-testid="contact-us-widget"
      onLoad={() => {
        if (typeof window !== 'undefined' && window.ContactUsWidget) {
          window.ContactUsWidget.init({
            deploymentId: { en, cy },
            environment,
          });
        }
      }}
    />
  );
};
