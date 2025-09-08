import { Partner } from 'lib/types/aboutYou';
export let partners: Partner[] = [];

partners = [
  {
    id: 1,
    name: 'Partner 1',
    dob: {
      day: '',
      month: '',
      year: '',
    },
    gender: '',
    retireAge: '',
  },
];

export const PARTNER2: Partner = {
  id: 2,
  name: 'Partner 2',
  dob: {
    day: '',
    month: '',
    year: '',
  },
  gender: '',
  retireAge: '',
};
export function updatePartners(newPartners: Partner[]) {
  partners.length = 0;

  partners.push(...newPartners);
}
const normalizeToArray = (value: string | string[] | undefined): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return [];
};

const getGenderOfPartner = (
  data: Record<string, any>,
  idStr: string,
): string => {
  const genderKey = `gender[${Number(idStr)}]`;
  const genderValue = data[genderKey];

  if (typeof genderValue === 'string') {
    return genderValue;
  }

  if (Array.isArray(data.gender)) {
    return data.gender[Number(idStr)] ?? '';
  }

  if (typeof data.gender === 'string') {
    return data.gender;
  }

  return '';
};

export const convertFormData = (data: Record<string, any>): Partner[] => {
  const ids = normalizeToArray(data.id);
  const names = normalizeToArray(data.name);
  const days = normalizeToArray(data.day);
  const months = normalizeToArray(data.month);
  const years = normalizeToArray(data.year);
  const retireAges = normalizeToArray(data.retireAge);

  const partners: Partner[] = ids.map((idStr, i) => ({
    id: Number(idStr),
    name: names[i] ?? '',
    dob: {
      day: days[i] ?? '',
      month: months[i] ?? '',
      year: years[i] ?? '',
    },
    gender: getGenderOfPartner(data, idStr),
    retireAge: retireAges[i] ?? '',
  }));

  return partners;
};

export const findPartnerById = (partners: Partner[], id: number) =>
  partners.find((p) => p.id === id);

export const filterFirstPartner = (partners: Partner[], id: number) =>
  partners.filter((p) => p.id !== id);
