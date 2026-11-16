import { saveEntry } from './saveEntry';
import { Container } from '@azure/cosmos';

const mockCreate = jest.fn();
let mockItems = {
  create: mockCreate,
};
const mockItem = jest.fn().mockReturnValue({});

const mockContainer: Partial<Container> = {
  items: mockItems as any,
  item: mockItem,
};

describe('Save entry to database', () => {
  it('should save data to the database', async () => {
    await saveEntry(
      mockContainer as Container,
      { id: 'test-session-id', data: 'Some data' },
      'test-session-id',
    );

    expect(mockCreate).toHaveBeenCalledWith({
      id: 'test-session-id',
      data: 'Some data',
    });
  });

  it('should throw error if session id is null', async () => {
    await expect(() =>
      saveEntry(mockContainer as Container, { data: 'Some data' }, ''),
    ).rejects.toThrow('Invalid database id');
  });

  it('should throw error if item is null', async () => {
    await expect(() =>
      saveEntry(mockContainer as Container, null, 'test-id'),
    ).rejects.toThrow('Database entry undefined');
  });

  it('should throw error if saving to database fails', async () => {
    mockItems = {
      create: jest.fn().mockRejectedValue({}),
    };
    const mockContainerError: Partial<Container> = {
      items: mockItems as any,
      item: mockItem,
    };
    await expect(() =>
      saveEntry(
        mockContainerError as Container,
        { id: 'test-session-id', data: 'Some data' },
        'test-id',
      ),
    ).rejects.toThrow();
  });
});
