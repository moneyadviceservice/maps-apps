import { ReactNode } from 'react';

export type TranslationGroup = {
  readonly en: ReactNode;
  readonly cy: ReactNode;
};

export interface MACResultsValidation {
  bounds: {
    lower: number;
    upper: number;
  };
}
