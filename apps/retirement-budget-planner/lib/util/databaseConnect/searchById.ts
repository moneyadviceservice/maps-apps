import { Container } from '@azure/cosmos';

export const searchById = async (
  container: Container,
  id: string,
): Promise<Record<string, any> | null> => {
  if (!id) {
    throw new Error('Cosmos database id is not defined');
  }

  try {
    const response = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll();

    if (!response.resources) {
      throw new Error(`Error fetching data from database with id (${id})`);
    }

    let data = {};
    for (const resource of response.resources) {
      data = {
        ...(resource['about'] ? { 'about-you': resource['about'] } : {}),
        ...(resource['income'] ? { income: resource['income'] } : {}),
        ...(resource['outgoings']
          ? { 'essential-outgoings': resource['outgoings'] }
          : {}),
      };
    }
    return data;
  } catch (error) {
    console.error(`Failed to find entry in database: ${error}`);
    return null;
  }
};
