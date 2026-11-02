import { PensionTypeLanding } from 'components/PensionTypeLanding';

import { PensionType } from './index';

type Props = {
  lang: string;
  isEmbed: boolean;
};

const LandingPage = ({ lang, isEmbed }: Props) => (
  <PensionType step="landing" isEmbed={isEmbed} bottomContainerStyle="mb-0">
    <PensionTypeLanding lang={lang} isEmbed={isEmbed} />
  </PensionType>
);

export default LandingPage;

export { getServerSidePropsDefault as getServerSideProps } from './index';
