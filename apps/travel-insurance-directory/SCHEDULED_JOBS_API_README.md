# Scheduled Firm FCA Validation API

## Overview

This API endpoint acts as a automated scheduled cron job designed to audit and reconcile the status of registered firms against the Financial Conduct Authority (FCA) registry. It fetches a batch of firms from the database, validates their current FCA status, and triggers appropriate administrative reports and automated lifecycle updates (hiding invalid firms or reactivating resolved ones).

## Endpoint Specifications

- **URL:** `/api/scheduled-jobs/validate-firms`
- **Method:** `GET`
- **Headers:**
- `x-scheduled-job-secret`: Must match the server's `VALIDATE_FIRM_API_SECRET` environment variable.
- **Currently triggered by an azure pipeline which is configured in the TID root `/tid-nightly-audit.yml`**
- ** Though it can also be called directly with the correct parameters **

---

## Core Workflow

```
[Fetch Batch from Cosmos] ➔ [Validate via FCA API] ➔ [Single-Pass Logic Loop] ➔ [Execute Async Actions] ➔ [Send Admin Report]

```

1. **Authentication & Method Verification:** Rejects any non-`GET` requests with a `405` and verifies the custom cron secret header, rejecting unauthorized requests with a `401`.
2. **Data Ingestion:** Fetches a batch of firms (currently limited to the first 100 entries) from Cosmos DB.
3. **Concurrent Validation:** Asynchronously checks every firm's `fca_number` against the FCA registry concurrently using `Promise.all`.
4. **Business Logic Evaluation:** Loops through the results to split firms into two primary categories:

- **Invalid Firms:** If the FCA status is invalid, it flags the firm to be hidden, captures the firm's principal details for email notifications, and appends the firm to the admin failure log.
- **Newly Valid Firms:** If a firm was previously marked as `hidden` but its FCA validation is now successful, it flags the firm to be reactivated
  providing the hidden_reason was due to an invalid FCA number.

5. **Asynchronous Execution & Safety:** Aggregates all DB patches (`updateFirm`) and notification dispatches into a single promise queue, ensuring all write/network events resolve cleanly before the serverless execution context terminates.
6. **Reporting:** If any validation failures occurred during the run, a summary report is compiled and emailed to administrators via `tidFcaValidationReport`.

---

## State & Notification Triggers

| Scenario                               | Database Update                                | Notifications Sent                             |
| -------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| **FCA Validation Fails**               | Status set to `'hidden'` and set hidden_reason | Email sent to Firm Principal (`tidInvalidFrn`) |
| **FCA Validation Passes (Was Active)** | No change                                      | None                                           |
| **FCA Validation Passes (Was Hidden)** | Status restored to `'active'`                  | None                                           |

---

## Expected Success Response (200 OK)

```json
{
  "success": true,
  "totalProcessed": 100,
  "invalidFcaNumbers": [123456, 789012],
  "totalFailureCount": 2
}
```
