import { Icon, IconType } from '@maps-digital/shared/ui';

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

export const ENCODED_BODY =
  'Copy%20and%20paste%20the%20below%20URL%20in%20your%20browser.';

export const ENCODED_NEW_LINE = '%0D%0A';
