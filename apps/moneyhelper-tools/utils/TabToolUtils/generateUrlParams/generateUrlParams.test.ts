import { generateUrlParams } from './generateUrlParams';
import { addObjectKeyPrefix } from '../addObjectKeyPrefix';

jest.mock('../addObjectKeyPrefix', () => ({
  addObjectKeyPrefix: jest.fn(),
}));

describe('generateUrlParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate correct URL parameters when formData is provided', () => {
    const formData = {
      name: 'John',
      age: '30',
    };

    (addObjectKeyPrefix as jest.Mock).mockReturnValue({
      'q-name': 'John',
      'q-age': '30',
    });

    const result = generateUrlParams(formData);

    expect(addObjectKeyPrefix).toHaveBeenCalledWith(formData, 'q-');
    expect(result).toBe('q-name=John&q-age=30');
  });

  it('should return an empty string when formData is empty', () => {
    const formData = {};

    (addObjectKeyPrefix as jest.Mock).mockReturnValue({});

    const result = generateUrlParams(formData);

    expect(addObjectKeyPrefix).toHaveBeenCalledWith(formData, 'q-');
    expect(result).toBe('');
  });
});
