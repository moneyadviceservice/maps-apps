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
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | Yes | - | URL to the widget script |
| `deploymentId` | `{ en: string; cy: string }` | Yes | - | Deployment IDs for English and Welsh |
| `environment` | `string` | No | `'euw2'` | Environment identifier |

## Environment Variables

Add these to your app's environment configuration:

```env
NEXT_PUBLIC_USE_NEW_CONTACT_US_WIDGET=true
NEXT_PUBLIC_CONTACT_US_WIDGET_SRC=<widget-script-url>
NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN=<english-deployment-id>
NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY=<welsh-deployment-id>
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_USE_NEW_CONTACT_US_WIDGET` | **Temporary** feature flag to enable the widget (`'true'` to enable). Will be removed once rollout is complete. |
| `NEXT_PUBLIC_CONTACT_US_WIDGET_SRC` | URL to the widget script |
| `NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN` | English deployment ID |
| `NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY` | Welsh deployment ID |

## Behaviour

- The widget will not render if `src`, `deploymentId.en`, or `deploymentId.cy` is missing
- The script loads with `afterInteractive` strategy to avoid blocking page load
- On script load, `window.ContactUsWidget.init()` is called with the deployment IDs and environment

## Adding to an App

### 1. Update `_app.tsx`

Conditionally render the widget based on the feature flag:

```tsx
import { ContactUsWidget } from '@maps-react/vendor/components/ContactUsWidget';

const useNewContactUsWidget =
  process.env.NEXT_PUBLIC_USE_NEW_CONTACT_US_WIDGET === 'true';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      {/* ... other components ... */}
      {useNewContactUsWidget && (
        <ContactUsWidget
          src={process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_SRC}
          deploymentId={{
            en: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN,
            cy: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY,
          }}
        />
      )}
    </BasePageLayout>
  );
}
```

### 2. Update page components

Disable the existing `showContactUs` when the new widget is enabled:

```tsx
const useNewContactUsWidget =
  process.env.NEXT_PUBLIC_USE_NEW_CONTACT_US_WIDGET === 'true';

<ToolPageLayout
  showContactUs={!useNewContactUsWidget}
  // ... other props
>
  {children}
</ToolPageLayout>
```
