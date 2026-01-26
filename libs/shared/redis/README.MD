# Shared Redis Client & Helpers

This module provides **two ways to interact with Redis**:
1. **Direct Redis client** (`helpers.ts`) - Direct connection to Azure-managed Redis instance
2. **REST client** (`rest-client.ts`) - HTTP-based client for Redis REST API

Both are designed for use in Node.js server-side code (e.g., Next.js API routes, serverless functions, or backend services).

---

## Features

- **Singleton Redis client**: Ensures only one Redis connection is created per process.
- **Environment-based configuration**: Reads connection details from environment variables.
- **Promise-based helpers**: Simple async functions for `get`, `set`, and `del` operations.

---

## Usage

### 1. **Environment Variables**

Set the following in your `.env.local` or deployment environment:

For Redis with Entra ID:

```env
AZURE_MANAGED_REDIS_HOST_NAME=********
AZURE_MANAGED_REDIS_CLIENT_ID=*******
AZURE_MANAGED_REDIS_CLIENT_SECRET=*******
AZURE_MANAGED_REDIS_TENANT_ID=*******
```

> **Note:**  
> Do **not** include the port in the host environment variable.

OR

For Redis with connection string:

```env
AZURE_REDIS_CONNECTION_STRING=rediss://:<password>@<host>:<port>
AZURE_MANAGED_REDIS_CONNECT_VIA_KEY=true
```

---

### 2. **API**

All helpers `src/helpers.ts` are asynchronous and return Promises:

`redisGet` — Get a value by key. <br>
`redisSet` — Set a value by key (also used to create an instance | TTL defaults to 60 minutes or can be set by passing ttlSeconds). <br>
`redisDel` — Delete a key.

---

## Implementation Notes

- The Redis client is created only once and reused for all operations.
- If the required environment variables are missing, an error is thrown.
- All helpers are async and return Promises.
- Designed for use in server-side code only (do **not** import in client/browser code).

---

## Example Usage & Testing

Usage:

```typescript
import { redisGet, redisSet, redisDel } from '@maps-react/redis/helpers';

// Set a value
await redisSet('user:123', JSON.stringify({ name: 'Bob' }));

// Set a value with a specified expiry
await redisSet('user:123', JSON.stringify({ name: 'Bob' }), 7200);

// Get a value
const userData = await redisGet('user:123');
if (userData) {
  const user = JSON.parse(userData);
  console.log(user.name); // "Bob"
}

// Delete a value
await redisDel('user:123');
```

Testing:

```typescript
import { redisGet, redisSet, redisDel } from '@maps-react/redis/helpers';

jest.mock('@maps-react/redis/helpers', () => ({
  redisGet: jest.fn(),
  redisSet: jest.fn(),
  redisDel: jest.fn(),
}));

describe('user redis operations', () => {
  const mockKey = 'user:123';
  const mockValue = JSON.stringify({ name: 'Bob' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets and gets a user value', async () => {
    (redisSet as jest.Mock).mockResolvedValueOnce('OK');
    (redisGet as jest.Mock).mockResolvedValueOnce(mockValue);

    await redisSet(mockKey, mockValue);
    const userData = await redisGet(mockKey);
    expect(userData).toBe(mockValue);
  });

  it('deletes a user value', async () => {
    (redisDel as jest.Mock).mockResolvedValueOnce(1);
    (redisGet as jest.Mock).mockResolvedValueOnce(null);

    await redisDel(mockKey);
    const deletedData = await redisGet(mockKey);
    expect(deletedData).toBeNull();
  });
});
```

---

## Troubleshooting

- **Do not use in client-side code:**  
  Importing these modules in browser code will cause build/runtime errors.

---

## File Structure

```
libs/shared/redis/
  ├── client.ts    # Redis client singleton
  ├── helpers.ts   # get/set/del helpers
```

---

## VS Code Integration

You can browse and manage your Redis data visually using the folllwing VS Code extension: https://marketplace.visualstudio.com/items?itemName=Redis.redis-for-vscode

When adding your Azure Redis instance:

- **Host:** Use your Azure Redis host (e.g., `your-redis-host.redis.cache.windows.net`)
- **Port:** Use `10000` with Entra ID OR `6380` when using a connection string
- **Password:** Use your Azure Redis access key
- **Use TLS:** Make sure to check this box

Once connected, you can view, edit, and delete keys directly from VS Code.

---

## REST Client

The REST client provides an alternative HTTP-based way to interact with Redis through a REST API.

### Features

- **HTTP-based**: Uses REST API endpoints instead of direct Redis connection.
- **Standardized responses**: All operations return `ApiResponse<T>` wrapper with success/error handling.
- **Hash operations**: Support for Redis Hash data type operations.
- **Error handling**: Built-in error handling with standardized error responses.

### Environment Variables

For Redis REST API:

```env
REDIS_API_URL=https://your-redis-rest-api.com
REDIS_REST_API_KEY=your-api-key
```

> **Note:**  
> `REDIS_API_URL` and `REDIS_API_KEY` must be provided. If both are missing, an error will be thrown.

### API

All REST client functions are asynchronous and return `Promise<ApiResponse<T>>`:

**Response Format:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;      // Present when success is true
  error?: string; // Present when success is false
}
```

**Available Functions:**

- `redisRestGet(key: string)` — Get a value by key. Returns `ApiResponse<GetResponse>`.
- `redisRestSet(key: string, value: string, options?: { ttlSeconds?: number })` — Set a key-value pair. TTL defaults to 3600 seconds (1 hour). Returns `ApiResponse<SetResponse>`.
- `redisRestDel(key: string)` — Delete a key. Returns `ApiResponse<DeleteResponse>`.
- `redisRestGetHash(key: string)` — Get a hash value by key. Returns `ApiResponse<GetHashResponse>`.
- `redisRestSetHash(key: string, value: Record<string, string>, options?: { ttlSeconds?: number })` — Set a hash value. TTL defaults to 3600 seconds (1 hour). Returns `ApiResponse<SetHashResponse>`.

### Implementation Notes

- The REST client is a singleton and initialized on first use.
- All operations return `ApiResponse<T>` wrapper for consistent error handling.
- Operations never throw exceptions; errors are returned in the `ApiResponse.error` field.
- Supports both regular key-value operations and Redis Hash operations.
- TTL defaults to 3600 seconds (1 hour) for `set` and `setHash` operations if not specified.
- Designed for use in server-side code only (do **not** import in client/browser code).

### Usage Examples

```typescript
import {
  redisRestGet,
  redisRestSet,
  redisRestDel,
  redisRestGetHash,
  redisRestSetHash,
} from '@maps-react/redis/rest-client';

// Set a value (with default TTL of 3600 seconds)
const setResult = await redisRestSet('user:123', JSON.stringify({ name: 'Bob' }));
if (setResult.success) {
  console.log('Value set successfully');
} else {
  console.error('Error setting value:', setResult.error);
}

// Set a value with custom TTL
const setResultWithTTL = await redisRestSet(
  'user:123',
  JSON.stringify({ name: 'Bob' }),
  { ttlSeconds: 7200 }
);

// Get a value
const getResult = await redisRestGet('user:123');
if (getResult.success && getResult.data) {
  const user = JSON.parse(getResult.data.value || '{}');
  console.log(user.name); // "Bob"
} else {
  console.error('Error getting value:', getResult.error);
}

// Delete a value
const delResult = await redisRestDel('user:123');
if (delResult.success && delResult.data) {
  console.log(`Deleted ${delResult.data.deletedCount} key(s)`);
}

// Hash operations
const hashSetResult = await redisRestSetHash(
  'user:profile:123',
  { name: 'Bob', email: 'bob@example.com' },
  { ttlSeconds: 3600 }
);

const hashGetResult = await redisRestGetHash('user:profile:123');
if (hashGetResult.success && hashGetResult.data) {
  console.log(hashGetResult.data.value); // { name: 'Bob', email: 'bob@example.com' }
}
```

### Error Handling

The REST client uses a standardized `ApiResponse<T>` wrapper that **never throws exceptions**. All errors are returned in the `ApiResponse.error` field. Always check the `success` field:

```typescript
const result = await redisRestSet('key', 'value');
if (!result.success) {
  // Handle error
  console.error('Operation failed:', result.error);
  return;
}
// Use result.data safely
```

**Error Response Format:**

When `success` is `false`, the `error` field contains a descriptive error message. Common error scenarios include:
- Network failures
- Invalid API responses
- Request entity too large (HTTP 413 or 500 with "request entity too large" message)
- Redis REST API errors

**Example with error handling:**

```typescript
import { redisRestGet, redisRestSet } from '@maps-react/redis/rest-client';

// Get operation
const getResult = await redisRestGet('key');
if (getResult.success && getResult.data) {
  console.log('Value:', getResult.data.value);
} else {
  console.error('Get failed:', getResult.error);
  // Handle specific error cases
  if (getResult.error?.includes('too large')) {
    console.error('Payload size exceeded limits');
  }
}

// Set operation
const setResult = await redisRestSet('key', 'value');
if (!setResult.success) {
  console.error('Set failed:', setResult.error);
}
```

### Troubleshooting

- **REST Client initialization:**  
  The REST client requires `REDIS_API_URL` and `REDIS_API_KEY` to be set. If both are missing, initialization will fail with an error.

---

## License

MIT
