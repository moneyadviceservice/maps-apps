interface Placeholder {
  ref: string;
  value: string;
}

export interface CopyItem {
  style: string;
  content: string;
  placeholder?: Placeholder;
}

export interface PageData {
  heading: string;
  copy: CopyItem[];
}

export const notElligible = {
  heading: 'Your firm is not eligible to be listed',
  copy: [
    {
      component: 'paragraph',
      style: 'font-medium',
      content:
        'Based on the information you have supplied, your firm is not eligible to be listed on the Money & Pensions Service Travel Insurance Directory.',
    },
    {
      component: 'paragraph',
      style: 'font-medium',
      placeholder: {
        ref: '{email}',
        value: 'traveldirectory@maps.org.uk',
      },
      content:
        'If you would like to discuss this with us, please contact us in the first instance at: {email}',
    },
  ],
};

export const elligible = {
  heading: 'Thank you',
  copy: [
    {
      component: 'paragraph',
      style: 'font-medium',
      content:
        'We are pleased to confirm your firm has been accepted onto the Money & Pensions Service Travel Insurance Directory.',
    },
    {
      component: 'paragraph',
      style: 'font-medium',
      content:
        'An email with further instructions will be sent to you shortly.',
    },
    {
      component: 'paragraph',
      style: 'font-medium',
      placeholder: {
        ref: '{email}',
        value: 'traveldirectory@maps.org.uk',
      },
      content:
        'If you do not receive an email from us within 24 hours, please contact us at {email}',
    },
  ],
};
