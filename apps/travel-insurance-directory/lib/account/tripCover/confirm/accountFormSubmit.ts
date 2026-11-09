export function withChangeAnswerApiUrl(
  apiUrl: string,
  isChangeAnswer?: boolean,
): string {
  if (!isChangeAnswer) {
    return apiUrl;
  }

  const separator = apiUrl.includes('?') ? '&' : '?';
  return `${apiUrl}${separator}isChangeAnswer=true`;
}
