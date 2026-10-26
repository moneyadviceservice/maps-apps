export function formatYesNoToFormValue(
  stored: boolean | string | null,
): string {
  if (stored == null) {
    return '';
  }

  if (typeof stored === 'boolean') {
    return stored ? 'yes' : 'no';
  }

  const value = stored.trim().toLowerCase();
  if (value === 'yes' || value === 'no') {
    return value;
  }

  return '';
}

export function parseYesNoFromFormValue(
  raw: string | undefined,
): boolean | null {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'yes') {
    return true;
  }
  if (value === 'no') {
    return false;
  }
  return null;
}
