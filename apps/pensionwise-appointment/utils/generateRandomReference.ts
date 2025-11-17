import { randomInt } from 'crypto';

const RANDOM_ACCEPTED_CHARACTERS = 'ABCDEFGHGKMNPRSTUVWXYZ';
const RANDOM_DIGITS = '0123456789';

export const generateRandomReference = (): string => {
  return (
    'P' +
    getRandomCharacters(RANDOM_ACCEPTED_CHARACTERS, 2) +
    getRandomCharacters(RANDOM_DIGITS, 1) +
    '-' +
    getRandomCharacters(RANDOM_DIGITS, 1) +
    getRandomCharacters(RANDOM_ACCEPTED_CHARACTERS, 3)
  );
};

export const getRandomCharacters = (validChars: string, number: number) => {
  let result = '';

  for (let i = 0; i < number; i++)
    result += validChars.charAt(randomInt(0, validChars.length - 1));
  return result;
};
