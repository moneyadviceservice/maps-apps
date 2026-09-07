export const SUPPORTED_LANGUAGES = ['en', 'cy'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function isLanguage(value: unknown): value is Language {
  return (
    typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language)
  );
}

export function getLanguage(value: string | string[] | undefined): Language {
  const language = Array.isArray(value) ? value[0] : value;

  return isLanguage(language) ? language : 'en';
}
