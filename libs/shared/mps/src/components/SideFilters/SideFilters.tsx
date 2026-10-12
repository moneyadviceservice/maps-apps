import { Tags } from '../../types/index';

export { SideFiltersDesktop } from './SideFiltersDesktop';
export { SideFiltersMobile } from './SideFiltersMobile';

export type SideFiltersType = {
  tags: Tags[];
  searchKeyword: string | undefined;
  title: string;
  clearAllTitle: string;
  clearAllLink: string;
  searchTitle: string;
  applyFiltersLabel: string;
  lang: 'en' | 'cy';
  className?: string;
  isOpen?: boolean;
  keyProp?: string;
};
