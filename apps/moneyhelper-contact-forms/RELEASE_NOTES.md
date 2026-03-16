# MoneyHelper Contact Forms – Release Notes

## Overview

MoneyHelper Contact Forms is a secure web application that enables users to access and submit contact and enquiry forms for a range of MoneyHelper services. The app is built for accessibility, bilingual support (English and Welsh), and works on all modern devices with or without JavaScript enabled.

## Technical Specifications

**Frameworks**
Next.js 14 (Pages Router), TypeScript 5.x, Tailwind CSS 3.x, Nx Monorepo, MaPS React monorepo shared component library

**Rendering**
Next.js Pages Router, fully server-side rendered with support for non-JavaScript browsers

**Code Quality**
Jest unit testing, Playwright E2E, ESLint

**Accessibility**
WCAG 2.1 AA accessibility compliant, core functionality available without JavaScript

**Modern Browsers**
Full support for Chrome, Firefox, Safari, Edge (latest versions)

**Integrations**
Adobe Analytics, Azure Functions API, Redis (form state), MaPS shared UI components

**Internationalization**
Full English and Welsh support

---

## [1.0.0] –

### Features

- Multi-step, accessible contact and enquiry forms for MoneyHelper services
- Bilingual (English/Welsh) language toggle and full translation coverage
- Configurable form flows for different enquiry types
- Deep-linking and auto-advance to any step via URL
- Secure data validation (zod) and serverless API submission
- Form state recovery and confirmation flows (Redis-backed)
- Responsive, mobile-first design
- Works with JavaScript enabled or disabled
- Analytics integration (Adobe Analytics)

### Technical Notes

- All required environment variables are managed in Netlify; no manual setup required for standard use
- Built on the shared MoneyHelper Forms (MHF) library for store logic, validation, and flow management
- No rollback plan required for initial release (new app)

---

## Known Issues

None.

---

## Documentation & Further Reading

- [Contact Forms App README](./README.md)
- [MoneyHelper Forms (MHF) Shared Library](../../libs/shared/mhf/README.md)
- [E2E Tests & Playwright Setup](../e2e/moneyhelper-contact-forms-e2e/README.md)
- [React Webform App Overview, Environment Mapping & D365 Integration (MaPS Digital Wiki)](https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1150/React)

For accessibility, technical, and implementation details, please refer to the above documentation.

### End-to-End Testing

Comprehensive E2E tests are implemented for all major user journeys. See the [E2E README](../e2e/moneyhelper-contact-forms-e2e/README.md) for details.

---

## Future Releases

- All new features, enhancements, and fixes will be documented in this file.
