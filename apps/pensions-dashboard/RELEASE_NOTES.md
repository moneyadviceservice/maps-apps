# Pensions Dashboard - Release Notes

## Overview

The Pensions Dashboard is a secure web application that helps UK citizens view their pension information from multiple providers in one place. Built with Next.js and TypeScript, it displays State Pensions, workplace pensions, and personal pensions with real-time data. The service supports English and Welsh languages, meets accessibility standards, and works on all devices.

## Technical Specifications

**Frameworks**
Next.js 14, TypeScript 5.x, Tailwind CSS 3.x, MaPS React monorepo shared component library

**Rendering**
NextJS pages router, with mix of both Static & Server-side rendering with secure cookie-based sessions

**Code Quality**
Jest unit testing, Sonar code quality and ESLint

**Accessibility**
WCAG 2.1 AA accessibility compliant, core functionality available without JavaScript

**Modern Browsers**
Full support for Chrome, Firefox, Safari, Edge (latest versions)

**Integrations**
Adobe Analytics, Pensions Data Service, CDA Service, AEM Content Fragments (help & support FAQs only)

**Internationalization**
Supports English and Welsh translations

---

## Changelog

All notable changes to the Pensions Dashboard application will be documented in this file.

## [0.6] - 2025-??-??

- Fix: Timeout issue when JS disabled
- Feature: 34354 - Summary Sentence & Timeline
- Feature: 35513 - UX/UI updates
- Feature: 37700 - Pen test remediation, enable Content Security Policy (CSP) in report only mode

## [0.5] - 2025-09-08

- Feature: 37043 Timeout
- Fix: 39330 Secure Beta Link cookie expiration
- Feature: 35213 Pension Details

## [0.4.1] - 2025-07-22

- Added MHPD Privacy policy page
- Added MHPD Cookie policy page

## [0.4] - 2025-06-27

- Added Secure Beta Access feature
- Updated SP detail page design & content

### [0.3] - 2025-05-28

- Content updates
- Removed Help & Support forms
- Removed language switcher from header & navigation
- Added support for category groupings in Help & Support
- Added CSRF support

### [0.1] - 2025-01-21

- Initial release
- Mobile-responsive design optimized for all device types
- Basic error handling
- Support for DC, DB and State Pension types
- Support for English and Welsh translations
- Analytics integration for page views
- Added **Landing:** service landing
- Added **Welcome:** service overview and introduction
- Added **Searching for your pensions:** with loading progress indicator and information slides
- Added **Your pension search results:** pensions results grouped into categories (CONFIRMED, UNCONFIRMED and INCOMPLETE)
- Added **Your pension breakdown:** confirmed pensions displayed as cards, split into section with and without estimated income
- Added **Pending pensions:** incomplete pensions displayed as cards
- Added **Pensions that need action:** contact details for incomplete pensions
- Added **Pension details:** to display a single pension detail for SP, DC and DB pension types
- Added **Errors:** for 404, no pensions found and pension not showing
- Added **Help & Support:** knowledge base and contact forms, AEM content fragments, models and queries
- Added logout feature, with inactivity detection warning modal
