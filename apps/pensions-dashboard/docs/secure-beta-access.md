# Secure Beta Access (SBL)

SBL is used to control who has access to the Pensions Dashboard before go live.

SBL is controlled by an environment variable - **`MHPD_SECURE_BETA_ENABLED`**

- When set to `true`, SBL is ON and `proxy.ts` checks for a beaconId on each page load.
- When not set to `true`, SBL is OFF and this check is bypassed.

|                      | **OFF** (env ≠ `'true'`)   | **ON**                                           |
| -------------------- | -------------------------- | ------------------------------------------------ |
| Proxy (matcher hits) | `next()` — no cookie check | Enforces **`beaconId`** except on excluded paths |

**When SBL is ON:** `proxy.ts` only runs on its **matcher** (not **`_next`**, **`/api`**, **`/.netlify`**). It **skips** beaconId checks for **`/en/taking-part/*`**, **`/cy/taking-part`**, and **static asset** URLs.

When **ON**, a bad or missing service URL, or if there is no beaconId, users will go to **`https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-dashboard/research-panel`** to start the new access form flow.

## Unmoderated access flow (November 2026)

Users start their journey to access the dashboard from an AEM page `https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-dashboard/research-panel`

From this page users navigate to the start of the new form flow in the dashboard `/{lang}/taking-part/data-and-privacy`

On completion of the form flow a user is issued with a **`beaconId`** cookie and sent to the home page.

## Legacy links (pre November 2026)

Users started their journey to access the dashboard from the same AEM page as the new flow `https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-dashboard/research-panel`.

The link on this page would send them to Participant Kit to complete a form.

On completion of the form the user would be sent a secure link via email.

The secure link would go to the `/api/activate` route which would verify and validate links and finally grant the user access.

In the rare case where we now encounter a legacy link the following process will apply:

- The `/api/activate` route will check for a **`beaconId`**.
- If a **`beaconId`** is found, the user is redirected to the landing page to continue their journey.
- If no **`beaconId`** is found, the user is redirected to `/en/sign-up-update` which explains that the process has changed. Users then click on a link to the start of the new process **`https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-dashboard/research-panel`**

## Pages & cookie

- **`beaconId`** — httpOnly token;.
