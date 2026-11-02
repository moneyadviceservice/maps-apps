import {
  getLocalData,
  getProviders,
  ProviderJSON,
  ProviderType,
} from './getData';

describe('getLocalData', () => {
  const mockProviderJSON: ProviderJSON = {
    id: '123',
    name: 'Test Organisation',
    address_street_address: '123 Test Street',
    address_locality: 'Test City',
    address_region: 'Test Region',
    address_postcode: 'TE1 1ST',
    lat: '51.5074',
    lng: '-0.1278',
    email_address: 'test@example.com',
    website_address: 'https://example.com',
    minicom: '01234567890',
    notes: 'Test notes in English',
    provides_face_to_face: 'true',
    provides_telephone: 'false',
    provides_web: 'TRUE',
    created_at: '2023-01-01',
    updated_at: '2023-01-02',
    telephone_en: '01234567890',
    telephone_cy: '01234567891',
    region_england: 'true',
    region_northern_ireland: 'false',
    region_scotland: 'FALSE',
    region_wales: 'True',
    website_address_text: 'Example Website',
    notes_cy: 'Test notes in Welsh',
    debt_advice_locator_organisation_standard_id: 'STANDARD123',
    display_in_accredited_list: 'true',
    standard_ids: 'STD1,STD2',
    distance: 5.2,
  };

  it('should transform ProviderJSON to ProviderType correctly', async () => {
    const result = await getLocalData([mockProviderJSON]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 123,
      name: 'Test Organisation',
      streetAddress: '123 Test Street',
      addressLocality: 'Test City',
      addressRegion: 'Test Region',
      postcode: 'TE1 1ST',
      lat: 51.5074,
      lng: -0.1278,
      emailAddress: 'test@example.com',
      telephoneNumber: '01234567890',
      websiteAddress: 'https://example.com',
      notesEN: 'Test notes in English',
      notesCY: 'Test notes in Welsh',
      providesFaceToFace: true,
      providesTelephone: false,
      providesWeb: true,
      availableInEngland: true,
      availableInNorthernIreland: false,
      availableInScotland: false,
      availableInWales: true,
      distance: 5.2,
    });
  });

  it('should handle invalid lat/lng values', async () => {
    const invalidData: ProviderJSON = {
      ...mockProviderJSON,
      lat: 'invalid',
      lng: '',
    };

    const result = await getLocalData([invalidData]);

    expect(result[0].lat).toBeNull();
    expect(result[0].lng).toBeNull();
  });

  it('should handle missing distance field', async () => {
    const dataWithoutDistance: ProviderJSON = {
      ...mockProviderJSON,
      distance: undefined,
    };

    const result = await getLocalData([dataWithoutDistance]);

    expect(result[0].distance).toBe(0);
  });

  it('should handle distance as string', async () => {
    const dataWithStringDistance: ProviderJSON = {
      ...mockProviderJSON,
      distance: '10.5',
    };

    const result = await getLocalData([dataWithStringDistance]);

    expect(result[0].distance).toBe('10.5');
  });

  it('should handle case-insensitive boolean strings', async () => {
    const mixedCaseData: ProviderJSON = {
      ...mockProviderJSON,
      provides_face_to_face: 'TrUe',
      provides_telephone: 'FALSE',
      provides_web: 'false',
      region_england: 'TRUE',
      region_northern_ireland: 'False',
      region_scotland: 'true',
      region_wales: 'FALSE',
    };

    const result = await getLocalData([mixedCaseData]);

    expect(result[0].providesFaceToFace).toBe(true);
    expect(result[0].providesTelephone).toBe(false);
    expect(result[0].providesWeb).toBe(false);
    expect(result[0].availableInEngland).toBe(true);
    expect(result[0].availableInNorthernIreland).toBe(false);
    expect(result[0].availableInScotland).toBe(true);
    expect(result[0].availableInWales).toBe(false);
  });

  it('should handle multiple providers', async () => {
    const provider2: ProviderJSON = {
      ...mockProviderJSON,
      id: '456',
      name: 'Second Organisation',
    };

    const result = await getLocalData([mockProviderJSON, provider2]);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(123);
    expect(result[0].name).toBe('Test Organisation');
    expect(result[1].id).toBe(456);
    expect(result[1].name).toBe('Second Organisation');
  });

  it('should handle empty array', async () => {
    const result = await getLocalData([]);

    expect(result).toEqual([]);
  });
});

describe('getProviders', () => {
  const mockProviders: ProviderType[] = [
    {
      id: 1,
      name: 'England Web Provider',
      streetAddress: 'Street 1',
      addressLocality: 'City 1',
      addressRegion: 'Region 1',
      postcode: 'PC1',
      lat: 51.5,
      lng: -0.1,
      emailAddress: 'email1@test.com',
      telephoneNumber: '01234567890',
      websiteAddress: 'https://test1.com',
      notesEN: 'Notes 1',
      notesCY: 'Notes 1 CY',
      providesFaceToFace: false,
      providesTelephone: false,
      providesWeb: true,
      availableInEngland: true,
      availableInNorthernIreland: false,
      availableInScotland: false,
      availableInWales: false,
      distance: 1,
    },
    {
      id: 2,
      name: 'Wales Telephone Provider',
      streetAddress: 'Street 2',
      addressLocality: 'City 2',
      addressRegion: 'Region 2',
      postcode: 'PC2',
      lat: 52.5,
      lng: -3.1,
      emailAddress: 'email2@test.com',
      telephoneNumber: '01234567891',
      websiteAddress: 'https://test2.com',
      notesEN: 'Notes 2',
      notesCY: 'Notes 2 CY',
      providesFaceToFace: false,
      providesTelephone: true,
      providesWeb: false,
      availableInEngland: false,
      availableInNorthernIreland: false,
      availableInScotland: false,
      availableInWales: true,
      distance: 2,
    },
    {
      id: 3,
      name: 'Scotland Face-to-Face Provider',
      streetAddress: 'Street 3',
      addressLocality: 'City 3',
      addressRegion: 'Region 3',
      postcode: 'PC3',
      lat: 55.5,
      lng: -3.1,
      emailAddress: 'email3@test.com',
      telephoneNumber: '01234567892',
      websiteAddress: 'https://test3.com',
      notesEN: 'Notes 3',
      notesCY: 'Notes 3 CY',
      providesFaceToFace: true,
      providesTelephone: false,
      providesWeb: false,
      availableInEngland: false,
      availableInNorthernIreland: false,
      availableInScotland: true,
      availableInWales: false,
      distance: 3,
    },
    {
      id: 4,
      name: 'Northern Ireland All Services',
      streetAddress: 'Street 4',
      addressLocality: 'City 4',
      addressRegion: 'Region 4',
      postcode: 'PC4',
      lat: 54.5,
      lng: -6.1,
      emailAddress: 'email4@test.com',
      telephoneNumber: '01234567893',
      websiteAddress: 'https://test4.com',
      notesEN: 'Notes 4',
      notesCY: 'Notes 4 CY',
      providesFaceToFace: true,
      providesTelephone: true,
      providesWeb: true,
      availableInEngland: false,
      availableInNorthernIreland: true,
      availableInScotland: false,
      availableInWales: false,
      distance: 4,
    },
    {
      id: 5,
      name: 'Multi-region Provider',
      streetAddress: 'Street 5',
      addressLocality: 'City 5',
      addressRegion: 'Region 5',
      postcode: 'PC5',
      lat: 53.5,
      lng: -2.1,
      emailAddress: 'email5@test.com',
      telephoneNumber: '01234567894',
      websiteAddress: 'https://test5.com',
      notesEN: 'Notes 5',
      notesCY: 'Notes 5 CY',
      providesFaceToFace: true,
      providesTelephone: true,
      providesWeb: true,
      availableInEngland: true,
      availableInNorthernIreland: false,
      availableInScotland: false,
      availableInWales: true,
      distance: 5,
    },
  ];

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('filterByCountryAndType', () => {
    it('should filter providers for England (0) and Web services (0)', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);
      const result = filterByCountryAndType('0', '0');

      const expectedProviders = result.filter(
        (p) => p.availableInEngland && p.providesWeb,
      );

      expect(expectedProviders).toHaveLength(2);
      expect(expectedProviders.map((p) => p.id)).toContain(1);
      expect(expectedProviders.map((p) => p.id)).toContain(5);
    });

    it('should filter providers for Wales (2) and Telephone services (1)', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);
      const result = filterByCountryAndType('2', '1');

      const expectedProviders = result.filter(
        (p) => p.availableInWales && p.providesTelephone,
      );

      expect(expectedProviders).toHaveLength(2);
      expect(expectedProviders.map((p) => p.id)).toContain(2);
      expect(expectedProviders.map((p) => p.id)).toContain(5);
    });

    it('should filter providers for Scotland (1) and Face-to-Face services (2)', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);
      const result = filterByCountryAndType('1', '2');

      const expectedProviders = result.filter(
        (p) => p.availableInScotland && p.providesFaceToFace,
      );

      expect(expectedProviders).toHaveLength(1);
      expect(expectedProviders[0].id).toBe(3);
    });

    it('should filter providers for Northern Ireland (3) and all service types', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);

      const webResult = filterByCountryAndType('3', '0');
      expect(webResult).toHaveLength(1);
      expect(webResult[0].id).toBe(4);

      const telephoneResult = filterByCountryAndType('3', '1');
      expect(telephoneResult).toHaveLength(1);
      expect(telephoneResult[0].id).toBe(4);

      const faceToFaceResult = filterByCountryAndType('3', '2');
      expect(faceToFaceResult).toHaveLength(1);
      expect(faceToFaceResult[0].id).toBe(4);
    });

    it('should return empty array for invalid country code', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);
      const result = filterByCountryAndType('99', '0');

      expect(result).toEqual([]);
    });

    it('should return empty array for invalid service type', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);
      const result = filterByCountryAndType('0', '99');

      expect(result).toEqual([]);
    });

    it('should return empty array when no providers match criteria', async () => {
      const singleProvider: ProviderType[] = [
        {
          ...mockProviders[0],
          availableInEngland: false,
        },
      ];

      const { filterByCountryAndType } = await getProviders(singleProvider);
      const result = filterByCountryAndType('0', '0');

      expect(result).toEqual([]);
    });

    it('should shuffle the results', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);

      jest.spyOn(Math, 'random').mockReturnValue(0.1);
      const result1 = filterByCountryAndType('0', '0');

      jest.spyOn(Math, 'random').mockReturnValue(0.9);
      const result2 = filterByCountryAndType('0', '0');

      expect(result1.length).toBe(result2.length);
    });

    it('should handle empty provider array', async () => {
      const { filterByCountryAndType } = await getProviders([]);
      const result = filterByCountryAndType('0', '0');

      expect(result).toEqual([]);
    });

    it('should handle providers available in multiple regions', async () => {
      const { filterByCountryAndType } = await getProviders(mockProviders);

      const englandResult = filterByCountryAndType('0', '2');
      const walesResult = filterByCountryAndType('2', '2');

      expect(englandResult.map((p) => p.id)).toContain(5);
      expect(walesResult.map((p) => p.id)).toContain(5);
    });
  });
});
