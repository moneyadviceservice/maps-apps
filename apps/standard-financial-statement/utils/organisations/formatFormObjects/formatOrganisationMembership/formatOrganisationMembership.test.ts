import { formatOrganisationMembership } from './formatOrganisationMembership';

describe('formatOrganisationMembership', () => {
  const createMockFormData = (data: Record<string, string>) =>
    ({
      entries: () => Object.entries(data),
      get: (key: string) => data[key],
    } as unknown as FormData);

  it('returns an empty array when no membership fields are present', () => {
    const formData = createMockFormData({});
    const result = formatOrganisationMembership(formData);
    expect(result).toEqual([]);
  });

  it('returns one membership correctly formatted', () => {
    const formData = createMockFormData({
      'organisation_membership[0].key': 'coop',
      'organisation_membership[coop].title': 'Cooperative Association',
    });

    const result = formatOrganisationMembership(formData);

    expect(result).toEqual([
      {
        key: 'coop',
        title: 'Cooperative Association',
      },
    ]);
  });

  it('skips entry if title is missing', () => {
    const formData = createMockFormData({
      'organisation_membership[0].key': 'coop',
    });

    const result = formatOrganisationMembership(formData);

    expect(result).toEqual([]);
  });

  it('handles multiple membership entries correctly', () => {
    const formData = createMockFormData({
      'organisation_membership[0].key': 'coop',
      'organisation_membership[coop].title': 'Cooperative Association',
      'organisation_membership[1].key': 'union',
      'organisation_membership[union].title': 'Trade Union',
    });

    const result = formatOrganisationMembership(formData);

    expect(result).toEqual([
      { key: 'coop', title: 'Cooperative Association' },
      { key: 'union', title: 'Trade Union' },
    ]);
  });

  it('ignores invalid entry keys that don’t match the pattern', () => {
    const formData = createMockFormData({
      some_other_key: 'value',
      'organisation_membership.key': 'coop',
    });

    const result = formatOrganisationMembership(formData);

    expect(result).toEqual([]);
  });
});
