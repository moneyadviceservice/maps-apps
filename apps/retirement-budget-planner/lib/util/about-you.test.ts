import {
  partners,
  PARTNER2,
  updatePartners,
  convertFormData,
  findPartnerById,
  filterFirstPartner,
} from './about-you';
import { Partner } from 'lib/types/aboutYou';

describe('Partner utilities', () => {
  beforeEach(() => {
    updatePartners([]);
  });

  test('should update partners correctly', () => {
    updatePartners([PARTNER2]);
    expect(partners).toHaveLength(1);
    expect(partners[0].id).toBe(2);
  });

  test('should convert form data to Partner[]', () => {
    const formData = {
      id: ['1', '2'],
      name: ['Alice', 'Bob'],
      day: ['01', '02'],
      month: ['01', '02'],
      year: ['1990', '1992'],
      'gender[1]': 'female',
      retireAge: ['65', '67'],
      'gender[2]': 'male',
    };

    const result = convertFormData(formData);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alice');
    expect(result[1].gender).toBe('male');
  });

  test('should find partner by ID', () => {
    const samplePartners: Partner[] = [
      {
        id: 1,
        name: 'A',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
      {
        id: 2,
        name: 'B',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
    ];
    const found = findPartnerById(samplePartners, 2);
    expect(found?.name).toBe('B');
  });

  test('should filter out partner by ID', () => {
    const samplePartners: Partner[] = [
      {
        id: 1,
        name: 'A',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
      {
        id: 2,
        name: 'B',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
    ];
    const filtered = filterFirstPartner(samplePartners, 1);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(2);
  });

  test('should handle gender from array and key', () => {
    const formData = {
      id: ['0'],
      gender: ['female'],
    };
    const result = convertFormData(formData);
    expect(result[0].gender).toBe('female');
  });

  test('should handle gender from gender[0] key', () => {
    const formData = {
      id: ['0'],
      [`gender[0]`]: 'male',
    };
    const result = convertFormData(formData);
    expect(result[0].gender).toBe('male');
  });
});
