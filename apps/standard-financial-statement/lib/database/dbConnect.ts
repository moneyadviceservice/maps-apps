import { Container, CosmosClient, Database } from '@azure/cosmos';

/**
 * Connects to a Microsoft NoSQL (Azure Cosmos DB) database.
 * @returns A Promise that resolves to an object containing the CosmosClient, Database, and Container instances.
 * @throws Will throw an error if the connection fails or if environment variables are not set.
 */
export async function dbConnect(): Promise<{
  client: CosmosClient;
  database: Database;
  container: Container;
}> {
  const connectionString = process.env.DB_CONNECTION_STRING;
  const databaseId = process.env.SFS_DB_DATABASE_ID;
  const containerId = process.env.SFS_DB_CONTAINER_ID;

  if (!connectionString || !databaseId || !containerId) {
    const missingEnvVars = [];
    if (!connectionString) missingEnvVars.push('DB_CONNECTION_STRING');
    if (!databaseId) missingEnvVars.push('SFS_DB_DATABASE_ID');
    if (!containerId) missingEnvVars.push('SFS_DB_CONTAINER_ID');
    throw new Error(
      `Missing environment variables: ${missingEnvVars.join(', ')}`,
    );
  }

  try {
    const client = new CosmosClient(connectionString);
    const database = client.database(databaseId);
    const container = database.container(containerId);

    return { client, database, container };
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unknown error';
    console.error('Error connecting to the database:', errorMessage);
    throw new Error(`Failed to connect to the database: ${errorMessage}`);
  }
}
