import { BudgetData } from 'lib/dbInsert';
import cacheData from 'memory-cache';

import { compress, uncompress } from '../../utils/compress';

export const saveDataToCache = async (
  queryData: BudgetData | undefined,
  cache_name: string,
) => {
  if (queryData === undefined) return;
  const cachedData = cacheData.get(cache_name);

  try {
    if (cachedData) {
      const currentTime = new Date().getTime();
      const { cache, timestamp } = cachedData;
      const uncompressedData = await JSON.parse(await uncompress(cache));

      const expiration = timestamp + 6 * 60 * 60 * 1000;

      const timeLeft = expiration - currentTime;

      if (
        Object.keys(uncompressedData).length === 0 ||
        Object.keys(queryData).length === 0 ||
        queryData['reset'] === 'true'
      ) {
        cacheData.del(cache_name);
      } else if (timeLeft > 0) {
        const updateddata = { ...uncompressedData, ...queryData };
        const compressedData = await compress(JSON.stringify(updateddata));
        cacheData.put(cache_name, {
          cache: compressedData,
          timestamp: timestamp,
        });
      }
    } else {
      const compressedData = await compress(JSON.stringify(queryData));
      cacheData.put(cache_name, {
        cache: compressedData,
        timestamp: new Date().getTime(),
      });
    }
  } catch (error) {
    console.error(`Failed to save data to cache: ${cache_name}`, error);
    return error;
  }
};

export const deleteCache = (CACHE_URL: string) => {
  cacheData.del(CACHE_URL);
};

export const fetchDataFromCache = async (key: string) => {
  const cachedData = cacheData.get(key);

  if (!cachedData?.cache) {
    console.warn(`Cache missing or invalid cache for key: ${key}`);
    return {};
  }

  try {
    const uncompressed = await uncompress(cachedData.cache);
    return JSON.parse(uncompressed ?? '{}');
  } catch (error) {
    console.error(`Failed to fetch data from cache for key: ${key}`, error);
    return {};
  }
};
