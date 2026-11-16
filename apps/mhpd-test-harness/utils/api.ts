/**
 * Maps and sorts the back end test scenarios
 * @param scenarios
 * @returns
 */
export const mapAndSortBackEndTestScenarios = (
  scenarios: {
    code: string;
  }[],
): { displayValue: string; requestValue: string }[] => {
  const testScenarios = scenarios.map((scenario) => {
    const displayValue = scenario.code;
    return { displayValue, requestValue: displayValue };
  });

  // Sort the testScenarios alphabetically by displayValue
  testScenarios.sort((a, b) => a.displayValue.localeCompare(b.displayValue));

  return testScenarios;
};

export const getScenarios = async (env?: string) => {
  try {
    const composerEndPoint = process.env.COMPOSER_ENDPOINT;
    const composerEndPointTest = process.env.COMPOSER_ENDPOINT_TEST;
    const composerEndPointStaging = process.env.COMPOSER_ENDPOINT_STAGING;

    if (!composerEndPoint) {
      return { error: 'COMPOSER_ENDPOINT is not set' };
    }

    if (!composerEndPointTest) {
      return { error: 'COMPOSER_ENDPOINT_TEST is not set' };
    }

    if (!composerEndPointStaging) {
      return { error: 'COMPOSER_ENDPOINT_STAGING is not set' };
    }

    const endPoint =
      env === 'test'
        ? composerEndPointTest
        : env === 'staging'
        ? composerEndPointStaging
        : composerEndPoint;

    const response = await fetch(`${endPoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: new AbortController().signal,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return { error: 'Scenario data not found' };
    }

    return { data };
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return { error: 'Failed to fetch scenarios' };
  }
};

export const getScenarioById = async (id: string, env?: string) => {
  const composerEndPoint = process.env.COMPOSER_ENDPOINT;
  const composerEndPointTest = process.env.COMPOSER_ENDPOINT_TEST;

  if (!composerEndPoint) {
    return { error: 'COMPOSER_ENDPOINT is not set' };
  }

  if (!composerEndPointTest) {
    return { error: 'COMPOSER_ENDPOINT_TEST is not set' };
  }

  const endPoint =
    env === 'scenariosComposerTest' ? composerEndPointTest : composerEndPoint;

  try {
    const response = await fetch(`${endPoint}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: new AbortController().signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      return { error: `Request failed with status ${response.status}` };
    }

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return { error: 'Scenario data not found' };
    }

    return { data };
  } catch (error) {
    console.error('Error fetching scenario:', error);
    return { error: 'Failed to fetch scenario' };
  }
};
