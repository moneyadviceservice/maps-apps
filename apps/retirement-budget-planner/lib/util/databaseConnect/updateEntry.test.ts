import { Container } from '@azure/cosmos';
import { updateEntry } from './updateEntry';

const mockContainer: Partial<Container> = {
  item: jest.fn().mockImplementation(() => ({
    replace: jest.fn(),
  })),
};
describe('Update data in Cosmos DB', () => {
  it('should update item in database', async () => {
    const id = 'test-session-id';
    const item = {
      data: 'Some test data',
    };
    const replacemock = jest.fn();
    (mockContainer.item as jest.Mock).mockImplementation(() => ({
      replace: replacemock,
    }));

    await updateEntry(mockContainer as Container, item, id);

    expect(replacemock).toHaveBeenCalled();
  });

  it('should throw an error when connection to database fail', async () => {
    (mockContainer.item as jest.Mock).mockImplementation(() => ({
      replace: jest.fn().mockRejectedValue({}),
    }));

    await expect(() =>
      updateEntry(mockContainer as Container, {}, 'test-id'),
    ).rejects.toThrow();
  });

  it('should throw an error data are undefined', async () => {
    await expect(() =>
      updateEntry(mockContainer as Container, undefined, 'test-id'),
    ).rejects.toThrow('Cosmos database entry is undefined');
  });
});
