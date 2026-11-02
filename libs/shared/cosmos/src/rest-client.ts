export interface ApiResponse<T> {
  data?: T;
  /** Set only on failure. */
  error?: string;
  /** HTTP status, e.g. 404 (not found) or 409 (already exists). Unset if the request never completed. */
  status?: number;
}

/** Request body: any JSON object. */
export type CosmosDocument = Record<string, unknown>;

/** Fields kept on every stored document; Cosmos internals (`_rid`, `_etag`, ...) are stripped. */
export interface CosmosSystemFields {
  id: string;
  sessionId: string;
}

const INTERNAL_FIELDS = ['_rid', '_self', '_etag', '_attachments', '_ts'];

export type StoredDocument<T extends CosmosDocument = CosmosDocument> = T &
  CosmosSystemFields;

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

class CosmosApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'CosmosApiError';
  }
}

const getConfig = () => {
  const baseUrl = process.env.COSMOS_API_URL;
  const apiKey = process.env.COSMOS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      'COSMOS_API_URL or COSMOS_API_KEY environment variables are missing',
    );
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
};

const buildRequest = (
  method: HttpMethod,
  sessionId: string,
  body?: CosmosDocument,
) => {
  const { baseUrl, apiKey } = getConfig();

  return {
    url: `${baseUrl}/api/${encodeURIComponent(sessionId)}`,
    init: {
      method,
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  };
};

const stripInternalFields = <T>(value: T): T => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value;
  }

  const copy = { ...value } as Record<string, unknown>;
  INTERNAL_FIELDS.forEach((field) => delete copy[field]);
  return copy as T;
};

const parseBody = <T>(text: string): T => {
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};

// Errors use `message`; authentication errors use `error`.
const toError = async (response: Response, method: HttpMethod) => {
  const body = parseBody<{ message?: string; error?: string } | string>(
    await response.text(),
  );
  const detail =
    typeof body === 'object' && body
      ? body.message ?? body.error
      : body || response.statusText;

  console.error(`[Cosmos REST] ${method} failed:`, response.status, detail);

  return new CosmosApiError(
    `Cosmos REST API error: ${response.status} - ${detail}`,
    response.status,
  );
};

const fetchRequest = async <T>(
  method: HttpMethod,
  sessionId: string,
  body?: CosmosDocument,
): Promise<ApiResponse<T>> => {
  try {
    const { url, init } = buildRequest(method, sessionId, body);
    const response = await fetch(url, init);

    if (!response.ok) {
      throw await toError(response, method);
    }

    return {
      status: response.status,
      data: stripInternalFields(parseBody<T>(await response.text())),
    };
  } catch (error) {
    console.error(`[Cosmos REST] ${method} error:`, error);
    return {
      status: error instanceof CosmosApiError ? error.status : undefined,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/** Creates a session (POST, 201). Fails with 409 if the session already exists. */
export const cosmosCreateSession = <T extends CosmosDocument = CosmosDocument>(
  sessionId: string,
  body: T,
) => fetchRequest<StoredDocument<T>>('POST', sessionId, body);

/** Reads a session (GET, 200). Fails with 404 if not found. */
export const cosmosGetSession = <T extends CosmosDocument = CosmosDocument>(
  sessionId: string,
) => fetchRequest<StoredDocument<T>>('GET', sessionId);

/** Replaces the whole document (PUT, 200); fields not in the body are removed. Fails with 404 if not found. */
export const cosmosReplaceSession = <T extends CosmosDocument = CosmosDocument>(
  sessionId: string,
  body: T,
) => fetchRequest<StoredDocument<T>>('PUT', sessionId, body);

/** Merges top-level fields into the document (PATCH, 200); nested objects are replaced, not merged. Fails with 404 if not found. */
export const cosmosPatchSession = <T extends CosmosDocument = CosmosDocument>(
  sessionId: string,
  body: Partial<T>,
) => fetchRequest<StoredDocument<T>>('PATCH', sessionId, body);

/** Deletes a session (DELETE, 204, no body). Fails with 404 if not found. */
export const cosmosDeleteSession = (sessionId: string) =>
  fetchRequest<undefined>('DELETE', sessionId);
