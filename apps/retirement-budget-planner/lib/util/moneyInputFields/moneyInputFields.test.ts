import type {
  BasicGroupFieldType,
  RetirementGroupFieldType,
  RetirementFieldTypes,
  DataProps,
} from 'lib/types/page.type';

import {
  doesMoneyInputFieldHaveValue,
  doesMoneyInputFieldArrayHaveValue,
  doesMoneyInputFieldSectionHaveValue,
  doesMoneyInputFieldSectionsHaveValue,
} from './moneyInputFields';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';

/**
 * Field constants
 */

const basicGroupField = {
  index: 0,
  moneyInputName: 'formInputExample',
  frequencyName: 'formInputExampleFrequency',
  defaultFrequency: FREQUNCY_KEYS.FOUR_WEEKS,
} satisfies BasicGroupFieldType;

const retirementGroupField = {
  index: 1,
  moneyInputName: 'formInputRetirementExample',
  frequencyName: 'formInputRetirementExampleFrequency',
  defaultFrequency: FREQUNCY_KEYS.FOUR_WEEKS,
} satisfies RetirementGroupFieldType;

const fieldSection = {
  sectionName: 'Example Section',
  fields: [
    {
      field: 'Example Field',
      items: [basicGroupField, retirementGroupField],
      isDynamic: false,
    },
  ],
} satisfies RetirementFieldTypes;

/**
 * Data constants
 */

const dataWithValue = {
  formInputExample: '1,000',
  formInputRetirementExample: '0',
} satisfies DataProps;

const dataWithoutValue = {
  formInputExample: '0',
  formInputRetirementExample: '0',
} satisfies DataProps;

const dataWithoutMatchingField = {
  formInputUnrelated: '1,000',
} satisfies DataProps;

/**
 * Tests
 */

describe('moneyInputFields utility', () => {
  /**
   * doesMoneyInputFieldHaveValue
   */

  it('should return true from doesMoneyInputFieldHaveValue if field group has a data value', () => {
    expect(
      doesMoneyInputFieldHaveValue({
        field: basicGroupField,
        data: dataWithValue,
      }),
    ).toBe(true);
  });

  it('should return false from doesMoneyInputFieldHaveValue if field group does not have a data value', () => {
    expect(
      doesMoneyInputFieldHaveValue({
        field: basicGroupField,
        data: dataWithoutValue,
      }),
    ).toBe(false);
  });

  it('should return false from doesMoneyInputFieldHaveValue if field group does not exist in data', () => {
    expect(
      doesMoneyInputFieldHaveValue({
        field: basicGroupField,
        data: dataWithoutMatchingField,
      }),
    ).toBe(false);
  });

  /**
   * doesMoneyInputFieldArrayHaveValue
   */

  it('should return true from doesMoneyInputFieldArrayHaveValue if at least one field item has a data value', () => {
    const fields = [basicGroupField, retirementGroupField];

    expect(
      doesMoneyInputFieldArrayHaveValue({ fields, data: dataWithValue }),
    ).toBe(true);
  });

  it('should return false from doesMoneyInputFieldArrayHaveValue if no field items have a data value', () => {
    const fields = [basicGroupField, retirementGroupField];

    expect(
      doesMoneyInputFieldArrayHaveValue({ fields, data: dataWithoutValue }),
    ).toBe(false);
  });

  /**
   * doesMoneyInputFieldSectionHaveValue
   */

  it('should return true from doesMoneyInputFieldSectionHaveValue if at least one field item has a data value', () => {
    expect(
      doesMoneyInputFieldSectionHaveValue({
        fieldSection,
        data: dataWithValue,
      }),
    ).toBe(true);
  });

  it('should return false from doesMoneyInputFieldSectionHaveValue if no field items have a data value', () => {
    expect(
      doesMoneyInputFieldSectionHaveValue({
        fieldSection,
        data: dataWithoutValue,
      }),
    ).toBe(false);
  });

  /**
   * doesMoneyInputFieldSectionsHaveValue
   */

  it('should return true from doesMoneyInputFieldSectionsHaveValue if at least one section in an array contains a field item with a data value', () => {
    expect(
      doesMoneyInputFieldSectionsHaveValue({
        fieldSections: [fieldSection],
        data: dataWithValue,
      }),
    ).toBe(true);
  });

  it('should return false from doesMoneyInputFieldSectionsHaveValue if no section in an array contains a field item with a data value', () => {
    expect(
      doesMoneyInputFieldSectionsHaveValue({
        fieldSections: [fieldSection],
        data: dataWithoutValue,
      }),
    ).toBe(false);
  });
});
