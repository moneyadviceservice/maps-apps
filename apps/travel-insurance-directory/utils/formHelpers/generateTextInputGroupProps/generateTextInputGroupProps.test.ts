import { getValueByPath } from 'lib/firms/getValueByPath';
import { InputField } from 'types/register';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { generateTextInputGroupProps } from './generateTextInputGroupProps';

jest.mock('lib/firms/getValueByPath', () => ({
  getValueByPath: jest.fn(),
}));

describe('generateTextInputGroupProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps page inputs and resolves default values using getValueByPath when initialValues is provided', () => {
    const mockPageInputs = [
      {
        key: 'firstName',
        title: 'First Name',
        type: 'text',
        dataPath: 'applicant/profile',
      },
      {
        key: 'email',
        title: 'Email Address',
        type: 'email',
        dataPath: 'applicant/contact',
      },
    ] as InputField[];

    const mockInitialValues = {
      applicant: {
        profile: { firstName: 'John' },
        contact: { email: 'john@example.com' },
      },
    } as unknown as TravelInsuranceFirmDocument;

    (getValueByPath as jest.Mock).mockImplementation(
      (_obj: unknown, path: string) => {
        if (path === 'applicant/profile/firstName') return 'John';
        if (path === 'applicant/contact/email') return 'john@example.com';
        return '';
      },
    );

    const result = generateTextInputGroupProps(
      mockPageInputs,
      mockInitialValues,
    );

    expect(getValueByPath).toHaveBeenCalledTimes(2);
    expect(getValueByPath).toHaveBeenCalledWith(
      mockInitialValues,
      'applicant/profile/firstName',
    );
    expect(getValueByPath).toHaveBeenCalledWith(
      mockInitialValues,
      'applicant/contact/email',
    );

    expect(result).toEqual([
      {
        key: 'firstName',
        title: 'First Name',
        type: 'text',
        defaultValue: 'John',
      },
      {
        key: 'email',
        title: 'Email Address',
        type: 'email',
        defaultValue: 'john@example.com',
      },
    ]);
  });

  it('returns empty strings for default values without calling utility if initialValues is null', () => {
    const mockPageInputs = [
      { key: 'telephone', title: 'Phone', type: 'tel', dataPath: 'company' },
    ] as unknown as InputField[];

    const result = generateTextInputGroupProps(mockPageInputs, null);

    expect(getValueByPath).not.toHaveBeenCalled();

    expect(result).toEqual([
      {
        key: 'telephone',
        title: 'Phone',
        type: 'tel',
        defaultValue: '',
      },
    ]);
  });

  it('returns an empty array instantly when the pageInputs array is empty', () => {
    const mockInitialValues = {} as unknown as TravelInsuranceFirmDocument;

    const result = generateTextInputGroupProps([], mockInitialValues);

    expect(result).toEqual([]);
    expect(getValueByPath).not.toHaveBeenCalled();
  });
});
