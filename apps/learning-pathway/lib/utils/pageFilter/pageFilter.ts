import { GroupedTag, TagModel } from 'lib/types/site.type';

export const defaultQueryParams = {
  page: '1',
  limit: '10',
};

/**
 *
 * @param pageTags
 * @param locale
 * @returns returns the tags as GroupedTag types
 * to be used with the shared SideNavigation component
 */
export const filterTags = (pageTags: TagModel[], locale: string) =>
  (pageTags ?? []).reduce<GroupedTag[]>((acc, tag) => {
    const categoryId = tag.tagCategory.categoryKey;

    const existingGroup = acc.find((group) => group.key === categoryId);
    const title = locale === 'en' ? tag.titleEn : tag.titleCy;
    if (existingGroup) {
      existingGroup.tags.push({
        value: tag.value,
        label: title,
      });

      if (tag.isChecked) {
        existingGroup.checked?.push(tag.value);
      }
      return acc;
    }

    acc.push({
      group: tag.tagCategory.categoryTitleEn,
      key: categoryId,
      order: tag.tagCategory.order,
      checked: tag.isChecked ? [tag.value] : [],
      tags: [
        {
          value: tag.value,
          label: title,
        },
      ],
    });

    return acc;
  }, []);

/**
 *
 * @param tagGroups
 * @returns the tag groups ordered
 */
export const orderTags = (tagGroups: GroupedTag[]) =>
  [...tagGroups]?.sort((a, b) => a.order - b.order);
/**
 *
 * @param param
 * @param defaultValue
 * @returns returns a query param as a string or undefined
 */
export const getQueryParamValue = (
  param: string | string[] | undefined,
  defaultValue?: string,
) => {
  return param ? (Array.isArray(param) ? param[0] : param) : defaultValue;
};

export const normalizeDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/London',
  });
