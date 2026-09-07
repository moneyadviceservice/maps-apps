import { formatKeyTitleArrays } from './formatKeyTitleArrays';

describe('formatKeyTitleArrays', () => {
  const mockOptions = [
    { key: 'remote', en: 'Remote' },
    { key: 'in_person', en: 'In Person' },
    { key: 'hybrid', en: 'Hybrid' },
  ];

  const createMockFormData = (data: Record<string, string>) =>
    ({
      get: (key: string) => data[key],
    } as unknown as FormData);

  it('returns an empty array when no options are selected', () => {
    const formData = createMockFormData({});
    const result = formatKeyTitleArrays(formData, mockOptions);
    expect(result).toEqual([]);
  });

  it('returns only selected options', () => {
    const formData = createMockFormData({
      remote: 'on',
      hybrid: 'on',
    });

    const result = formatKeyTitleArrays(formData, mockOptions);

    expect(result).toEqual([
      { key: 'remote', title: 'Remote' },
      { key: 'hybrid', title: 'Hybrid' },
    ]);
  });

  it('ignores options that are not set to "on"', () => {
    const formData = createMockFormData({
      remote: 'on',
      in_person: 'off',
    });

    const result = formatKeyTitleArrays(formData, mockOptions);

    expect(result).toEqual([{ key: 'remote', title: 'Remote' }]);
  });

  it('handles formData values other than "on"', () => {
    const formData = createMockFormData({
      remote: 'yes',
      hybrid: '',
    });

    const result = formatKeyTitleArrays(formData, mockOptions);
    expect(result).toEqual([]);
  });
});
