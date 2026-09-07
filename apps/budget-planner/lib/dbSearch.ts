import { Container } from '@azure/cosmos';

import { connectToDatabase } from './dbConnect';
import { BudgetData } from './dbInsert';

// Searches the container using the sessionId and returns an item
export async function searchBudgetDataBySessionId(
  sessionId: string,
): Promise<BudgetData | null> {
  let container: Container;

  try {
    ({ container } = await connectToDatabase());

    const querySpec = {
      query: 'SELECT * FROM c WHERE c.sessionId = @sessionId',
      parameters: [
        {
          name: '@sessionId',
          value: sessionId,
        },
      ],
    };

    const { resources: items } = await container.items
      .query<BudgetData>(querySpec)
      .fetchAll();

    if (items.length > 0) {
      return items[0];
    }
    return null;
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unknown error';
    console.error('Error searching data:', errorMessage);
    throw new Error(`Failed to search data in the database: ${errorMessage}`);
  }
}
