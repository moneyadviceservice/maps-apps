# Netlify Functions - AppConfig Handler

A utility library for handling Azure App Configuration integration in Netlify Functions, providing feature flags and configuration settings with built-in caching.

## Description

This library provides a standardised way to integrate Azure App Configuration with Netlify Functions, offering automatic caching with Netlify Blobs to improve performance and reduce API calls to Azure App Configuration services.

**📋 For general best practices on feature flags and app configuration, see the [Feature Flags & App Configuration Guide](https://mapswiki.atlassian.net/wiki/x/Q4A7D).**

## Prerequisites

- Azure App Configuration instance configured with your feature flags and configuration settings
- Environment variables configured for Azure App Configuration access
- Netlify deployment with blob storage enabled

## Quick Start

### Installation

The library is already available in the monorepo as `@maps-react/netlify-functions`. No additional installation required.

**Note:** Netlify Functions only work locally when using the Netlify CLI. You must run `netlify dev` instead of the standard `npm run serve` commands to enable function endpoints during local development.

### Creating a Netlify Function

Create a new file in your app's `netlify/functions/` directory (e.g., `netlify/functions/appconfig.mts`):

```typescript
import { Config, Context } from '@netlify/functions';
import {
  AppConfigOptions,
  appConfigHandler,
} from '@maps-react/netlify-functions/appConfig';

const appConfigOptions: AppConfigOptions = {
  appName: 'your-app-name',
};

export default async function (req: Request, context: Context) {
  return appConfigHandler(req, context, appConfigOptions);
}

export const config: Config = {
  path: ['/api/appconfig'],
};
```

## Configuration Options

### AppConfigOptions

```typescript
interface AppConfigOptions {
  appName: string;           // Required: Name of your application
  cacheKey?: string;         // Optional: Custom cache key (defaults to `${appName}-config-cache`)
  cacheTtlMs?: number;       // Optional: Cache TTL in milliseconds (defaults to 5 minutes)
  blobStoreName?: string;    // Optional: Netlify blob store name (defaults to 'appconfig')
}
```

## Client Utilities

### getServerSideAppConfig(req)

The recommended way to access app configuration from `getServerSideProps`. Pass the request object and get back a config object with bound helper methods.

```typescript
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const appConfig = await getServerSideAppConfig(req);

  // Read a string value
  const value = appConfig.getValue('my-key');

  // Read a numeric value with a default
  const rate = appConfig.getNumber('interestRateValue', 3.75);

  // Check feature flags
  if (appConfig.isFeatureEnabled('new-feature')) { ... }

  // Access the raw AppConfiguration if needed
  const rawConfig = appConfig.config;

  return { props: { ... } };
};
```

**Returns:** `Promise<ServerSideAppConfig>` — see `getAppConfig.ts` for the full type definition.

## Features

- **Automatic Caching**: Uses Netlify Blob storage to cache configuration data
- **Configurable TTL**: Set custom cache expiration times
- **Error Handling**: Gracefully handles Azure App Configuration API failures
- **TypeScript Support**: Full type definitions included
- **Performance Optimised**: Reduces API calls with intelligent caching

## Caching Behaviour

- Configuration is cached using Netlify Blobs with configurable TTL (default: 5 minutes)
- Cache is automatically invalidated when TTL expires
- Fresh data is fetched from Azure App Configuration when cache is empty or expired
- Failed API calls return empty configuration to prevent application crashes

## Examples

### Basic Implementation (Mortgage Calculator)

```typescript
// netlify/functions/appconfig.mts
import { Config, Context } from '@netlify/functions';
import {
  AppConfigOptions,
  appConfigHandler,
} from '@maps-react/netlify-functions/appConfig';

const appConfigOptions: AppConfigOptions = {
  appName: 'mortgage-calculator',
};

export default async function (req: Request, context: Context) {
  return appConfigHandler(req, context, appConfigOptions);
}

export const config: Config = {
  path: ['/api/appconfig'],
};
```

### Consuming Config in a Page

```typescript
// pages/[language]/index.tsx
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const appConfig = await getServerSideAppConfig(req);
  const rate = appConfig.getNumber('interestRateValue', 3.75);
  const emergencyBannerContent = parseEmergencyBanner(
    appConfig.getValue('emergency-banner'),
  );

  return { props: { rate, emergencyBannerContent } };
};
```

### Advanced Usage with Custom Options

```typescript
const appConfigOptions: AppConfigOptions = {
  appName: 'my-app',
  cacheKey: 'custom-cache-key',
  cacheTtlMs: 10 * 60 * 1000, // 10 minutes
  blobStoreName: 'my-custom-store',
};
```

## Environment Setup

The following environment variable is required:

- `AZURE_APP_CONFIG_CONNECTION_STRING` — Connection string for your Azure App Configuration instance

## TypeScript Configuration

Add the path alias to your app's `tsconfig.json` and ensure `**/*.mts` is included (Netlify functions use the `.mts` extension):

```json
{
  "compilerOptions": {
    "paths": {
      "@maps-react/netlify-functions/*": [
        "../../libs/shared/netlify-functions/src/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.mts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    "next-env.d.ts"
  ]
}
```

---

For general workspace information and setup instructions, see the [main README](../../../README.md).
