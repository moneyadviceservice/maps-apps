import type { NextApiRequest } from 'next';

import { parseBodyQuestions } from './parseBodyQuestions';

const createRequest = (body: Record<string, unknown>): NextApiRequest =>
  ({ body } as NextApiRequest);

describe('parseBodyQuestions', () => {
  it('parses single choice answers with saved data and score', () => {
    const req = createRequest({
      type: 'single',
      question: 'q-4',
      answer: '1',
      score: { 1: 7 },
      savedData: JSON.stringify({ 'q-1': '0' }),
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {
        'q-1': '0',
        'q-4': '1',
        'score-q-4': 7,
      },
      questionNumber: 4,
      error: false,
    });
  });

  it('returns error for single choice when answer is missing', () => {
    const req = createRequest({
      type: 'single',
      question: 'q-2',
      savedData: JSON.stringify({ 'q-1': '1' }),
    });

    const result = parseBodyQuestions(req);

    expect(result.error).toBe(true);
    expect(result.questionNumber).toBe(2);
    expect(result.data).toEqual({
      'q-1': '1',
      'q-2': undefined,
    });
  });

  it('parses multiple choice answers from object-like fields', () => {
    const req = createRequest({
      type: 'multiple',
      question: 'q-5',
      answer0: '0',
      answer1: '2',
      score: { 0: '5', 2: '3' },
      unselectedScore: { 0: '9', 2: '8', 3: '1' },
      clearAll: { 0: 'false', 2: 'false' },
      savedData: JSON.stringify({ 'q-1': '1' }),
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {
        'q-1': '1',
        'q-5': '0,2',
        'score-q-5': 1,
      },
      questionNumber: 5,
      error: false,
    });
  });

  it('supports array-based score, clearAll and unselectedScore payloads', () => {
    const req = createRequest({
      type: 'multiple',
      question: 'q-6',
      answer0: ['1', '2'],
      score: ['0', '4', '2'],
      unselectedScore: ['7', '1', '6'],
      clearAll: ['false', 'true', 'false'],
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {
        'q-6': '1,2',
        'score-q-6': 2,
      },
      questionNumber: 6,
      error: false,
    });
  });

  it('returns error for multiple choice when no answers are selected', () => {
    const req = createRequest({
      type: 'multiple',
      question: 'q-7',
      score: { 1: '2' },
      unselectedScore: { 1: '1' },
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {},
      questionNumber: 7,
      error: true,
    });
  });

  it('parses moneyInput answers and strips commas', () => {
    const req = createRequest({
      type: 'moneyInput',
      question: 'q-3',
      answer: '1,234,567',
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {
        'q-3': '£1234567',
      },
      questionNumber: 3,
      error: false,
    });
  });

  it('returns error for moneyInput when answer is missing', () => {
    const req = createRequest({
      type: 'moneyInput',
      question: 'q-3',
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {},
      questionNumber: 3,
      error: true,
    });
  });

  it('returns error for unknown question type', () => {
    const req = createRequest({
      type: 'unexpected',
      question: 'q-8',
      answer: '1',
    });

    expect(parseBodyQuestions(req)).toEqual({
      data: {},
      questionNumber: 8,
      error: true,
    });
  });
});
