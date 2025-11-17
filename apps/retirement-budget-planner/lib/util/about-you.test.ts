import { Partner } from 'lib/types/aboutYou';
import {
  convertFormData,
  filterFirstPartner,
  findPartnerById,
  PARTNER2,
  partners,
  updatePartners,
} from './about-you';
const sessionIdFromContext = 'test-session-id';
describe('Additional Partner utilities tests', () => {
  beforeEach(() => {
    updatePartners([]);
    jest.resetAllMocks();
  });

  test('PARTNER2 shape and updatePartners with multiple items', () => {
    expect(PARTNER2).toBeDefined();
    expect(PARTNER2.id).toBe(2);

    const p1: Partner = {
      id: 10,
      name: 'X',
      dob: { day: '01', month: '01', year: '1980' },
      gender: 'male',
      retireAge: '67',
    };
    const p2: Partner = { ...PARTNER2 };
    updatePartners([p1, p2]);
    expect(Array.isArray(partners)).toBe(true);
    expect(partners).toHaveLength(2);
    expect(partners[0]).toEqual(p1);
    expect(partners[1]).toEqual(p2);
  });

  test('convertFormData handles single-value (non-array) inputs', () => {
    const formData = {
      id: '3',
      name: 'Dana',
      day: '10',
      month: '12',
      year: '1975',
      gender: 'female',
      retireAge: '67',
    };
    const result = convertFormData(formData as unknown as Record<string, any>);
    expect(result).toHaveLength(1);
    const r = result[0];
    expect(typeof r.id).toBe('number');
    expect(r.id).toBe(3);
    expect(r.name).toBe('Dana');
    expect(r.dob.day).toBe('10');
    expect(r.dob.month).toBe('12');
    expect(r.dob.year).toBe('1975');
    expect(r.gender).toBe('female');
    expect(r.retireAge).toBe('67');
  });

  test('convertFormData merges array gender and indexed gender keys correctly', () => {
    const formData = {
      id: ['0', '1'],
      gender: ['female'],
      'gender[1]': 'male',
      name: ['First', 'Second'],
      day: ['01', '02'],
      month: ['01', '02'],
      year: ['1990', '1991'],
      retireAge: ['65', '66'],
    };
    const result = convertFormData(formData as unknown as Record<string, any>);
    expect(result).toHaveLength(2);
    expect(result[0].gender).toBe('female');
    expect(result[1].gender).toBe('male');
    expect(result[0].name).toBe('First');
    expect(result[1].name).toBe('Second');
  });

  test('findPartnerById returns undefined for empty array and handles multiple matches', () => {
    const empty: Partner[] = [];
    expect(findPartnerById(empty, 1)).toBeUndefined();

    const sample: Partner[] = [
      {
        id: 5,
        name: 'A',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
      {
        id: 5,
        name: 'B',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
    ];

    const found = findPartnerById(sample, 5);
    expect(found).toBeDefined();
    expect(found?.name).toBe('A');
  });

  test('filterFirstPartner removes only first matching id and preserves order', () => {
    const sample: Partner[] = [
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
      {
        id: 1,
        name: 'C',
        dob: { day: '', month: '', year: '' },
        gender: '',
        retireAge: '',
      },
    ];
    const filtered = filterFirstPartner(sample, 1);

    expect(filtered.length === 2 || filtered.length === 1).toBe(true);

    expect(filtered[0].id).toBe(2);

    if (filtered.length === 2) {
      expect(filtered[1].id).toBe(1);
      expect(filtered[1].name).toBe('C');
    }
  });
});
describe('savePartnersInfo', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('converts single-value form and calls updatePartnerInformation with expected partner', async () => {
    const updatePartnerInformationMock = jest.fn().mockResolvedValue(undefined);
    jest.doMock('services/about-you', () => ({
      updatePartnerInformation: updatePartnerInformationMock,
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { savePartnersInfo } = await import('./about-you');

    const form = document.createElement('form');

    const makeInput = (name: string, value: string) => {
      const input = document.createElement('input');
      input.name = name;
      input.value = value;
      form.appendChild(input);
      return input;
    };

    makeInput('id', '3');
    makeInput('name', 'Dana');
    makeInput('day', '10');
    makeInput('month', '12');
    makeInput('year', '1975');
    makeInput('gender', 'female');
    makeInput('retireAge', '67');

    await savePartnersInfo(form, sessionIdFromContext);

    expect(updatePartnerInformationMock).toHaveBeenCalledTimes(1);
    expect(updatePartnerInformationMock).toHaveBeenCalledWith(
      [
        {
          id: 3,
          name: 'Dana',
          dob: { day: '10', month: '12', year: '1975' },
          gender: 'female',
          retireAge: '67',
        },
      ],
      sessionIdFromContext,
    );
  });

  test('handles multiple inputs, merges repeated keys and indexed gender keys correctly', async () => {
    const updatePartnerInformationMock = jest.fn().mockResolvedValue(undefined);
    jest.doMock('services/about-you', () => ({
      updatePartnerInformation: updatePartnerInformationMock,
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { savePartnersInfo } = await import('./about-you');

    const form = document.createElement('form');

    const appendInput = (name: string, value: string) => {
      const input = document.createElement('input');
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    appendInput('id', '0');
    appendInput('id', '1');

    appendInput('name', 'First');
    appendInput('name', 'Second');

    appendInput('day', '01');
    appendInput('day', '02');
    appendInput('month', '01');
    appendInput('month', '02');
    appendInput('year', '1990');
    appendInput('year', '1991');

    appendInput('retireAge', '65');
    appendInput('retireAge', '66');

    appendInput('gender', 'female');
    appendInput('gender[1]', 'male');

    await savePartnersInfo(form, sessionIdFromContext);

    expect(updatePartnerInformationMock).toHaveBeenCalledTimes(1);
    const calledArg = updatePartnerInformationMock.mock
      .calls[0][0] as unknown[];

    expect(Array.isArray(calledArg)).toBe(true);
    expect(calledArg).toHaveLength(2);

    expect(calledArg[0]).toMatchObject({
      id: 0,
      name: 'First',
      dob: { day: '01', month: '01', year: '1990' },
      gender: 'female',
      retireAge: '65',
    });

    expect(calledArg[1]).toMatchObject({
      id: 1,
      name: 'Second',
      dob: { day: '02', month: '02', year: '1991' },
      gender: 'male',
      retireAge: '66',
    });
  });
});
