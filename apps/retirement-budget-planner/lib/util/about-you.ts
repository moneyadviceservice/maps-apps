import { type Partner } from 'lib/types/aboutYou';
import { updatePartnerInformation } from 'services/about-you';

export const defaultPartner: Partner = {
  id: 1,
  dob: {
    day: '',
    month: '',
    year: '',
  },
  gender: '',
  retireAge: '',
};

const normalizeValue = (
  value: FormDataEntryValue | FormDataEntryValue[] | undefined,
): string => {
  if (typeof value === 'string') return value;
  return '';
};

export const convertFormData = (
  data: Record<string, FormDataEntryValue | FormDataEntryValue[] | undefined>,
): Partner => {
  const day = normalizeValue(data.day);
  const month = normalizeValue(data.month);
  const year = normalizeValue(data.year);
  const retireAge = normalizeValue(data.retireAge);
  const gender = normalizeValue(data.gender);

  return {
    id: 1,
    dob: {
      day,
      month,
      year,
    },
    gender,
    retireAge,
  };
};

export const savePartnersInfo = async (
  formEl: HTMLFormElement,
  sessionId: string,
) => {
  const formData = new FormData(formEl);

  const data: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

  formData.forEach((value, key) => {
    if (key in data) {
      const existing = data[key];
      data[key] = Array.isArray(existing)
        ? [...existing, value]
        : [existing, value];
    } else {
      data[key] = value;
    }
  });

  const partner = convertFormData(data);
  await updatePartnerInformation(partner, sessionId);
  return partner;
};
