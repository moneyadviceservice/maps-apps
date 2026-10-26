import { Container, CosmosClient } from '@azure/cosmos';
const connectToDB = async (
  endpoint: string | undefined,
  databaseID?: string,
  containerID?: string,
): Promise<Container> => {
  if (!databaseID || !containerID) {
    throw new Error('Database ID and container ID must be defined');
  }
  const connectString = endpoint;
  if (!connectString) {
    throw new Error('Database connection string must be defined');
  }

  try {
    const client = new CosmosClient(connectString);
    const database = client.database(databaseID);
    const container = database.container(containerID);
    return container;
  } catch (error) {
    console.error('Failed to connect to Cosmos DB');
    throw error;
  }
};

export const databaseClient = async () => {
  return await connectToDB(
    process.env.COSMOS_DB_CONECTION_STRING,
    process.env.COSMOS_DB_DATABASE_ID,
    process.env.COSMOS_DB_CONTAINER_ID,
  );
};
