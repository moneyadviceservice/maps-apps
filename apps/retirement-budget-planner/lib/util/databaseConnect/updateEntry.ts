import { Container, ItemResponse } from '@azure/cosmos';

export type DatabaseClientType = {
  id: string;
};

import type { ItemDefinition } from '@azure/cosmos';

export const updateEntry = async <T extends ItemDefinition>(
  container: Container,
  item: T | undefined,
  id: string,
): Promise<ItemResponse<T>> => {
  if (!item) throw new Error('Cosmos database entry is undefined');

  try {
    const response = await container.item(id).replace({ id, ...item });
    return response as ItemResponse<T>;
  } catch (error) {
    console.error('Failed to update entry in database');
    throw new Error(`${error}`);
  }
};
