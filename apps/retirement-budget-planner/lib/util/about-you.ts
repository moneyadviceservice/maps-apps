import { Partner } from 'lib/types/aboutYou';
import { updatePartnerInformation } from 'services/about-you';

export const partner: Partner = {
  id: 1,
  dob: {
    day: '',
    month: '',
    year: '',
  },
  gender: '',
  retireAge: '',
};

const normalizeValue = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') return value;
  return '';
};

export const convertFormData = (data: Record<string, any>): Partner => {
  const day = normalizeValue(data.day);
  const month = normalizeValue(data.month);
  const year = normalizeValue(data.year);
  const retireAge = normalizeValue(data.retireAge);

  return {
    id: 1,
    dob: {
      day: day ?? '',
      month: month ?? '',
      year: year ?? '',
    },
    gender: data.gender ?? '',
    retireAge: retireAge ?? '',
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
