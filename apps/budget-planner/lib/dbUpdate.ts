import { Container } from '@azure/cosmos';

import { connectToDatabase } from './dbConnect';
import { BudgetData, validateBudgetData } from './dbInsert';
import { searchBudgetDataBySessionId } from './dbSearch';

// Updates a budget data object in the database based on sessionId.
export async function updateBudgetData(
  sessionId: string,
  data: Partial<BudgetData>,
): Promise<BudgetData | null> {
  let container: Container;

  if (!validateBudgetData({ ...data, sessionId } as BudgetData)) {
    console.error('Invalid budget data:', data);
    throw new Error('Budget data is invalid');
  }

  try {
    ({ container } = await connectToDatabase());

    const existingItem = await searchBudgetDataBySessionId(sessionId);

    if (!existingItem) {
      return null;
    }

    const updatedItem = { ...existingItem, ...data };

    if (existingItem.id) {
      const { resource: updatedResource } = await container
        .item(existingItem.id)
        .replace<BudgetData>(updatedItem);

      if (updatedResource) {
        return updatedResource;
      }
    }

    throw new Error('Updated item is undefined');
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unknown error';
    console.error('Error updating data:', errorMessage);
    throw new Error(`Failed to update data in the database: ${errorMessage}`);
  }
}
