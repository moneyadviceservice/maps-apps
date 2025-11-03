import { CachedData } from 'lib/types/cachedData.type';

import { redisGetHash, redisSetHash } from '@maps-react/redis/helpers';

/**
 * Filter submitted data and return properties related to user entered data
 * @param body
 * @param sectionName
 * @param fieldID
 * @returns
 */
export const getSubmitData = (
  body: Record<string, string>,
  sectionName?: string,
  fieldID?: string,
) => {
  return Object.keys(body)?.reduce((acc, t) => {
    if (
      t.startsWith('p1') ||
      t.startsWith('p2') ||
      (t.startsWith('p0') && !hasDataProperty(t, sectionName, fieldID))
    ) {
      return { ...acc, [t]: body[t] };
    }
    return acc;
  }, {});
};

/**
 * Check if property starts with specific section name and ends with specific number id
 * @param property
 * @param startswith
 * @param endsWith
 * @returns
 */
export const hasDataProperty = (
  property: string,
  startswith: string | undefined,
  endsWith: string | undefined,
) => {
  if (!property || !startswith || !endsWith) return false;
  return (
    property?.endsWith(String(endsWith)) &&
    property?.startsWith(String(startswith))
  );
};

const convertDataToString = (data: CachedData) => {
  return {
    pageData: JSON.stringify(data.pageData),
    additionalFields: JSON.stringify(data.additionalFields) ?? '',
  };
};

/**
 * Save data to memory when a group of fields is added dynamically
 * @param body
 * @param tabName
 * @param sectionName
 * @param additional
 */
export const saveDataToMemory = async (
  sessionid: string,
  body: Record<string, string>,
  tabName: string,
  sectionName: string,
  additional?: number,
) => {
  const submittedData = getSubmitData(body);

  const data = await getDataFromMemory(sessionid, tabName);

  let updatedData = {};

  if (data) {
    updatedData = updateExistingData(
      data,
      submittedData,
      sectionName,
      additional,
    );
  } else {
    updatedData = {
      pageData: submittedData,
      ...(additional === 0 || !additional
        ? []
        : sectionName
        ? { additionalFields: { [sectionName]: [additional] } }
        : []),
    };
  }

  if (Object.keys(updatedData).length > 0) {
    await redisSetHash(
      `${tabName}:${sessionid}`,
      convertDataToString(updatedData as CachedData),
    );
  }
};

const updateExistingData = (
  data: CachedData,
  submittedData: Record<string, string>,
  sectionName: string,
  additional?: number,
) => {
  const pageData = data.pageData;
  const fields = data.additionalFields;

  if (pageData) {
    return {
      pageData: { ...pageData, ...submittedData },
      ...(additional && sectionName
        ? {
            additionalFields: {
              ...fields,
              [sectionName]: fields[sectionName]
                ? fields[sectionName].concat(additional)
                : [additional],
            },
          }
        : { additionalFields: { ...fields } }),
    };
  } else {
    return {
      ...data,
      pageData: { ...submittedData },
    };
  }
};

/**
 *
 * @returns data from memory
 */
export const getDataFromMemory = async (sessionId: string, tabName: string) => {
  try {
    const data = await redisGetHash(`${tabName}:${sessionId}`);

    if (data && Object.keys(data).length > 0) {
      return {
        pageData: data.pageData ? JSON.parse(data.pageData) : {},
        additionalFields: data.additionalFields
          ? JSON.parse(data.additionalFields)
          : [],
      };
    } else return null;
  } catch (e) {
    console.error('Failed to retrieve data from memory or data don`t exist', e);
    return null;
  }
};

/**
 * Remove data and additional field from meory when the requested by user
 * @param body
 * @param tabName
 * @param id
 * @param sectionName
 */
export const removeDataFromMemory = async (
  sessionid: string,
  body: Record<string, string>,
  tabName: string,
  id: number,
  sectionName: string,
) => {
  const data = await getDataFromMemory(sessionid, tabName);
  const additional = data?.additionalFields;
  const submittedData = getSubmitData(body, sectionName, `${id}`) as Record<
    string,
    string
  >;

  const updatedAdditional = additional[sectionName]?.filter(
    (t: number) => t !== id,
  );

  const memoryData = data?.pageData;

  for (const item in memoryData) {
    if (hasDataProperty(item, sectionName, `${id}`)) {
      delete memoryData[item];
      delete submittedData[item];
    }
  }

  try {
    await redisSetHash(
      `${tabName}:${sessionid}`,
      convertDataToString({
        pageData: { ...memoryData, ...submittedData },
        additionalFields: { ...additional, [sectionName]: updatedAdditional },
      }),
    );
  } catch (e) {
    console.error(
      'Failed to save the updated data after removing a field set',
      e,
    );
  }
};
