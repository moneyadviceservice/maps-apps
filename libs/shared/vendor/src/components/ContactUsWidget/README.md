# ContactUsWidget

A component that loads and initializes the Contact Us widget script for MoneyHelper tools.

## Usage

```tsx
import { ContactUsWidget } from '@maps-react/vendor/components/ContactUsWidget';

<ContactUsWidget
  src={process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_SRC}
  deploymentId={{
    en: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN,
    cy: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY,
  }}
  sessionId={userSessionId}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | Yes | - | URL to the widget script |
| `deploymentId` | `{ en: string; cy: string }` | Yes | - | Deployment IDs for English and Welsh |
| `environment` | `string` | No | `'euw2'` | Environment identifier |
| `sessionId` | `string` | No | - | User session GUID; when non-empty, the widget appends `sessionID` to the online form URL |

## Environment Variables

Add these to your app's environment configuration:

```env
NEXT_PUBLIC_CONTACT_US_WIDGET_SRC=<widget-script-url>
NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN=<english-deployment-id>
NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY=<welsh-deployment-id>
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CONTACT_US_WIDGET_SRC` | URL to the widget script |
| `NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN` | English deployment ID |
| `NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY` | Welsh deployment ID |

## Behaviour

- The widget will not render if `src`, `deploymentId.en`, or `deploymentId.cy` is missing
- The script loads with `afterInteractive` strategy to avoid blocking page load
- On script load, `window.ContactUsWidget.init()` is called with the deployment IDs and environment
- When `sessionId` is a non-empty string, it is passed to `init()` so the widget can append `sessionID` to the online form URL; omitted or empty values are not passed

## Adding to an App

### 1. Update `_app.tsx`

```tsx
import { AppProps } from 'next/app';

import { ContactUsWidget } from '@maps-react/vendor/components/ContactUsWidget';

type CustomAppProps = AppProps & {
  userSessionId: string;
};

function CustomApp({ Component, pageProps, userSessionId }: CustomAppProps) {
  return (
    <BasePageLayout>
      {/* ... other components ... */}
        <ContactUsWidget
          src={process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_SRC}
          deploymentId={{
            en: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN,
            cy: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY,
          }}
          sessionId={userSessionId}
        />
    </BasePageLayout>
  );
}
```
