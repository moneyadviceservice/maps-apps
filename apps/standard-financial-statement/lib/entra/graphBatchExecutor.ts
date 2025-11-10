interface GraphBatchRequest {
  id: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface GraphBatchResponseItem {
  id: string;
  status: number;
  headers: Record<string, string>;
  body?: unknown;
}

export async function executeGraphBatchRequest(
  token: string,
  batchRequests: GraphBatchRequest[],
): Promise<GraphBatchResponseItem[]> {
  try {
    const batchRes = await fetch('https://graph.microsoft.com/v1.0/$batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requests: batchRequests }),
    });

    if (!batchRes.ok) {
      const errorDetail = await batchRes.json();
      console.error('Graph batch request failed:', errorDetail);
      throw new Error(
        `Graph batch request failed: ${JSON.stringify(errorDetail)}`,
      );
    }

    const batchData: { responses: GraphBatchResponseItem[] } =
      await batchRes.json();

    batchData.responses.sort(
      (a: GraphBatchResponseItem, b: GraphBatchResponseItem) =>
        parseInt(a.id) - parseInt(b.id),
    );

    return batchData.responses;
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error('Unknown error during batch execution');
    console.error('Error executing Graph batch request:', err);
    throw err;
  }
}
