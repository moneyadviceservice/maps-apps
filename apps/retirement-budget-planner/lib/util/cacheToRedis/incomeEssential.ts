import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { CachedData } from 'lib/types/cachedData.type';

import { redisGetHash, redisSetHash } from '@maps-react/redis/helpers';

/**
 * Filter submitted data and return properties related to user entered data
 * @param body
 * @param sectionName
 * @param fieldID
 * @returns
 */
export const getSubmitData = (body: Record<string, string>) => {
  return Object.keys(body)?.reduce((acc, t) => {
    if (t.startsWith(DEFAULT_PREFIX)) {
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
 * The object saved in Redis has the format
 *
 * {
 *    pageData: {
 *      formprivatePension":"123",
 *      "formprivatePensionFrequency":"month",
 *      ....
 *    },
 *    {
 *      additionalFields: {
 *        [sectionName] : {
 *          [fieldName] : <added index array>
 *        }
 *      }
 *    }
 * }
 *
 * @param body
 * @param tabName
 * @param sectionName
 * @param additional
 */
export const saveDataToMemory = async (
  sessionid: string,
  submittedData: Record<string, string>,
  tabName: string,
  sectionName: string,
  fieldName?: string,
  additional?: number | null,
) => {
  const data = await getDataFromMemory(sessionid, tabName);
  const formData = getSubmitData(submittedData);
  let updatedData = null;

  if (data) {
    updatedData = updateExistingData(
      data,
      formData,
      sectionName,
      fieldName,
      additional,
    );
  } else {
    let addedFields = null;
    if (additional && fieldName) {
      addedFields = { [sectionName]: { [fieldName]: [additional] } };
    }

    updatedData = {
      pageData: formData,
      ...(addedFields && {
        additionalFields: addedFields,
      }),
    };
  }

  setDataToRedis(updatedData, tabName, sessionid);
};

/**
 * Save data to Redis as Redis Hash object
 * @param updatedData
 * @param tabName
 * @param sessionid
 */
export const setDataToRedis = async (
  updatedData: CachedData | null,
  tabName: string,
  sessionid: string,
) => {
  if (updatedData && Object.keys(updatedData).length > 0) {
    await redisSetHash(
      `${tabName}:${sessionid}`,
      convertDataToString(updatedData),
    );
  }
};

const updateExistingData = (
  data: CachedData,
  submittedData: Record<string, string>,
  sectionName: string,
  fieldName?: string,
  additional?: number | null,
) => {
  const pageData = data?.pageData;
  const fields = data?.additionalFields;

  if (pageData) {
    let updatedAdditionalFields = { ...fields };

    if (typeof additional === 'number' && sectionName && fieldName && fields) {
      const section = fields[sectionName] || {};
      const existingFieldData = section[fieldName] || [];

      updatedAdditionalFields = {
        ...fields,
        [sectionName]: {
          ...section,
          [fieldName]: [...existingFieldData, additional],
        },
      };
    }

    return {
      pageData: { ...pageData, ...submittedData },
      additionalFields: updatedAdditionalFields,
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
  submittedData: Record<string, string>,
  tabName: string,
  id: number,
  sectionName: string,
  field: string,
) => {
  const data = await getDataFromMemory(sessionid, tabName);
  const formData = getSubmitData(submittedData) as Record<string, string>;

  const additional = data?.additionalFields;

  const updatedAdditional = additional[sectionName][field]?.filter(
    (t: number) => t !== id,
  );

  const memoryData = data?.pageData;

  for (const item in memoryData) {
    if (hasDataProperty(item, `${DEFAULT_PREFIX}${field}`, `${id}`)) {
      delete memoryData[item];
      delete formData[item];
    }
  }

  try {
    await redisSetHash(
      `${tabName}:${sessionid}`,
      convertDataToString({
        pageData: { ...memoryData, ...formData },
        additionalFields: {
          ...additional,
          [sectionName]: {
            ...additional[sectionName],
            [field]: updatedAdditional,
          },
        },
      }),
    );
  } catch (e) {
    console.error(
      'Failed to save the updated data after removing a field set',
      e,
    );
  }
};
