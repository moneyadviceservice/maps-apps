import mockRouter from 'next-router-mock';

import { ParsedUrlQuery } from 'querystring';

import { pageFilter } from './pageFilter';

jest.mock('next/config', () => {
  const originalModule = jest.requireActual('next/config');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockReturnValue({
      publicRuntimeConfig: { ENVIRONMENT: 'development' },
    }),
  };
});

describe('Mid Life MOT page filter', () => {
  let mockquery: ParsedUrlQuery = {};
  let mockData: ParsedUrlQuery = {};
  beforeEach(() => {
    mockquery = {
      'q-1': '1',
      'score-q-1': '0',
      'q-2': '2',
      'score-q-2': '0',
      'q-3': '1',
      'score-q-3': '1',
      'q-4': '1',
      'score-q-4': '2',
      'q-5': '0,1',
      'score-q-5': '3',
      changeAnswer: 'q-1',
      error: 'q-8',
      language: 'en',
      question: 'question-6',
    };

    mockData = {
      'q-1': '1',
      'score-q-1': '0',
      'q-2': '2',
      'score-q-2': '0',
      'q-3': '1',
      'score-q-3': '1',
      'q-4': '1',
      'score-q-4': '2',
      'q-5': '0,1',
      'score-q-5': '3',
      changeAnswer: 'q-1',
      error: 'q-8',
    };
    mockRouter.push({ query: mockquery });
  });

  it('should return data from query', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    const queryData = filter.getDataFromQuery();
    expect(queryData).toEqual(mockData);
  });

  it('should return data from query when submit empty answer', () => {
    mockquery['error'] = 'q-8';
    mockData['error'] = 'q-8';

    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    const queryData = filter.getDataFromQuery();
    expect(queryData).toEqual(mockData);
  });

  it('should return url to go to step 4', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.goToStep('question-4')).toEqual(
      '/en/mid-life-mot/question-4?q-1=1&score-q-1=0&q-2=2&score-q-2=0&q-3=1&score-q-3=1&q-4=1&score-q-4=2&q-5=0%2C1&score-q-5=3&changeAnswer=q-1&error=q-8',
    );
  });

  it('should return url to first step', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.goToFirstStep()).toEqual(
      '/en/mid-life-mot/question-1?restart=true',
    );
  });

  it('should return the embed url to first step', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', true);
    expect(filter.goToFirstStep()).toEqual(
      '/en/mid-life-mot/question-1?restart=true&isEmbedded=true',
    );
  });
});
