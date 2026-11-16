import cy from '@app/public/locales/cy.json';
import en from '@app/public/locales/en.json';

import { LocaleMap } from '../types/common.types';

type DeepPathValue<
  T,
  P extends string,
> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? DeepPathValue<T[Left], Right>
    : never
  : P extends keyof T
  ? T[P]
  : never;

const getNested = <T>(obj: T) => {
  return <P extends string>(path: P): DeepPathValue<T, P> => {
    return path.split('.').reduce((acc: any, key: string) => {
      return acc?.[key];
    }, obj);
  };
};

export class LocaleUtils {
  static getLocale(predicate: string): LocaleMap {
    const cyProperty = getNested(cy)(predicate);
    const enProperty = getNested(en)(predicate);

    if (!cyProperty)
      throw new Error(
        `Could not get property ${predicate} in locale file 'cy'`,
      );
    if (!enProperty)
      throw new Error(
        `Could not get property ${predicate} in locale file 'en'`,
      );

    return {
      en: enProperty,
      cy: cyProperty,
    };
  }
}
