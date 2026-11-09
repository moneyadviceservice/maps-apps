import { Container } from '@azure/cosmos';
import { searchById } from './searchById';

const mockItems = {
  query: jest.fn().mockImplementation(() => ({
    fetchAll: jest.fn().mockResolvedValue({
      resources: [
        {
          about: ['Partner', 'Male', ['09', '12', '1998'], '67'],
          income: { pageData: { netIncome: '3000', statePension: '800' } },
          outgoings: { pageData: { mortgage: '300', rent: '1000' } },
        },
      ],
    }),
  })),
};
const mockItem = jest.fn().mockReturnValue({});

const mockContainer: Partial<Container> = {
  items: mockItems as any,
  item: mockItem,
};
describe('Search in database by id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return the data saved in database', async () => {
    const data = await searchById(mockContainer as Container, 'test-id');

    if (data) {
      expect(data['about-you']).toEqual([
        'Partner',
        'Male',
        ['09', '12', '1998'],
        '67',
      ]);
      expect(data['income']).toEqual({
        pageData: { netIncome: '3000', statePension: '800' },
      });
      expect(data['essential-outgoings']).toEqual({
        pageData: { mortgage: '300', rent: '1000' },
      });
    }
  });

  it('should throw error if id is null', async () => {
    await expect(() =>
      searchById(mockContainer as Container, ''),
    ).rejects.toThrow('Cosmos database id is not defined');
  });

  it('should throw error if calling database fails', async () => {
    const mockItems = {
      query: {
        fetchAll: jest.fn().mockResolvedValue({}),
      },
    };

    const mockContainerError: Partial<Container> = {
      items: mockItems as any,
      item: mockItem,
    };
    const data = await searchById(mockContainerError as Container, 'test-id');
    expect(data).toBe(null);
  });

  it('should throw error if response is invalid', async () => {
    const mockItemsError = {
      query: jest.fn().mockImplementation(() => ({
        fetchAll: jest.fn().mockResolvedValue(() => ({
          error: 'Not valid response',
        })),
      })),
    };

    const mockContainerError: Partial<Container> = {
      items: mockItemsError as any,
      item: mockItem,
    };

    const spyConsole = jest.spyOn(console, 'error');

    const data = await searchById(mockContainerError as Container, 'test-id');

    expect(data).toBe(null);
    expect(spyConsole).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error fetching data from database with id (test-id)',
      ),
    );
  });
});
