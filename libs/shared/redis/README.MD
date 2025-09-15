# Shared Redis Client & Helpers

This module provides a **shared Redis client** and a set of simple helper functions for interacting with an Azure-managed Redis instance. It is designed for use in Node.js server-side code (e.g., Next.js API routes, serverless functions, or backend services).

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

## License

MIT
