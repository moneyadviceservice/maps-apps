import { redisGet } from '@maps-react/redis/helpers';
import { getPartnersFromRedis } from './aboutYouCache';
import { Partner } from 'lib/types/aboutYou';

jest.mock('@maps-react/redis/helpers', () => ({
  redisGet: jest.fn().mockResolvedValue({}),
}));

const mockPartners = [
  {
    id: 10,
    name: 'X',
    dob: { day: '01', month: '01', year: '1980' },
    gender: 'male',
    retireAge: '67',
  },
  {
    id: 11,
    name: 'XY',
    dob: { day: '01', month: '10', year: '1986' },
    gender: 'female',
    retireAge: '65',
  },
];
describe('Utility function for Aboutyou data to save to Redis', () => {
  it('should get the about data from redis', async () => {
    (redisGet as jest.Mock).mockResolvedValue(JSON.stringify(mockPartners));
    const partners = await getPartnersFromRedis('SGBSGGG');
    expect(partners.length).toBe(2);
    expect(partners[0].name).toBe('X');
  });

  it('should return default values for one partner if request returns null', async () => {
    (redisGet as jest.Mock).mockResolvedValue(null);
    const partner: Partner = await getPartnersFromRedis('SGBSGGG');
    expect(partner.id).toBe(1);
    expect(partner.retireAge).toBe('');
  });

  it('should throw error when the request fails', () => {
    (redisGet as jest.Mock).mockRejectedValue({});
    expect(async () => await getPartnersFromRedis('SGBSGGG')).rejects.toThrow();
  });

  it('should return null if sessinId is invalid', async () => {
    const nullResponse = await getPartnersFromRedis('');
    expect(nullResponse).toBeNull();
  });
});
