import { Account } from './hydrateAccountFromJson';

type Result = {
  data: {
    lastModified: string;
    items: Account[];
  };
};

export async function fetchAccounts(url: string): Promise<Result> {
  const fetchJson = async (): Promise<unknown> => {
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Blob storage returned ${res.status}`);

    return res.json();
  };

  try {
    const body = await (async () => {
      const body = (await fetchJson()) as {
        ['jcr:lastModified']?: string;
        items?: Account[];
      };

      return {
        lastModified: body['jcr:lastModified'],
        items: body.items,
      };
    })();

    if (!body?.lastModified || !Array.isArray(body.items)) {
      throw new Error('Blob storage returned malformed payload');
    }
    return {
      data: { lastModified: body.lastModified, items: body.items },
    };
  } catch (error) {
    throw new Error('Failed to fetch accounts', {
      cause: { error },
    });
  }
}
