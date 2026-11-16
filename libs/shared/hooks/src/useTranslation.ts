import { ReactNode } from 'react';

import { TranslationGroup } from './types';
import useLanguage from './useLanguage';

/*
The useTranslation hook that handles all translation inside this app.

Why?

We needed something quick and easy that could handle two languages (only ever two),
and also showed the English right there in the file.

This makes it very easy to find and change text.
It also follows along with the whole tailwind approach of having everything inside the
same file, which is nice.

We did look at other libraries, but not too many of them store the text inside the component.
Also, these libraries are designed for many languages, where we only ever have two.

So, we chose this approach for now. It might seem like a terrible idea, but it should
be easy to replace, and is very easy to understand.

Update Sep 2024: added t() method to load translations from locale json files.

Applications are free to choose between the two methods. Mix them if you like.

Example uses:

(1) Stick to `z()` for shared components where you want to the text to be consistent
for every consumer of the component.

(2) Use the `t()` method when string might be amended by content editors (eg as a sudo CMS).

(3) Use the tList() method to get a list of items from a given key.

Usage:

```
// Inline text
const { z } = useTranslation()
return ( <h1> {z({en: "Hello World", cy: "Hello World"})} </h1> )

// Object interpolation
const { z } = useTranslation()
return ( <h1> {z({en: "Hello {thing}", cy: "Helo {thing}"}, { thing: "world"})} </h1> )

// JSX
const { z } = useTranslation()
return ( <h1> {z({en: <div>hello</div>, cy: <div>helo</div>})} </h1> )

// Locale json file
const { t } = useTranslation()
return ( <h1> {t("helloWorld")} </h1> )

// Locale json file (with subfolder)
const { t } = useTranslation()
return ( <h1> {t("subfolder/helloWorld")} </h1> )

// Locale json with interpolation
const { t } = useTranslation()
return ( <h1> {t("helloWorld", { thing: "world"})} </h1> )

// Locale json with list of items
{
  section: {
    items: [
      "item1 with markdown [link](https://www.google.com)",
      "item2",
      "item3"
    ]
  }
}

const { tList } = useTranslation()
const items = tList('section.items');
return (
  <ListElement
      items={items.map((item: string, index: number) => (
        <Markdown key={index} content={item} />
      ))}
      variant="unordered"
      color="blue"
      className="ml-8 list-disc text-md"
    />
  </div>
)

```

If there is no cy translation then just leave it out, and some console errors will be shown.
You can then hand these over for translation.
*/

type Data = Record<string, string>;
const fallbackText = '<No translation available>';

type FlattenJsonOptions = {
  data: Record<string, unknown>;
  parentKey?: string;
  result?: Record<string, string>;
};

const flattenJson = ({
  data,
  parentKey = '',
  result = {},
}: FlattenJsonOptions): Record<string, string> => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      // If the value is an object, recursively flatten it
      const isObject =
        data[key] && typeof data[key] === 'object' && !Array.isArray(data[key]);
      if (isObject) {
        flattenJson({
          data: data[key] as Record<string, unknown>,
          parentKey: newKey,
          result,
        });
      } else {
        result[newKey] = String(data[key]);
      }
    }
  }
  return result;
};

const parseTranslationKey = (
  key: string,
): { subfolder: string; translationKey: string } => {
  let subfolder = '';
  let translationKey = key;

  // Check if the key contains a slash indicating a subfolder
  const slashIndex = key.lastIndexOf('/');

  if (slashIndex !== -1) {
    // Extrapolate the folder name (everything before the last slash)
    subfolder = key.substring(0, slashIndex);
    // Extrapolate the actual key (everything after the last slash)
    translationKey = key.substring(slashIndex + 1);
  }

  return { subfolder, translationKey };
};

export const useTranslation = (localeOverirde?: string) => {
  let locale = useLanguage();
  if (localeOverirde) {
    locale = localeOverirde;
  }

  if (!(locale === 'en' || locale === 'cy')) {
    throw new Error(`locale [${locale}] does not exist`);
  }

  const interpolate = ((node: ReactNode, data?: Data) => {
    if (typeof node !== 'string') {
      return node;
    }
    if (!data) {
      return node;
    }
    return Object.keys(data).reduce((previousValue, currentValue) => {
      if (typeof previousValue !== 'string') return node;
      return previousValue.replaceAll(`{${currentValue}}`, data[currentValue]);
    }, node);
  }) as <T extends ReactNode>(
    node: T,
    data?: Data,
  ) => T extends string ? string : T;

  const findFirstAvailableTranslation = (translation: TranslationGroup) => {
    const firstKey = Object.keys(translation)[0];
    return translation[firstKey as keyof TranslationGroup];
  };

  const z = ((
    translation: TranslationGroup,
    data?: Data,
    fallback = fallbackText,
  ) => {
    const value = translation[locale as keyof TranslationGroup];
    if (value) {
      return interpolate(value, data);
    }

    console.warn(
      `no translation available in [${locale}] for [${findFirstAvailableTranslation(
        translation,
      )}]`,
    );
    return fallback;
  }) as <T extends TranslationGroup>(
    translation: T,
    data?: Data,
    fallback?: string,
  ) => T[keyof T] extends string ? string : T[keyof T];

  const loadTranslations = (subfolder: string) => {
    // Keep require paths statically analyzable for webpack (avoid optional
    // subfolder concatenation inside a single template string).
    // Resolves via the app's `@maps-public` webpack alias → public/.
    if (subfolder) {
      return require(`@maps-public/locales/${subfolder}/${locale}.json`);
    }
    return require(`@maps-public/locales/${locale}.json`);
  };

  const t = (key: string, data?: Data, fallback = key) => {
    const { subfolder, translationKey } = parseTranslationKey(key);
    const resolvedPath = `${subfolder ? subfolder + '/' : ''}${locale}.json`;

    try {
      const translations = loadTranslations(subfolder);

      const value = flattenJson({ data: translations })[translationKey];

      if (value) {
        return interpolate(value, data);
      }

      console.warn(
        `no translation available in ${resolvedPath} for [${translationKey}]`,
      );
      return fallback;
    } catch (e) {
      console.warn(
        `no translation available in ${resolvedPath} for [${translationKey}]`,
      );
      return fallback;
    }
  };

  const tList = (key: string, fallback = key) => {
    const { subfolder, translationKey } = parseTranslationKey(key);
    try {
      const translations = loadTranslations(subfolder);

      // Get a list of items from a given key,
      // values are NOT interpolated so only useful when the values are strings.
      // Markdown is supported by passing into the Markdown component
      const items = translationKey.split('.').reduce((acc, current) => {
        return acc[current];
      }, translations);

      return items || fallback;
    } catch (e) {
      console.warn(
        `no translation available in ${
          subfolder ? subfolder + '/' : ''
        }${locale}.json for [${translationKey}]`,
      );
      return fallback;
    }
  };

  return {
    z,
    t,
    tList,
    locale,
  } as const;
};

export default useTranslation;
