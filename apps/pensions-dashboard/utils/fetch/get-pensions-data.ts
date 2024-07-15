import { PROTOCOL } from '../constants';
import { PensionData } from '../types';
import { headers, cookies } from 'next/headers';

export const getPensionData = async () => {
  const host = headers().get('host');

  const testScenario = cookies().get('mhpdtest')?.value ?? 1;

  const response = await fetch(
    `${PROTOCOL}${host}/api/pensions-data/${testScenario}`,
  );

  if (!response.ok) {
    throw new Error('Failed to GET pension data');
  }

  return (await response.json()) as PensionData;
};
