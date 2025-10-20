import { Container, CosmosClient, ItemResponse } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';

export type DatabaseClientType = {
  id: string;
};

/**
 * Conenct to database
 * @param endpoint
 * @param databaseID
 * @param containerID
 * @returns database container
 */
const connectToDatabase = async (
  endpoint: string | undefined,
  databaseID: string,
  containerID: string,
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
    throw new Error('Error connecting to database: ' + error);
  }
};

/**
 *
 * @param databaseID
 * @param containerID
 * @returns methods to interact with the database
 */
export const databaseClient = async (
  databaseID: string,
  containerID: string,
) => {
  const container = await connectToDatabase(
    process.env.DB_ENDPOINT,
    databaseID,
    containerID,
  );

  /**
   * Add an object to the database
   * @param item
   * @returns the object added to the database or error
   */
  const insertItemToDatabase = async <T>(
    item: T,
    sessionID?: string,
  ): Promise<Record<string, any>> => {
    const id = sessionID ?? uuidv4();
    return await container.items
      .create({ id, ...item })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error('Error inserting item to database: ', error);
      });
  };

  /**
   * Search database by ID
   * @param urn
   * @returns a list of objects that match the ID or error
   */
  const searchById = async (urn: string): Promise<Record<string, any>> => {
    if (!urn) {
      throw new Error('ID must be defined');
    }
    return await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.urn = @urn',
        parameters: [{ name: '@urn', value: urn }],
      })
      .fetchAll()
      .then((response) => {
        if (!response.resources || response.resources.length !== 1) {
          throw new Error(
            `Error fetching data from database or (${urn}) found`,
          );
        }

        return response.resources.pop();
      })
      .catch((error) => {
        throw new Error('Error fetching data from database', error);
      });
  };

  /**
   * Update an existing object in the database
   * @param item
   */
  const updateItemInDatabase = async <T>(
    item: T & DatabaseClientType,
  ): Promise<ItemResponse<T & DatabaseClientType>> => {
    return container
      .item(item.id)
      .replace({ ...item })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return {
    container,
    insertItemToDatabase,
    searchById,
    updateItemInDatabase,
  };
};
