import { Container, CosmosClient, Database } from '@azure/cosmos';

/**
 * Connects to a Microsoft NoSQL (Azure Cosmos DB) database.
 * @returns A Promise that resolves to a CosmosClient instance.
 * @throws Will throw an error if the connection fails or if environment variables are not set.
 */
export async function connectToDatabase(): Promise<{
  client: CosmosClient;
  database: Database;
  container: Container;
}> {
  const connectionString = process.env.DB_CONNECTION_STRING;
  const databaseId = process.env.BUDGET_PLANNER_DB_DATABASE_ID;
  const containerId = process.env.BUDGET_PLANNER_DB_CONTAINER_ID;

  if (!connectionString || !databaseId || !containerId) {
    throw new Error(
      'DB_CONNECTION_STRING, BUDGET_PLANNER_DB_DATABASE_ID, or BUDGET_PLANNER_DB_CONTAINER_ID is not defined in the environment variables',
    );
  }

  try {
    const client = new CosmosClient(connectionString);
    const database = client.database(databaseId);
    const container = database.container(containerId);

    return { client, database, container };
  } catch (error) {
    console.error(
      'Error connecting to the database:',
      (error as Error).message,
    );
    throw new Error('Failed to connect to the database');
  }
}
