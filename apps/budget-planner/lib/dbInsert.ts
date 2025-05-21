import { Container, Resource } from '@azure/cosmos';

import { connectToDatabase } from './dbConnect';

// Needs expanding
interface Income {
  [key: string]: string;
}

interface HouseholdBills {
  [key: string]: string;
}

interface LivingCosts {
  [key: string]: string;
}

interface Travel {
  [key: string]: string;
}

interface Leisure {
  [key: string]: string;
}

interface FinanceInsurance {
  [key: string]: string;
}

interface FamilyFriends {
  [key: string]: string;
}

export interface BudgetData {
  sessionId: string;
  id?: string;
  lastAccessed: Date;
  income: Income;
  'household-bills': HouseholdBills;
  'living-costs': LivingCosts;
  'finance-insurance': FinanceInsurance;
  'family-friends': FamilyFriends;
  travel: Travel;
  leisure: Leisure;
  reset?: string;
}

// Define the response type from the database
interface InsertedItem extends Resource {
  sessionId: string;
}

//Validates the budget data object.
export function validateBudgetData(data: BudgetData): boolean {
  if (!data.sessionId || typeof data.sessionId !== 'string') return false;
  if (!(data.lastAccessed instanceof Date)) return false;

  return true;
}

//Inserts a budget data object into the database.
export async function insertBudgetData(
  data: BudgetData,
): Promise<InsertedItem | null> {
  let container: Container;

  // Validate the budget data before proceeding
  if (!validateBudgetData(data)) {
    console.error('Invalid budget data:', data);
    throw new Error('Budget data is invalid');
  }

  try {
    ({ container } = await connectToDatabase());

    const { resource: insertedItem } = await container.items.create<BudgetData>(
      data,
    );

    if (insertedItem) {
      return insertedItem;
    }

    throw new Error('Inserted item is undefined');
  } catch (error) {
    // Check if the error is from the Cosmos SDK or a generic error
    const errorMessage = (error as Error).message || 'Unknown error';
    console.error('Error inserting data:', errorMessage);
    throw new Error(`Failed to insert data into the database: ${errorMessage}`);
  }
}
