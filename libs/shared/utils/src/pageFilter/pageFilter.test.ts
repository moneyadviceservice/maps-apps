import { ParsedUrlQuery } from 'querystring';
import { pageFilter } from './pageFilter';
import mockRouter from 'next-router-mock';

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

  it('should return the url to the previous step', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.backStep(3, mockData)).toEqual(
      '/en/mid-life-mot/question-2?q-1=1&score-q-1=0&q-2=2&score-q-2=0&q-3=1&score-q-3=1&q-4=1&score-q-4=2&q-5=0%2C1&score-q-5=3&changeAnswer=q-1&error=q-8',
    );
  });

  it('should return the url to the previous step when not immediate previous number', () => {
    const mockq = {
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
      'q-8': '1',
      'score-q-8': '2',
      language: 'en',
    };
    mockRouter.push({ query: mockq });
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.backStep(8, mockq)).toEqual(
      '/en/mid-life-mot/question-5?q-1=1&score-q-1=0&q-2=2&score-q-2=0&q-3=1&score-q-3=1&q-4=1&score-q-4=2&q-5=0%2C1&score-q-5=3&q-8=1&score-q-8=2',
    );
  });

  it('should return the back url without canonicalUrl when ENVIRONMENT is not production', () => {
    const filter = pageFilter(
      mockRouter.query,
      '/mid-life-mot/',
      false,
      'prodLandingPageLink',
    );
    expect(filter.backStep(1, mockData)).toEqual('/en/mid-life-mot/');
  });

  it('should return canonicalUrl when ENVIRONMENT is production', () => {
    jest.resetModules();
    jest.mock('next/config', () => ({
      __esModule: true,
      default: jest.fn().mockReturnValue({
        publicRuntimeConfig: { ENVIRONMENT: 'production' },
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { pageFilter } = require('./pageFilter');

    const filter = pageFilter(
      mockRouter.query,
      '/mid-life-mot/',
      false,
      'prodLandingPageLink',
    );
    expect(filter.backStep(1, mockData)).toEqual('prodLandingPageLink');
  });

  it('should return the url to the results page', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.goToResultPage()).toEqual(
      '/en/mid-life-mot/results?q-1=1&score-q-1=0&q-2=2&score-q-2=0&q-3=1&score-q-3=1&q-4=1&score-q-4=2&q-5=0%2C1&score-q-5=3&changeAnswer=q-1&error=q-8',
    );
  });

  it('should return the url to the last step', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.goToLastQuestion(mockData)).toEqual(
      '/en/mid-life-mot/question-5?q-1=1&score-q-1=0&q-2=2&score-q-2=0&q-3=1&score-q-3=1&q-4=1&score-q-4=2&q-5=0%2C1&score-q-5=3&changeAnswer=q-1&error=q-8',
    );
  });

  it('should return the url to change options page', () => {
    const filter = pageFilter(mockRouter.query, '/mid-life-mot/', false);
    expect(filter.goToChangeOptionsPage()).toEqual(
      '/en/mid-life-mot/change-options?q-1=1&score-q-1=0&q-2=2&score-q-2=0&q-3=1&score-q-3=1&q-4=1&score-q-4=2&q-5=0%2C1&score-q-5=3&changeAnswer=q-1&error=q-8',
    );
  });
});
