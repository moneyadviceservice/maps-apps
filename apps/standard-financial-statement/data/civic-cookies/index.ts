export const config = {
  locales: [
    {
      locale: 'cy',
      text: {
        accept: 'Derbyn pob cwci',
        reject: 'Gwrthod cwcis marchnata',
        settings: 'Gosod dewisiadau',
        on: 'Ymlaen',
        off: 'I ffwrdd',
        notifyTitle: '<h2>Cwcis ar Gyfriflen Ariannol Safonol</h2>',
        notifyDescription:
          "<p>Rydym yn defnyddio cwcis hanfodol i wneud i'r wefan hon weithio a chwcis dadansoddeg yn ddiofyn i wella ein gwasanaethau. Hoffem osod 'cwcis marchnata' i ddeall beth sy'n gweithio orau i gynyddu ymwybyddiaeth o Gyfriflen Ariannol Safonol.<p></p><p><img width='190' height='64' src='/footer/gov-cy.svg' /></p>",
        title: '<h2>Cwcis ar Gyfriflen Ariannol Safonol</h2>',
        acceptSettings: 'Derbyn pob cwci',
        rejectSettings: 'Nid wyf yn derbyn cwcis',
        closeLabel: 'Arbed dewisiadau',
        intro:
          '<p>Mae cwcis yn ffeiliau a arbedir ar eich ffôn, llechen neu gyfrifiadur pan ymwelwch â gwefan.</p><p>Rydym yn defnyddio cwcis i storio gwybodaeth am sut rydych yn defnyddio Gyfriflen Ariannol Safonol, fel y tudalennau rydych chi\'n ymweld â nhw.</p><p>I gael mwy o wybodaeth, ymwelwch â\'n <a href="/cy/cookies" target="_blank">Polisi Cwcis</a> a\'n <a href="/cy/about-us/privacy" target="_blank">Polisi Preifatrwydd</a>.</p>',
        necessaryTitle: '<h2>Cwcis sydd eu hangen</h2>',
        necessaryDescription:
          "<p>Mae rhai cwcis yn hanfodol er mwyn i'r wefan weithredu'n gywir, fel y rhai sy'n cofio'ch datbliygad trwy ein teclynnau, neu ddefnyddio ein gwasanaeth gwe-sgwrs.</p>",
      },

      optionalCookies: [
        {
          name: 'analytics',
          label: '<h3>Cwcis dadansoddi</h3>',
          description:
            "<p>Mae'r cwcis hyn yn caniatáu i ni gasglu data dienw am sut mae ein gwefan yn cael ei defnyddio, gan ein helpu i wneud gwelliannau i'r gwasanaethau rydym yn eu darparu i chi.</p>",
        },
        {
          name: 'marketing',
          label: '<h3>Cwcis marchnata</h3>',
          description:
            "<p>Mae'r cwcis hyn yn caniatáu i ni ddeall pa ymgyrchoedd sy'n gweithio orau wrth gynyddu ymwybyddiaeth o'n gwasanaethau ymhlith y rhai sydd eu hangen.</p>",
        },
      ],
    },
  ],
  text: {
    accept: 'Accept all cookies',
    reject: 'Reject marketing cookies',
    settings: 'Learn more and set preferences',
    notifyTitle: '<h2>Cookies on Standard Financial Statement</h2>',
    notifyDescription:
      "<p>We use some essential cookies to make this website work. By default, we use analytics cookies to understand how you use this site.</p><p>Additionally, we would like to set marketing cookies to understand which campaigns work best in increasing awareness of our services.</p><p></p><p><img width='190' height='64' src='/footer/gov.svg' alt='H.M. Government logo'/></p>",
    title: '<h2>Cookies on Standard Financial Statement</h2>',
    acceptSettings: 'Accept all cookies',
    closeLabel: 'Save preferences',
    intro:
      '<p>We use essential cookies to make this website work and analytics cookies by default to improve our services.</p><p>For more information visit our <a href="/en/cookies" target="_blank">Cookie Policy</a> and <a href="/en/privacy" target="_blank">Privacy Policy</a>.</p>',
    necessaryTitle: '<h2>Necessary Cookies</h2>',
    necessaryDescription:
      '<p>We\'d like to set "marketing cookies" to understand what works best to increase awareness of Standard Financial Statement.</p>',
  },
};
