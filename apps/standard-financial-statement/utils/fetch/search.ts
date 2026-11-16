import {
  excludedWords,
  SearchResult,
  SearchResultResponse,
} from 'types/@adobe/search';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchSearch = async ({
  search,
  lang,
  auth = false,
}: {
  search: string;
  lang: string;
  auth: boolean;
}): Promise<SearchResult> => {
  if (search.length < 3 || excludedWords.includes(search)) {
    return {
      results: [],
      minLength: search.length < 3,
      excludedWords: excludedWords.includes(search),
    };
  }

  try {
    const { data } = await aemHeadlessClient.runPersistedQuery(
      `sfs/sfs-search;term=${search}`,
    );

    const items = [
      ...data.pageTemplateList.items,
      ...data.pageSectionTemplateList.items,
      ...formatUseSFS(data.useTheSfsTemplateList.items),
      ...data.whatIsSfsTemplateList.items,
    ].filter((item) => item?._path?.includes(`/${lang}/`));

    return {
      results: formatSearchResults(items, auth),
      minLength: false,
      excludedWords: false,
    };
  } catch (error) {
    console.error('Failed to search:', error);
    return {
      results: [],
      minLength: false,
      excludedWords: false,
    };
  }
};

const formatUseSFS = (items: SearchResultResponse[]) => {
  return items.map((item: SearchResultResponse) => {
    return {
      ...item,
      loginMessage: {
        loginIntro: {
          plaintext: item.loginMessage?.loginIntro?.plaintext
            ? item.loginMessage?.loginIntro?.plaintext
                .replace(/\[[^[\]]*]/g, '')
                .replace(/VARIANT:.*?\n/g, '')
                .replace(/\n/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim()
            : '',
        },
      },
    };
  });
};

const getContent = (item: SearchResultResponse, auth: boolean) => {
  let message = '';
  if (!auth && item._path.includes('/use-the-sfs')) {
    message = item?.loginMessage?.loginIntro?.plaintext ?? '';
  } else {
    message =
      item.content && item.content.length > 0
        ? item.content[0]?.plaintext
        : item.section[0]?.plaintext;
  }

  return `${message.substring(0, 150)}...`;
};

const formatSearchResults = (
  items: SearchResultResponse[],
  auth: boolean,
): {
  title: string;
  description: string;
  link: string;
}[] => {
  return items.map((item) => ({
    title: item.title,
    description: getContent(item, auth),
    link: item.slug.replace('>', '/'),
  }));
};
