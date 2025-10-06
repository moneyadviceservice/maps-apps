import { buildFilterObject } from './buildFilterObject';

describe('buildFilterObject', () => {
  describe('keyword filtering', () => {
    it('should add keyword filter when keyword is provided', () => {
      const query = { keyword: 'test search' };
      const result = buildFilterObject(query);

      expect(result.title).toEqual({
        _match: {
          _logOp: 'OR',
          _expressions: [
            {
              value: 'test search',
              _operator: 'CONTAINS',
            },
          ],
        },
      });
    });

    it('should not add keyword filter when keyword is empty', () => {
      const query = { keyword: '' };
      const result = buildFilterObject(query);

      expect(result.title).toBeUndefined();
    });

    it('should not add keyword filter when keyword is undefined', () => {
      const query = { keyword: undefined };
      const result = buildFilterObject(query);

      expect(result.title).toBeUndefined();
    });

    it('should trim keyword value', () => {
      const query = { keyword: '  test search  ' };
      const result = buildFilterObject(query);

      expect(result.title._match._expressions[0].value).toBe('test search');
    });
  });

  describe('year filtering', () => {
    const currentYear = new Date().getFullYear();

    it('should add last-2 years filter', () => {
      const query = { year: 'last-2' };
      const result = buildFilterObject(query);

      expect(result.publishDate).toEqual({
        _match: {
          _logOp: 'OR',
          _expressions: [
            {
              value: currentYear.toString(),
              _operator: 'EQUALS',
            },
            {
              value: (currentYear - 1).toString(),
              _operator: 'EQUALS',
            },
          ],
        },
      });
    });

    it('should add last-5 years filter', () => {
      const query = { year: 'last-5' };
      const result = buildFilterObject(query);

      expect(result.publishDate._match._expressions).toHaveLength(5);
      expect(result.publishDate._match._expressions[0].value).toBe(
        currentYear.toString(),
      );
      expect(result.publishDate._match._expressions[4].value).toBe(
        (currentYear - 4).toString(),
      );
    });

    it('should add more-than-5 years filter', () => {
      const query = { year: 'more-than-5' };
      const result = buildFilterObject(query);

      expect(result.publishDate).toEqual({
        _match: {
          _logOp: 'OR',
          _expressions: [
            {
              value: (currentYear - 5).toString(),
              _operator: 'LESS_THAN',
            },
          ],
        },
      });
    });

    it('should not add year filter when year is "all"', () => {
      const query = { year: 'all' };
      const result = buildFilterObject(query);

      expect(result.publishDate).toBeUndefined();
    });

    it('should not add year filter when year is undefined', () => {
      const query = { year: undefined };
      const result = buildFilterObject(query);

      expect(result.publishDate).toBeUndefined();
    });
  });

  describe('tag filtering', () => {
    it('should add pageType filter for evidence type', () => {
      const query = { 'evidence type': 'evaluation' };
      const result = buildFilterObject(query);

      expect(result.pageType).toEqual({
        key: {
          _logOp: 'OR',
          _expressions: [
            {
              value: 'evaluation',
              _operator: 'EQUALS',
            },
          ],
        },
      });
    });

    it('should add pageType filter with multiple values', () => {
      const query = { 'evidence type': 'evaluation,review' };
      const result = buildFilterObject(query);

      expect(result.pageType).toEqual({
        key: {
          _logOp: 'OR',
          _expressions: [
            {
              value: 'evaluation',
              _operator: 'EQUALS',
            },
            {
              value: 'review',
              _operator: 'EQUALS',
            },
          ],
        },
      });
    });

    it('should add topic filter for topics', () => {
      const query = { 'topics[]': ['saving', 'debt'] };
      const result = buildFilterObject(query);

      expect(result.topic).toEqual({
        _match: {
          _logOp: 'OR',
          key: {
            _logOp: 'OR',
            _expressions: [
              {
                value: 'saving',
                _operator: 'EQUALS',
              },
              {
                value: 'debt',
                _operator: 'EQUALS',
              },
            ],
          },
        },
      });
    });

    it('should add clientGroup filter for client group', () => {
      const query = { 'client group[]': ['adult', 'young person'] };
      const result = buildFilterObject(query);

      expect(result.clientGroup).toEqual({
        _match: {
          _logOp: 'OR',
          key: {
            _logOp: 'OR',
            _expressions: [
              {
                value: 'adult',
                _operator: 'EQUALS',
              },
              {
                value: 'young person',
                _operator: 'EQUALS',
              },
            ],
          },
        },
      });
    });

    it('should add measuredOutcomes filter for measured outcomes', () => {
      const query = {
        'measured outcomes[]': ['financial capability', 'wellbeing'],
      };
      const result = buildFilterObject(query);

      expect(result.measuredOutcomes).toEqual({
        _match: {
          _logOp: 'OR',
          key: {
            _logOp: 'OR',
            _expressions: [
              {
                value: 'financial capability',
                _operator: 'EQUALS',
              },
              {
                value: 'wellbeing',
                _operator: 'EQUALS',
              },
            ],
          },
        },
      });
    });

    it('should handle comma-separated string values', () => {
      const query = { topics: 'saving,debt,investment' };
      const result = buildFilterObject(query);

      expect(result.topic._match.key._expressions).toHaveLength(3);
      expect(result.topic._match.key._expressions[0].value).toBe('saving');
      expect(result.topic._match.key._expressions[1].value).toBe('debt');
      expect(result.topic._match.key._expressions[2].value).toBe('investment');
    });

    it('should trim values in comma-separated strings', () => {
      const query = { topics: 'saving , debt , investment' };
      const result = buildFilterObject(query);

      expect(result.topic._match.key._expressions[0].value).toBe('saving');
      expect(result.topic._match.key._expressions[1].value).toBe('debt');
      expect(result.topic._match.key._expressions[2].value).toBe('investment');
    });

    it('should filter out empty values', () => {
      const query = { topics: 'saving,,debt,  ,investment' };
      const result = buildFilterObject(query);

      expect(result.topic._match.key._expressions).toHaveLength(3);
      expect(result.topic._match.key._expressions[0].value).toBe('saving');
      expect(result.topic._match.key._expressions[1].value).toBe('debt');
      expect(result.topic._match.key._expressions[2].value).toBe('investment');
    });
  });

  describe('complex filtering scenarios', () => {
    it('should handle multiple filter types together', () => {
      const query = {
        keyword: 'financial education',
        year: 'last-2',
        'evidence type': 'evaluation,review',
        'topics[]': ['saving', 'debt'],
        'client group[]': ['adult'],
        lang: 'en', // Should be ignored
      };
      const result = buildFilterObject(query);

      expect(result.title).toBeDefined();
      expect(result.publishDate).toBeDefined();
      expect(result.pageType).toBeDefined();
      expect(result.topic).toBeDefined();
      expect(result.clientGroup).toBeDefined();
      expect(result.lang).toBeUndefined();
    });

    it('should return empty object when no valid filters', () => {
      const query = { lang: 'en', language: 'en' };
      const result = buildFilterObject(query);

      expect(result).toEqual({});
    });

    it('should handle empty query object', () => {
      const query = {};
      const result = buildFilterObject(query);

      expect(result).toEqual({});
    });
  });

  describe('field mapping', () => {
    it('should map all known field types correctly', () => {
      const query = {
        topics: 'test',
        'client group': 'test',
        'measured outcomes': 'test',
        'evidence type': 'test',
      };
      const result = buildFilterObject(query);

      expect(result.topic).toBeDefined();
      expect(result.clientGroup).toBeDefined();
      expect(result.measuredOutcomes).toBeDefined();
      expect(result.pageType).toBeDefined();
    });

    it('should handle unknown field types by using the field name directly', () => {
      const query = { 'unknown field': 'test' };
      const result = buildFilterObject(query);

      expect(result['unknown field']).toBeDefined();
    });
  });
});
