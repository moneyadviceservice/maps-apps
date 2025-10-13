import { CACHED_DATA_NAME } from 'lib/constants/pageConstants';
import { get, put } from 'memory-cache';

/**
 * Filter submitted data and return properties related to user entered data
 * @param body
 * @param sectionName
 * @param fieldID
 * @returns
 */
const getSubmitData = (
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

/**
 * Save data to memory when a group of fields is added dynamically
 * @param body
 * @param tabName
 * @param sectionName
 * @param additional
 */
export const saveDataToMemory = (
  body: Record<string, string>,
  tabName: string,
  sectionName: string,
  additional?: number,
) => {
  const data = getDataFromMemory();
  const submittedData = getSubmitData(body);
  let updatedData = {};

  if (data) {
    const pageData = data[tabName]?.pageData;
    const fields = data[tabName]?.additionalFields;
    if (pageData) {
      updatedData = {
        ...data,
        [tabName]: {
          ...data[tabName],
          pageData: { ...pageData, ...submittedData },

          ...(additional
            ? {
                additionalFields: {
                  ...fields,
                  [sectionName]: fields[sectionName]
                    ? fields[sectionName].concat(additional)
                    : [additional],
                },
              }
            : { ...fields }),
        },
      };

      put(CACHED_DATA_NAME, updatedData);
    } else {
      const d = {
        ...data,
        [tabName]: { pageData: { ...pageData, ...submittedData } },
      };
      put(CACHED_DATA_NAME, d);
    }
  } else {
    put(CACHED_DATA_NAME, {
      [tabName]: {
        pageData: submittedData,
        ...(additional === 0
          ? []
          : { additionalFields: { [sectionName]: [additional] } }),
      },
    });
  }
};

/**
 * Remove data and additional field from meory when the requested by user
 * @param body
 * @param tabName
 * @param id
 * @param sectionName
 */
export const removeDataFromMemory = (
  body: Record<string, string>,
  tabName: string,
  id: number,
  sectionName: string,
) => {
  const additional = getAdditionalDataFromMemory(tabName);
  const submittedData = getSubmitData(body, sectionName, `${id}`);

  const updatedAdditional = additional[sectionName].filter(
    (t: number) => t !== id,
  );

  const memoryData = getPageDataFromMemory(tabName);

  Object.keys(memoryData).forEach((data) => {
    if (hasDataProperty(data, sectionName, `${id}`)) {
      delete memoryData[data];
    }
  });

  put(CACHED_DATA_NAME, {
    [tabName]: {
      pageData: { ...memoryData, ...submittedData },
      additionalFields: { ...additional, [sectionName]: updatedAdditional },
    },
  });
};

/**
 *
 * @returns data from memory
 */
export const getDataFromMemory = () => get(CACHED_DATA_NAME);

/**
 *
 * @param tabName
 * @returns The pageData for specific page
 */
export const getPageDataFromMemory = (tabName: string) => {
  const data = getDataFromMemory();
  return data ? data[tabName]?.pageData : {};
};

/**
 *
 * @param tabName
 * @returns the additional fields ffrom memory for specific page
 */
export const getAdditionalDataFromMemory = (tabName: string) => {
  const data = getDataFromMemory();
  return data ? data[tabName]?.additionalFields : {};
};
