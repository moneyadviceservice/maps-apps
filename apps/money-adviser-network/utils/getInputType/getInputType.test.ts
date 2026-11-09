import { FORM_FIELDS } from '../../data/questions/types';
import { getInputType } from './getInputType';

describe('getInputType', () => {
  it('returns correct type for special fields', () => {
    expect(getInputType(FORM_FIELDS.email)).toBe('Email field');
    expect(getInputType(FORM_FIELDS.telephone)).toBe('Telephone field');
    expect(getInputType(FORM_FIELDS.postcode)).toBe('Postcode field');
    expect(getInputType(FORM_FIELDS.securityQuestion)).toBe('Drop down');
    expect(getInputType(FORM_FIELDS.consentOnline)).toBe('Radio button');
    expect(getInputType(FORM_FIELDS.consentDetails)).toBe('Radio button');
    expect(getInputType(FORM_FIELDS.consentReferral)).toBe('Radio button');
    expect(getInputType(FORM_FIELDS.timeSlot)).toBe('Radio button');
    expect(getInputType(FORM_FIELDS.whenToSpeak)).toBe('Radio button');
  });

  it('returns "Text field" for fields in FORM_FIELDS but not in specialFieldTypes', () => {
    expect(getInputType(FORM_FIELDS.firstName)).toBe('Text field');
    expect(getInputType(FORM_FIELDS.lastName)).toBe('Text field');
    expect(getInputType(FORM_FIELDS.customerReference)).toBe('Text field');
    expect(getInputType(FORM_FIELDS.departmentName)).toBe('Text field');
  });

  it('returns "Radio button" for fields NOT in FORM_FIELDS', () => {
    expect(getInputType('q-1')).toBe('Radio button');
    expect(getInputType('t-2')).toBe('Radio button');
    expect(getInputType('0-3')).toBe('Radio button');
  });
});
