import { convertFormData, savePartnersInfo } from './about-you';
import { Partner } from 'lib/types/aboutYou';
import { updatePartnerInformation } from 'services/about-you';

jest.mock('services/about-you', () => ({
  updatePartnerInformation: jest.fn(),
}));

const mockedUpdate = updatePartnerInformation as jest.MockedFunction<
  typeof updatePartnerInformation
>;

describe('about-you util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeForm = (): HTMLFormElement => document.createElement('form');

  const appendInput = (form: HTMLFormElement, name: string, value: string) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
    return input;
  };

  const buildFormFromEntries = (
    entries: Array<[name: string, value: string]>,
  ): HTMLFormElement => {
    const form = makeForm();
    entries.forEach(([name, value]) => appendInput(form, name, value));
    return form;
  };

  describe('convertFormData', () => {
    test.each<[title: string, input: Record<string, any>, expected: Partner]>([
      [
        'converts string form values into a Partner object',
        {
          day: '12',
          month: '6',
          year: '1980',
          retireAge: '65',
          gender: 'male',
        },
        {
          id: 1,
          dob: { day: '12', month: '6', year: '1980' },
          gender: 'male',
          retireAge: '65',
        },
      ],
      [
        'handles array/undefined values by normalizing them to empty strings',
        {
          day: ['1', '2'],
          month: ['6'],
          year: undefined,
          retireAge: ['65'],
          gender: undefined,
        },
        {
          id: 1,
          dob: { day: '', month: '', year: '' },
          gender: '',
          retireAge: '',
        },
      ],
      [
        'uses empty defaults when fields are missing',
        {},
        {
          id: 1,
          dob: { day: '', month: '', year: '' },
          gender: '',
          retireAge: '',
        },
      ],
    ])('%s', (_title, input, expected) => {
      expect(convertFormData(input)).toEqual(expected);
    });
  });

  describe('savePartnersInfo', () => {
    it('reads form fields, calls updatePartnerInformation and returns the partner', async () => {
      mockedUpdate.mockResolvedValueOnce(undefined);

      const form = buildFormFromEntries([
        ['day', '15'],
        ['month', '7'],
        ['year', '1975'],
        ['retireAge', '67'],
        ['gender', 'female'],
      ]);

      const sessionId = 'sess-123';
      const partner = await savePartnersInfo(form, sessionId);

      expect(mockedUpdate).toHaveBeenCalledTimes(1);
      expect(mockedUpdate).toHaveBeenCalledWith(partner, sessionId);

      expect(partner).toEqual({
        id: 1,
        dob: { day: '15', month: '7', year: '1975' },
        gender: 'female',
        retireAge: '67',
      });
    });

    it('aggregates multiple values for same key into arrays and normalizes to empty strings in output', async () => {
      mockedUpdate.mockResolvedValueOnce(undefined);

      const form = buildFormFromEntries([
        ['day', '1'],
        ['day', '2'],
        ['month', '8'],
        ['year', '1990'],
        ['gender', 'other'],
      ]);

      const sessionId = 'sess-456';
      const partner = await savePartnersInfo(form, sessionId);

      expect(mockedUpdate).toHaveBeenCalledWith(partner, sessionId);

      expect(partner.dob.day).toBe('');
      expect(partner.dob.month).toBe('8');
      expect(partner.dob.year).toBe('1990');
      expect(partner.gender).toBe('other');
    });
  });
});
