# Content Security Policy

Shared Content Security Policy (CSP) configuration for MaPS Digital monorepo applications.

## How It Works

This CSP implementation uses a two-layer architecture:

### Next.js Plugin Responsibilities

The `withCSPHeaders` plugin handles CSP directive configuration:

- Defines allowed sources for scripts, styles, images, and other resources
- Formats directives into a CSP header string
- Applies headers to all routes (`/:path*`)
- Sets report-only or enforcement mode
- Skips CSP in local development (`NODE_ENV=development`)
- Merges with existing headers from your app config

### Netlify Plugin Responsibilities

The `@netlify/plugin-csp-nonce` plugin handles runtime security:

- Generates unique nonce values for each request
- Injects nonces into the CSP header's `script-src` directive
- Adds nonce attributes to inline `<script>` tags in HTML
- Processes responses at the Netlify Edge/CDN level
- Allows inline scripts to execute while maintaining CSP security

**Together**: The Next.js plugin defines *what* sources are allowed, whilst the Netlify plugin generates unique nonces per request and injects them into both the CSP header and inline scripts.

## Default CSP Configuration

The shared CSP policy is defined in `libs/shared/csp-policy/src/data/defaultCspHeader.ts` and includes allowlists for:

- Analytics (Google Analytics, Adobe Analytics, etc.)
- Tag Management (Google Tag Manager, Adobe DTM)
- Third-party integrations (LinkedIn, Facebook, Clarity, etc.)
- MoneyHelper domains
- Development tools

## Usage

### 1. Configure Next.js

Add CSP headers by including the plugin in your `next.config.js`:

```javascript
// apps/your-app/next.config.js
const { composePlugins, withNx } = require('@nx/next');
const { withCSPHeaders } = require('../../libs/shared/csp-policy/src/withCSPHeaders');

const nextConfig = {

};

const plugins = [
  withCSPHeaders(), // Runs in report-only mode by default
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
```

### 2. Configure Netlify

You must also configure the [Netlify CSP nonce plugin](https://github.com/netlify/plugin-csp-nonce) in your `netlify.toml`. This plugin adds nonce values to inline scripts at runtime.

Add the following to your `netlify.toml`:

```toml
[[plugins]]
    package = "@netlify/plugin-csp-nonce"
    [plugins.inputs]
        reportOnly = true  # Must match your Next.js plugin setting
```

**Important**: The `reportOnly` setting in `netlify.toml` must match the setting in your Next.js config:

- If using `withCSPHeaders()` (default report-only), set `reportOnly = true` in `netlify.toml`
- If using `withCSPHeaders({ reportOnly: false })` (enforcement), set `reportOnly = false` in `netlify.toml`

## Configuration Options

### Overriding CSP Directives

Use the `overrides` option to customise specific CSP directives. For example, to allow embedding from any origin:

```javascript
const plugins = [
  withCSPHeaders({
    overrides: {
      'frame-ancestors': '*',
    },
  }),
  withNx,
];
```

You can override multiple directives:

```javascript
withCSPHeaders({
  overrides: {
    'frame-ancestors': "'self' https://example.com",
    'img-src': "'self' data: https://cdn.example.com",
  },
})
```

### Report-Only vs Enforcement Mode

By default, CSP runs in **report-only mode**, which monitors violations without blocking resources. This is the safest option for production deployments.

To enforce CSP and actively block violations, set `reportOnly: false` in both configurations:

**Next.js config:**

```javascript
const plugins = [
  withCSPHeaders({ reportOnly: false }),
  withNx,
];
```

**Netlify config:**

```toml
[[plugins]]
    package = "@netlify/plugin-csp-nonce"
    [plugins.inputs]
        reportOnly = false
```

This uses the `Content-Security-Policy` header instead of `Content-Security-Policy-Report-Only`, blocking any resources that violate the policy.

### Environment-Specific Configuration

You can configure different CSP settings for different Netlify environments (production, deploy-preview, branch-deploy):

```toml
# Production: Enforcement mode
[[context.production.plugins]]
    package = "@netlify/plugin-csp-nonce"
      [context.production.plugins.inputs]
      reportOnly = false

# Deploy Previews: Report-only mode
[[context.deploy-preview.plugins]]
    package = "@netlify/plugin-csp-nonce"
      [context.deploy-preview.plugins.inputs]
      reportOnly = true

# Staging (branch): Enforcement mode
[[context."branch:staging".plugins]]
    package = "@netlify/plugin-csp-nonce"
      [context."branch:staging".plugins.inputs]
      reportOnly = false


# Branch Deploys: CSP disabled (plugin omitted entirely)
```

This allows you to:

- Test CSP in report-only mode on deploy previews before enforcing in production
- Use different modes for different environments
- Disable CSP on specific deployment contexts by simply omitting the plugin configuration

## Important: API Route Redirects

The Netlify CSP nonce plugin only processes **GET** requests (see [plugin docs](https://github.com/netlify/plugin-csp-nonce)). If your app uses API routes that redirect after form submission, you must use HTTP `303` (See Other) instead of `307` (Temporary Redirect).

A `307` redirect preserves the original request method (POST), so the browser follows the redirect as a POST request. The nonce plugin will not inject nonces into the response, and inline scripts will be blocked by CSP.

A `303` redirect tells the browser to follow with a GET request, which the nonce plugin will process correctly.

```typescript
// Bad - preserves POST method, nonces won't be injected
res.redirect(307, `/${language}/results`);

// Good - browser follows with GET, nonces are injected
res.redirect(303, `/${language}/results`);
```

If nonces are missing after a form submission but appear after a page refresh, this is likely the cause.

## Environment Variables

- `NODE_ENV=development` - Disables CSP in local development

## Contributing

When updating the shared CSP policy, ensure changes are tested across multiple apps.
