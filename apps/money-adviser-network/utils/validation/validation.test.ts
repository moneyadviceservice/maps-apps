import { FORM_FIELDS } from '../../data/questions/types';
import { FLOW } from '../../utils/getQuestions';
import { validation } from './validation';

describe('validation', () => {
  const mockOnlineDataWithCustomerDetails = {
    customerDetails: {
      [FORM_FIELDS.firstName]: 'John',
      [FORM_FIELDS.lastName]: 'Doe',
      [FORM_FIELDS.email]: 'john.doe@example.com',
    },
  };

  const mockPhoneDataWithCustomerDetails = {
    customerDetails: {
      [FORM_FIELDS.firstName]: 'John',
      [FORM_FIELDS.lastName]: 'Doe',
      [FORM_FIELDS.telephone]: '+441234567890',
    },
  };

  const mockOnlineDataMissingFields = {
    customerDetails: {
      [FORM_FIELDS.firstName]: '',
      [FORM_FIELDS.lastName]: '',
      [FORM_FIELDS.email]: '',
    },
  };

  const mockPhoneDataMissingFields = {
    customerDetails: {
      [FORM_FIELDS.firstName]: '',
      [FORM_FIELDS.lastName]: '',
      [FORM_FIELDS.telephone]: '',
    },
  };

  const emptyData = {};

  it('should return an empty object for FLOW.ONLINE and question 1', () => {
    expect(
      validation(FLOW.ONLINE, 1, mockOnlineDataWithCustomerDetails),
    ).toEqual({});
  });

  it('should return an empty object for FLOW.ONLINE and question 2', () => {
    expect(
      validation(FLOW.ONLINE, 2, mockOnlineDataWithCustomerDetails),
    ).toEqual({});
  });

  it('should return fieldErrors for expected FLOW and questions when fields are missing', () => {
    const expectedOnlineErrors = {
      [FORM_FIELDS.firstName]: true,
      [FORM_FIELDS.lastName]: true,
      [FORM_FIELDS.email]: true,
    };

    expect(validation(FLOW.ONLINE, 3, mockOnlineDataMissingFields)).toEqual(
      expectedOnlineErrors,
    );

    const expectedTelephoneErrors = {
      [FORM_FIELDS.firstName]: true,
      [FORM_FIELDS.lastName]: true,
      [FORM_FIELDS.telephone]: true,
    };
    expect(validation(FLOW.TELEPHONE, 6, mockPhoneDataMissingFields)).toEqual(
      expectedTelephoneErrors,
    );
  });

  it('should return an empty fieldErrors object for expected FLOW and questions when all fields are present', () => {
    expect(
      validation(FLOW.ONLINE, 3, mockOnlineDataWithCustomerDetails),
    ).toEqual({});
    expect(
      validation(FLOW.TELEPHONE, 6, mockPhoneDataWithCustomerDetails),
    ).toEqual({});
  });

  it('should return an empty fieldErrors object for expected FLOW and questions if customerDetails are missing', () => {
    expect(validation(FLOW.ONLINE, 3, emptyData)).toEqual({});
    expect(validation(FLOW.TELEPHONE, 6, emptyData)).toEqual({});
  });

  it('should return an empty object for a flow other than FLOW.ONLINE', () => {
    expect(
      validation('OTHER_FLOW' as FLOW, 3, mockOnlineDataWithCustomerDetails),
    ).toEqual({});
  });
});
