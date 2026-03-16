# Shared functions for registering and authenticating users with Azure EntraID Native Authentication.

This module provides a **shared Azure EntraID helper functions** for integrating with Azure EntraID for registering and authenticating users. It is designed for use in Node.js server-side code. None of these functions should be called directly from the client. Authentication tokens should not be stored on the client.

---

## Features

- **Should be confiugured through environment variables**: Base URL and relevant tokens to be setup in the relevant app .env file (or through netlify).

---

## Usage

### 1. **Environment Variables**

```env
ENTRA_CLIENT_ID=********
ENTRA_CLIENT_URL=******* (this might contain the tenant subdomain followed by the tenant ID)
```

---

### 2. **Functions**

All functions are asynchronous and return Promises:

`startSignUp` — Starts the entra ID sign up flow - acquires continuation token for the next steps.<br>
`getChallenge` — Using the contunation token, triggers the relevant authentication challenge (oob/password) - successful calls response with another continuation token.<br>
`submitOtp` — Using the contunation token and the OTP token triggered by 'getChallenge', responds with another continuation token.<br>
`submitAttributes` - Optional - For attributes not sent in the initial `startSignUp` - you can then set these here. Responds with continuation token.<br>
`submitPassword` - Password challenge only - Sets user password. Responds with continuation token.<br>
`getToken` - Uses continuation token from successful register steps to return authenticated tokens.

---

## Implementation Notes

- For the Native Authentication flow only.
- Not to be used with MSAL package.

---

## Example Usage & Testing

Usage:

```typescript
import {
  startSignUp,
  getChallenge,
  submitOtp,
  getToken,
} from '@maps-react/entra-id/entraIdService';

// Start sign up flow
await startSignUp(username);

// Request challenge
await getChallenge(username, continuation_token);

// Post OTP
await submitOtp(username, otp, continuation_token);

// Get authentication tokens
await getToken(emailAddress, continuation_token);
```

---

## Troubleshooting

- **Not to be used in the client:**  
  Using in the client will be a security concern.

- **Postman:**
  You can test the Entra ID api's in postman (or similar) before integrating with your application.

## Preconditions

- You will need the relevant services configured in Azure.

- When setting up your Azure EntraID Service in the portal, you will need to configure an application as well as a user flow:
  - Speak with someone who has the knowledge and permissions in this area to set this up.
