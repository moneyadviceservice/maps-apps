import {
  coversAllMedicalSpecialisms,
  emptyMedicalSpecialisms,
} from 'lib/firms/firmDefaults';

import {
  buildMedicalSpecialismPatchRecord,
  formatMedicalSpecialismToFormValues,
  parseMedicalSpecialismFields,
} from './medicalSpecialismFormValues';

describe('medicalSpecialismFormValues', () => {
  describe('formatMedicalSpecialismToFormValues', () => {
    it('prefills covers-all when the firm covers all conditions', () => {
      const values = formatMedicalSpecialismToFormValues(
        coversAllMedicalSpecialisms(),
      );

      expect(values).toEqual({
        specialised_medical_conditions_covers_all: 'yes',
        specialised_medical_conditions_cover: '',
      });
    });

    it('prefills specialism when the firm does not cover all conditions', () => {
      const values = formatMedicalSpecialismToFormValues({
        ...emptyMedicalSpecialisms(),
        specialised_medical_conditions_covers_all: false,
        specialised_medical_conditions_cover: 'cancer',
      });

      expect(values.specialised_medical_conditions_covers_all).toBe('no');
      expect(values.specialised_medical_conditions_cover).toBe('cancer');
    });

    it('returns empty values for null fields', () => {
      expect(formatMedicalSpecialismToFormValues()).toEqual({
        specialised_medical_conditions_covers_all: '',
        specialised_medical_conditions_cover: '',
      });
    });
  });

  describe('parseMedicalSpecialismFields', () => {
    it('parses covers-all yes and clears specialism', () => {
      const { medicalSpecialisms, fieldErrors } = parseMedicalSpecialismFields({
        specialised_medical_conditions_covers_all: 'yes',
        specialised_medical_conditions_cover: 'cancer',
      });

      expect(fieldErrors).toEqual({});
      expect(medicalSpecialisms).toEqual({
        specialised_medical_conditions_covers_all: true,
        specialised_medical_conditions_cover: null,
      });
    });

    it('requires a specialism when the firm does not cover all conditions', () => {
      const { medicalSpecialisms, fieldErrors } = parseMedicalSpecialismFields({
        specialised_medical_conditions_covers_all: 'no',
      });

      expect(medicalSpecialisms).toBeNull();
      expect(fieldErrors).toEqual({
        specialised_medical_conditions_cover: { error: 'required' },
      });
    });

    it('parses a specialism when the firm does not cover all conditions', () => {
      const { medicalSpecialisms, fieldErrors } = parseMedicalSpecialismFields({
        specialised_medical_conditions_covers_all: 'no',
        specialised_medical_conditions_cover: 'heart_conditions',
      });

      expect(fieldErrors).toEqual({});
      expect(medicalSpecialisms).toEqual({
        specialised_medical_conditions_covers_all: false,
        specialised_medical_conditions_cover: 'heart_conditions',
      });
    });

    it('returns field errors for missing covers-all', () => {
      const { medicalSpecialisms, fieldErrors } = parseMedicalSpecialismFields(
        {},
      );

      expect(medicalSpecialisms).toBeNull();
      expect(fieldErrors).toEqual({
        specialised_medical_conditions_covers_all: { error: 'required' },
      });
    });
  });

  describe('buildMedicalSpecialismPatchRecord', () => {
    it('builds patch paths for medical_specialisms fields', () => {
      expect(
        buildMedicalSpecialismPatchRecord({
          specialised_medical_conditions_covers_all: false,
          specialised_medical_conditions_cover: 'cancer',
        }),
      ).toEqual({
        'medical_specialisms/specialised_medical_conditions_covers_all': false,
        'medical_specialisms/specialised_medical_conditions_cover': 'cancer',
      });
    });
  });
});
