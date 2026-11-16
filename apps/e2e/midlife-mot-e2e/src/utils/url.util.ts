export class UrlUtils {
  private static readonly questionCount = 18;

  private static readonly baseQuery = [
    { q: 1, value: '1', score: '0' },
    { q: 2, value: '0', score: '0' },
    { q: 3, value: '6', score: '2' },
    { q: 4, value: '0', score: '3' },
    { q: 5, value: '0', score: '2' },
    { q: 6, value: '0', score: '2' },
    { q: 7, value: '4', score: '1' },
    { q: 8, value: '0', score: '3' },
    { q: 9, value: '4', score: '1' },
    { q: 10, value: '4', score: '3' },
    { q: 11, value: '0,1', score: '3' },
    { q: 12, value: '0,1', score: '3' },
    { q: 13, value: '0,1', score: '2' },
    { q: 14, value: '0,1', score: '2' },
    { q: 15, value: '0', score: '3' },
    { q: 16, value: '0', score: '3' },
    { q: 17, value: '0', score: '2' },
    { q: 18, value: '0', score: '2' },
  ];

  static readonly buildQuery = (limit: number): string => {
    return this.baseQuery
      .slice(0, limit)
      .map(({ q, value, score }) => `q-${q}=${value}&score-q-${q}=${score}`)
      .join('&');
  };

  static readonly generateUrls = (): string[] => {
    const urls = [];

    for (let i = 1; i <= this.questionCount; i++) {
      const query = i > 1 ? `?${this.buildQuery(i - 1)}` : '';
      urls.push(`question-${i}${query}`);
    }

    const finalQuery = this.buildQuery(this.questionCount);
    urls.push(
      `change-options?${finalQuery}`,
      `summary?${finalQuery}`,
      `results?${finalQuery}`,
    );

    return urls;
  };
}
