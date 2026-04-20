import { useTranslation } from '@maps-react/hooks/useTranslation';

type Z = ReturnType<typeof useTranslation>['z'];

export const page = {
  heading: (z: Z) =>
    z({
      en: 'Find a travel insurance provider if you have a serious medical condition or disability',
      cy: 'Dod o hyd i ddarparwr yswiriant teithio os oes gennych gyflwr meddygol difrifol neu anabledd',
    }),

  intro: {
    lead: (z: Z) =>
      z({
        en: "We can't provide quotes",
        cy: 'Ni allwn roi amcangyfrif pris',
      }),

    body: (z: Z) =>
      z({
        en: 'but we can direct you to specialist firms that can. All firms are authorised and regulated by the Financial Conduct Authority (FCA) and have been through a rigorous selection process to prove their specialism',
        cy: "ond gallwn eich cyfeirio at gwmnïau arbenigol sy'n gallu. Mae pob cwmni wedi'i awdurdodi a'i reoleiddio gan yr Awdurdod Ymddygiad Ariannol (FCA) ac maent wedi bod trwy broses ddethol drylwyr i brofi eu harbenigedd",
      }),
  },

  buttonLabel: (z: Z) =>
    z({
      en: 'View firms',
      cy: 'Gweld pob cwmni',
    }),

  registerLink: (z: Z) =>
    z({
      en: 'Register',
      cy: 'Cofrestru',
    }),

  loginLink: (z: Z) =>
    z({
      en: 'Login',
      cy: 'Mewngofnodi',
    }),

  singles: {
    or: (z: Z) =>
      z({
        en: 'or',
        cy: 'neu',
      }),
    asFirm: (z: Z) =>
      z({
        en: 'as a firm',
        cy: 'fel cwmni',
      }),
    back: (z: Z) =>
      z({
        en: 'Back',
        cy: 'Yn ôl',
      }),
  },
};
