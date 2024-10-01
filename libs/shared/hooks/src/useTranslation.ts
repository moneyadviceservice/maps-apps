import { ReactNode, useCallback } from 'react';
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

Usage:

```
// Text
const { z } = useTranslation()
return ( <h1> {z({en: "Hello World", cy: "Hello World"})} </h1> )

// Object interpolation
const { z } = useTranslation()
return ( <h1> {z({en: "Hello {thing}", cy: "Helo {thing}"}, { thing: "world"})} </h1> )

// JSX
const { z } = useTranslation()
return ( <h1> {z({en: <div>hello</div>, cy: <div>helo</div>})} </h1> )
```

If there is no cy translation then just leave it out, and some console errors will be shown.
You can then hand these over for translation.
*/
type Data = Record<string, string>;

export const useTranslation = (localeOverirde?: string) => {
  let locale = useLanguage();
  if (localeOverirde) {
    locale = localeOverirde;
  }

  if (!(locale === 'en' || locale === 'cy')) {
    // eslint-disable-next-line no-throw-literal
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const z = useCallback(
    ((
      translation: TranslationGroup,
      data?: Data,
      fallback = '<No translation available>',
    ) => {
      const value = translation[locale as keyof TranslationGroup];
      if (value) {
        return interpolate(value, data);
      }
      console.error(
        `no translation available in [${locale}] for [${findFirstAvailableTranslation(
          translation,
        )}]`,
      );
      return fallback;
    }) as <T extends TranslationGroup>(
      translation: T,
      data?: Data,
      fallback?: string,
    ) => T[keyof T] extends string ? string : T[keyof T],
    [locale],
  );

  return {
    z,
    locale,
  } as const;
};

export default useTranslation;
