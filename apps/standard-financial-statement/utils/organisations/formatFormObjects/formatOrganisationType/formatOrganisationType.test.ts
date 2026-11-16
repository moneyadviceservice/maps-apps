import { formatOrganisationType } from './formatOrganisationType';

describe('formatOrganisationType', () => {
  const mockOptions = [
    { value: 'charity', en: 'Charity' },
    { value: 'company', en: 'Company' },
    { value: 'other', en: 'Other' },
  ];

  const createMockFormData = (data: Record<string, string | undefined>) =>
    ({
      get: (key: string) => data[key],
    } as unknown as FormData);

  it('returns undefined if no type is selected', () => {
    const formData = createMockFormData({});
    const result = formatOrganisationType(formData, mockOptions);
    expect(result).toBeUndefined();
  });

  it('returns undefined if selected type is not in options', () => {
    const formData = createMockFormData({ type: 'unknown' });
    const result = formatOrganisationType(formData, mockOptions);
    expect(result).toBeUndefined();
  });

  it('returns correct result for a known type (not "other")', () => {
    const formData = createMockFormData({ type: 'charity' });
    const result = formatOrganisationType(formData, mockOptions);
    expect(result).toEqual({ title: 'Charity', type_other: '' });
  });

  it('returns correct result for "other" type with additional field', () => {
    const formData = createMockFormData({
      type: 'other',
      type_other: 'Cooperative',
    });
    const result = formatOrganisationType(formData, mockOptions);
    expect(result).toEqual({ title: 'Other', type_other: 'Cooperative' });
  });

  it('returns "other" with empty string if type_other is not set', () => {
    const formData = createMockFormData({
      type: 'other',
    });
    const result = formatOrganisationType(formData, mockOptions);
    expect(result).toEqual({ title: 'Other', type_other: '' });
  });
});
