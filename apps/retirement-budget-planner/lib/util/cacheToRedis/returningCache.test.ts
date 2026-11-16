import { databaseClient, searchById } from 'lib/util/databaseConnect';
import { setPartnersInRedis, setDataToRedis } from 'lib/util/cacheToRedis';
import { returningCache } from './returningCache';

jest.mock('lib/util/cacheToRedis', () => ({
  setDataToRedis: jest.fn(),
  setPartnersInRedis: jest.fn(),
}));

jest.mock('lib/util/databaseConnect', () => ({
  databaseClient: jest.fn(),
  searchById: jest.fn(),
}));

const SESSIONID = 'test-session-id';
const mockReturnValue = {
  'about-you': ['Josh', 'Male', ['3', '10', '1998'], '68'],
  income: {
    pageData: {
      workIncome: 2000,
      statePension: 500,
      statePensionFrequency: 'quarter',
    },
  },
  'essential-outgoings': {
    pageData: {
      mortgage: 400,
      rent: 1000,
    },
  },
};
describe('Returning back to tool caching', () => {
  it('should get data from database and save to Redis', async () => {
    const mockDBClient = jest.fn();
    const mockSetPartner = jest.fn();
    const mockSetData = jest.fn();
    (databaseClient as jest.Mock).mockImplementation(mockDBClient);
    (searchById as jest.Mock).mockReturnValue(mockReturnValue);
    (setPartnersInRedis as jest.Mock).mockImplementation(mockSetPartner);
    (setDataToRedis as jest.Mock).mockImplementation(mockSetData);

    const data = await returningCache(true, SESSIONID, 'about-you');

    expect(mockDBClient).toHaveBeenCalled();
    expect(mockSetPartner).toHaveBeenCalled();
    expect(mockSetData).toHaveBeenCalled();

    expect(data).toEqual(mockReturnValue['about-you']);
  });

  it('should return null if connection to database fail', async () => {
    (databaseClient as jest.Mock).mockRejectedValue({});

    const data = await returningCache(true, SESSIONID, 'about-you');
    expect(data).toBeNull();
  });

  it('should return null if entry is not in database', async () => {
    (searchById as jest.Mock).mockRejectedValue({});

    const data = await returningCache(true, SESSIONID, 'about-you');
    expect(data).toBeNull();
  });

  it('should return null if entry is not in database', async () => {
    (searchById as jest.Mock).mockRejectedValue({});

    const data = await returningCache(true, SESSIONID, 'about-you');
    expect(data).toBeNull();
  });

  it('should return null it fails to save partner details to redis', async () => {
    const mockDBClient = jest.fn();

    (databaseClient as jest.Mock).mockImplementation(mockDBClient);
    (searchById as jest.Mock).mockReturnValue(mockReturnValue);
    (setPartnersInRedis as jest.Mock).mockRejectedValue({});

    const data = await returningCache(true, SESSIONID, 'about-you');

    expect(mockDBClient).toHaveBeenCalled();
    expect(data).toBeNull();
  });

  it('should return null it fails to save income/essential data to redis', async () => {
    const mockDBClient = jest.fn();
    const mockSetPartner = jest.fn();
    (databaseClient as jest.Mock).mockImplementation(mockDBClient);
    (searchById as jest.Mock).mockReturnValue(mockReturnValue);
    (setPartnersInRedis as jest.Mock).mockImplementation(mockSetPartner);
    (setDataToRedis as jest.Mock).mockRejectedValue({});

    const data = await returningCache(true, SESSIONID, 'about-you');

    expect(mockDBClient).toHaveBeenCalled();
    expect(mockSetPartner).toHaveBeenCalled();
    expect(data).toBeNull();
  });
});
