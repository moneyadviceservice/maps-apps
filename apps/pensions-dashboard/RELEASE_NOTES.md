# Pensions Dashboard - Release Notes

## Overview

The Pensions Dashboard is a secure web application that helps UK citizens view their pension information from multiple providers in one place. Built with Next.js and TypeScript, it displays State Pensions, workplace pensions, and personal pensions with real-time data. The service supports English and Welsh languages, meets accessibility standards, and works on all devices.

## Technical Specifications

**Frameworks**
Next.js 15, TypeScript 5.x, Tailwind CSS 3.x, MaPS React monorepo shared component library

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

## [1.4]

- Feature: 55739 - Hide timeline button when a return contains only one pension
- Feature: 56225 - Income estimation (values calculated) understanding
- Feature: 56332 - SP Forecast vs Estimate
- Feature: 56501 - Pending Pensions Quick Wins
- Feature: 56602 - Calculation method missing from data - Content change
- Fix: 56611 - Loading taking more than 65 seconds

## [1.3]

- Feature: 52475 - WhatsApp Contact Us widget
- Feature: 53640 - WhatsApp and design amendments on contact-us-form page
- Feature: 55004 - Value Illustration Date on pension-details page
- Feature: 55212 - Reintroduce OJ banner
- Chore: 55854 - Normalise e2e app implicit dependency direction
- Fix: 55637 - Long pension names do not wrap on Pensions found or Pension details pages
- Fix: 55852 - Duplicate Page Clear Banner
- Fix: 56475 - Next API route allowing users to bypass SBL

## [1.2]

- Feature: 54958 - Maintenance Page - Static HTML
- Feature: 55363 - SYS/NEW no pension type - Pension Card
- Feature: 55367 - SYS/NEW no pension type - Summary tab no pension design
- Feature: 55370 - SYS/NEW no pension type - Income & values tab
- Feature: 55372 - SYS/NEW Summary tab logic change
- Fix: 54908 - Informizely breaks the page
- Fix: 55556 - 'Open online form' button does not open online form

## [1.1]

- Feature: 53376 - 'False door' downloads button
- Feature: 53377 - 'False door' intermediary page
- Feature: 53942 - Exit page updates
- Feature: 53943 - Session time out updates
- Feature: 53944 - Remove the OJ banner
- Feature: 53945 - Pension details page updates
- Feature: 55022 - Remove H&S banner from /pension-details
- Build: 53537 - Upgrade Node.js from 22.15 to 22.23.1
- Fix: 54450 - welsh - Loading Your Pensions - Llwytho'ch pensiynau

## [1.0]

- Feature: 50236 - Combination Pension Schemes
- Feature: 52967 - Summary Sentence Year and Context Changes
- Feature: 52659 - Pot Value Box Wording Review
- Fix: 53036 - McCloud Timeline Link Fix
- Fix: 52422 - Incorrect tooltip placement on Safari and Mobile
- Fix: 53318 - Timeline page - Welsh Language Switching Bug
- Fix: 52696 - Analytics added to verify code page
- Fix: 53402 - welsh - Loading your pensions remediation
- Fix: 51869 - a11y - Plain numbers focus indicator
- Fix: 51885 - a11y - Footer - Follow us icon states
- Fix: 51890 - a11y - Pension Detail Tabs states
- Fix: 51805 - a11y - webform - Error keyboard focus
- Fix: 51809 - a11y - webform - Minimum character requirement added to form
- Fix: 51879 - a11y - webform - Non descriptive accessible name for form landmarks
- Fix: 51808 - a11y - webform - Instructional text field association

## [0.17]

- Feature: 49926 - Timeline button placement on pension summary
- Feature: 51789 - Hybrid pension income-and-values tab benefit titles
- Feature: 51804 - AVC "How these values are calculated" accordion text update
- Fix: 51716 - a11y - Loading page tick mark icon colour contrast
- Fix: 51717 - a11y - Tooltips screen reader hidden text
- Fix: 51718 - a11y - Graph titles heading structure
- Fix: 51719 - a11y - Unique accessible names for See details buttons
- Fix: 51720 - a11y - Loading page aria-live label
- Fix: 51887 - a11y - Pension details tab navigation landmark
- Fix: 51888 - a11y - Pension summary heading structures
- Fix: 51898 - a11y - Toggletip overlay for keyboard users
- Fix: 51900 - a11y - Main page heading inside main content area
- Fix: 51903 - a11y - Heading structure for Important PTNA warning
- Fix: 51904 - a11y - Skipped heading level between H1 and content cards
- Fix: 51907 - a11y - Heading hierarchy in Understand Your Pensions
- Fix: 51911 - a11y - PTNA contact information unique accessible names
- Fix: 51913 - a11y - Results page error callout heading level

## [0.16]

- Feature: 50717 - Tooltip - Close button
- Feature: 50718 - Pension Details - Contact methods
- Feature: 50989 - Pension Details - More Details and Features accordion titles
- Feature: 51350 - Welsh AEM Category titles & descriptions
- Feature: 51126 - Contact Form Welsh Implementation
- Feature: 50535 - Add Language Switcher Toggle
- Feature: 50826 - Format dates in Welsh
- Feature: 51448 - Landing page improvements
- Feature: 51449 - Do you understand this page component (Tool Feedback)
- Feature: 51558 - Add "Home" navigation
- Feature: 48311 - Privacy policy updates and Welsh translation
- Feature: 50122 - Cash Balance full functionality
- Feature: 50139 – Remove remaining Benefit types for Hybrid pensions from the unsupported category
- Build: 48411 - NextJS 15 upgrade

## [0.15]

- Feature: 41248 - CDC pension type support
- Feature: 50828 - Add user session ID to contact form
- Feature: 50637 - Fix return journey after login in Welsh
- Feature: 50580 - Welsh language implementation v2
- Feature: 50643 - Results page UI update (quick wins)

## [0.14]

- Feature: 45593 - Update Cookie Policy - combined MH
- Feature: 49830 - Add accessible options to Contact Us page
- Feature: 48051 - Welsh language implementation v1
- Feature: 42572 - Multiplicity Part 3 - McCloud

## [0.13]

- Feature: 47983 - Onward Journey banner
- Feature: 47785 - Pensions that need action page UI update and sections split
- Feature: 45593 - Beware of Scams banner copy and phone number change
- Feature: 47857 - Summary sentence icon updates
- Feature: 48482 - Update summary for multiplicity on pension details page
- Chore: 49766 - Disable FE logging of analytics

## [0.12]

- Feature: 47782 - Help & Support v4 contact us page
- Feature: 47783 - Help & Support webchat contact widget
- Feature: 42422 - Multiplicity Part 1 - Multiple Tranches
- Feature: 42246 - Multiplicity Part 2 - DB with DC

## [0.11]

- Feature: 47425 - Secure beta OTP verification flow
- Feature: 47978 - Updated copy for link access error page
- Fix: 46709 - Hide Employer Status row when not present

## [0.10]

- Feature: 45481 - Remove H&S banner when not logged in
- Build: 37359 - NextJS 14 upgrade
- Security: 37357 - Implemented secure http cookies
- Feature: 42818 - State Pension page copy updates
- Feature: 45557 - Contact us footer link points to new MHPD contact us page
- Feature: 45555 - Add analytics to timeline page

## [0.9.1]

- Feature: 45112 - Migrate to use React Contact form
- Feature: 42266 - Enable links in state pension message text
- Feature: 43890 - Move business logic from FE to BE ⚠️ Breaking Changes (Requires BE deploy)
- Fix: 42621 - Pension detail summary content text size
- Fix: 42421 - Pension detail summary image sizes on mobile

## [0.9]

- Feature: 44582 - Enable analytics on production
- Feature: 41782 - Cookie Consent enabled
- Feature: 41782 - Cookie policy page content updated
- Feature: 41782 - Privacy Policy page content updated
- Feature: 44358 - Pension retrieval unhappy path callout
- Feature: 34945 - Help & Support content updates + contact us form page
- Feature: 43893 - Landing page content update

## [0.8.1]

- Feature: 43108 - Beta feedback banner updates
- Feature: 43141 - Redirect to error when not logged in

## [0.8]

- Feature: 41246 - Hybrid pensions
- Feature: 37991 - Send analytics events for page, tool, user and pension search results
- BAU: 43109 - Update timeout UX content
- Feature: 37700 - Enforce content security policy (CSP)
- Feature: 40784 - Linked AVC pensions
- Feature: 40783 - Non-linked AVC pensions (pension card, timeline, details & summary sentence)
- Feature: 41865 - Accessibility audit fixes
- Fix: 42451 - Redirect to no pension found page when only ERROR pensions are returned

## [0.7.1]

- Fix: 42828 - Fix firewall issue with Secure Beta Access

## [0.7]

- Feature: 35513 - UX/UI updates
- Feature: 39170 - FE Pensions Classification API
- Fix: 41274 - Pension card text wrapping
- Fix: 41766 - Replace double dashes with "Unavailable"

## [0.6]

- Fix: Timeout issue when JS disabled
- Feature: 34354 - Summary Sentence & Timeline
- Feature: 35513 - UX/UI updates
- Feature: 37700 - Pen test remediation, enable Content Security Policy (CSP) in report only mode

## [0.5]

- Feature: 37043 Timeout
- Fix: 39330 Secure Beta Link cookie expiration
- Feature: 35213 Pension Details

## [0.4.1]

- Added MHPD Privacy policy page
- Added MHPD Cookie policy page

## [0.4]

- Added Secure Beta Access feature
- Updated SP detail page design & content

### [0.3]

- Content updates
- Removed Help & Support forms
- Removed language switcher from header & navigation
- Added support for category groupings in Help & Support
- Added CSRF support

### [0.1]

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
