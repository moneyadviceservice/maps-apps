# Shared Cosmos REST Client

HTTP helpers for the Cosmos API. Server-side only.

The `x-api-key` header identifies the calling site and decides which Cosmos database and container are used.

## Environment variables

```env
COSMOS_API_URL=https://...
COSMOS_API_KEY=...
```

## Helpers

| Helper                                  | Request                  |
| --------------------------------------- | ------------------------ |
| `cosmosCreateSession(sessionId, body)`  | `POST /api/:sessionId`   |
| `cosmosGetSession(sessionId)`           | `GET /api/:sessionId`    |
| `cosmosReplaceSession(sessionId, body)` | `PUT /api/:sessionId`    |
| `cosmosPatchSession(sessionId, body)`   | `PATCH /api/:sessionId`  |
| `cosmosDeleteSession(sessionId)`        | `DELETE /api/:sessionId` |

All return `ApiResponse<T>` (`{ status?, data?, error? }`) and never throw on request failure.

```ts
import { cosmosGetSession } from '@maps-react/cosmos/rest-client';

const res = await cosmosGetSession<MyDoc>(sessionId);
```
