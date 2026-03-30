import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { setDataToRedis, setPartnersInRedis } from 'lib/util/cacheToRedis';
import { databaseClient, searchById } from 'lib/util/databaseConnect';

/**
 * returning back to page after save-and-return
 * get data from database, save to Redis and
 * return the data for current tab
 * @param returning
 * @param sessionId
 * @param tabName
 * @returns
 */
export const returningCache = async (
  returning: boolean,
  sessionId: string | undefined,
  tabName: string,
) => {
  if (!sessionId || !returning) return null;

  try {
    const dbContainer = await databaseClient();
    if (sessionId) {
      //get data from database
      const existing = await searchById(dbContainer, sessionId);

      //save data to redis
      if (existing) {
        await setPartnersInRedis(existing[PAGES_NAMES.ABOUTYOU], sessionId);

        const data = Object.keys(existing).filter(
          (t) => t !== PAGES_NAMES.ABOUTYOU,
        );

        for (const key of data)
          await setDataToRedis(existing[key], key, sessionId);

        return existing[tabName];
      }
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};
