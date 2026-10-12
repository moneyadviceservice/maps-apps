export const timeoutTime = (
  minutes: number,
  seconds: number,
  t: (key: string) => string,
): string => {
  const parts: string[] = [];

  if (minutes > 0) {
    parts.push(
      `${minutes} ${
        minutes === 1 ? t('timeout.minute') : t('timeout.minutes')
      }`,
    );
  }

  if (seconds > 0) {
    parts.push(
      `${seconds} ${
        seconds === 1 ? t('timeout.second') : t('timeout.seconds')
      }`,
    );
  }

  return parts.join(' ');
};
