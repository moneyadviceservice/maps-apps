import { twMerge } from 'tailwind-merge';
import { SearchResult } from 'types/@adobe/search';

import useTranslation from '@maps-react/hooks/useTranslation';

export const SearchResults = ({
  searchText,
  searchResult,
}: {
  searchText: string;
  searchResult: SearchResult;
}) => {
  const { z } = useTranslation();

  if (searchResult.minLength) {
    return (
      <div data-testid="search-results">
        <p className="my-10">
          {z({
            en: 'Search terms must be at least 3 characters in length.',
            cy: 'Mae angen i chi roi o leiaf 3 nod i chwilio.',
          })}
        </p>
      </div>
    );
  }

  if (searchResult.excludedWords) {
    return (
      <div data-testid="search-results">
        <p className="my-10">
          {z({
            en: 'Your search term included common words that are not allowed to be searched.',
            cy: 'Mae eich term chwilio yn cynnwys geiriau cyffredin nad ydynt yn cael eu caniatáu i gael eu chwilio.',
          })}
        </p>
      </div>
    );
  }

  return (
    <div data-testid="search-results">
      <p className="my-10">
        {z({
          en: 'You searched for',
          cy: 'Fe chwilioch am',
        })}{' '}
        <span className="font-bold text-gray-500">{searchText}</span>{' '}
        {z({
          en: 'and got',
          cy: 'canfuwyd',
        })}{' '}
        <span className="font-bold text-gray-500">
          {searchResult.results.length}{' '}
        </span>
        <span>
          {z({
            en: searchResult.results.length > 2 ? 'results' : 'result',
            cy: searchResult.results.length > 2 ? 'canlyniadau' : 'canlyniad',
          })}
          .
        </span>
      </p>
      <ul className="max-w-[840px] mb-16">
        {searchResult.results.map((item, index) => (
          <li
            key={index}
            className={twMerge('pt-6 pb-7 border-t border-slate-400')}
          >
            <div className="flex flex-col">
              <a
                href={item.link}
                className="mb-2 text-[22px] font-semibold text-magenta-800 underline hover:no-underline"
              >
                {item.title}
              </a>
              <p className="text-[18px] text-gray-500">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
