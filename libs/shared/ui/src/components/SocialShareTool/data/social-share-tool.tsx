import { Icon, IconType } from '../../Icon/Icon';

export const shareToolContent = {
  title: {
    en: 'Share this tool',
    cy: 'Rhannwch yr offeryn hwn',
  },
  items: [
    {
      name: 'email',
      svg: <Icon type={IconType.MAIL} fill={'fill-current'} />,
    },
    {
      name: 'facebook',
      svg: <Icon type={IconType.FACEBOOK} fill={'#3B5998'} />,
    },
    {
      name: 'twitter',
      svg: <Icon type={IconType.TWITTER} fill={'#1DA1F2'} />,
    },
  ],
};

export const ENCODED_BODY = {
  en: 'Copy%20and%20paste%20the%20below%20URL%20in%20your%20browser.',
  cy: 'Copïwch%20a%20gludiwch%20yr%20URL%20isod%20i’ch%20porwr.',
};

export const ENCODED_NEW_LINE = '%0D%0A';
