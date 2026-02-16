import { QuestionOption } from '../QuestionRadioButton';

export const mockChildren = 'Label';
export const mockFormName = 'radio-options';
export const mockOptions: QuestionOption[] = [
  { text: 'Radio label', value: 'radio-label-1' },
  { text: 'Radio label', value: 'radio-label-2' },
  { text: 'Radio label', value: 'radio-label-3' },
];
export const mockOptionsWithHint: QuestionOption[] = [
  { text: 'Radio label', value: 'radio-label-1', hint: 'Hint label' },
  { text: 'Radio label', value: 'radio-label-2', hint: 'Hint label' },
  { text: 'Radio label', value: 'radio-label-3', hint: 'Hint label' },
];

export const mockHint = 'Hint label';
export const mockError = 'Error: message goes here';
