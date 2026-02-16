import { Container } from '@azure/cosmos';

export const saveEntry = async <T>(
  container: Container,
  item: T,
  sessionID: string,
) => {
  if (!sessionID) throw new Error('Invalid database id');
  if (!item) throw new Error('Database entry undefined');
  try {
    const response = await container.items.create({ id: sessionID, ...item });
    return response;
  } catch (error) {
    console.error('Failed to save data to database');
    throw new Error(`${error}`);
  }
};
