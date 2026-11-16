import { getDuplicateParamRedirect } from './duplicateParams';

const PATH = '/en/research-library';

const getRedirect = (search: string) =>
  getDuplicateParamRedirect(`${PATH}${search}`);

describe('getDuplicateParamRedirect', () => {
  it('should return null when there is no query string', () => {
    expect(getRedirect('')).toBeNull();
  });

  it('should return null when there are no duplicate params', () => {
    expect(
      getRedirect(
        '?topic=pensions,savings&year=last-year&keyword=debt&p=2&utm_source=newsletter',
      ),
    ).toBeNull();
  });

  it.each([
    'pageType',
    'year',
    'countryOfDelivery',
    'topic',
    'clientGroup',
    'organisation',
    'limit',
    'order',
    'keyword',
    'p',
  ])('should keep the first %s param and remove the duplicate', (param) => {
    expect(getRedirect(`?${param}=first&${param}=sdfw_er_was`)).toEqual({
      destination: `${PATH}?${param}=first`,
      permanent: false,
    });
  });

  it('should keep other params when removing a duplicate', () => {
    expect(
      getRedirect('?topic=pensions&limit=10&topic=sdfw_er_was&order=published'),
    ).toEqual({
      destination: `${PATH}?topic=pensions&limit=10&order=published`,
      permanent: false,
    });
  });
});
