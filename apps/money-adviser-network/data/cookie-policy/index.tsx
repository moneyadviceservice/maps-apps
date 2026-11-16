import useTranslation from '@maps-react/hooks/useTranslation';

export const cookiePolicyData = (t: ReturnType<typeof useTranslation>['z']) => {
  return {
    title: t({
      en: 'Money Adviser Network',
      cy: 'Rhwydwaith Cynghorwyr Arian',
    }),
    intro: {
      paragraph: t({
        en: 'This document sets out information about the cookies we use when you visit Money Advisor Network Debt Advice Referral.',
        cy: "Mae'r ddogfen hon yn nodi gwybodaeth am y cwcis a ddefnyddiwn pan fyddwch chi'n ymweld â Rhwydwaith Cynghorydd Arian Atgyfeiriad Cyngor Dyled.",
      }),
    },
    guide: {
      title: t({
        en: "What's in this guide",
        cy: 'Beth sydd yn y canllaw hwn',
      }),
      sections: [
        {
          title: t({
            en: 'What are cookies?',
            cy: 'Beth yw cwcis?',
          }),
          anchor: 'what-are-cookies',
        },
        {
          title: t({
            en: 'How can I control my cookies?',
            cy: 'Sut alla i reoli fy nghwcis?',
          }),
          anchor: 'control-cookies',
        },
        {
          title: t({
            en: 'What cookies do we use?',
            cy: 'Pa Gwcis rydym yn eu defnyddio?',
          }),
          anchor: 'cookies-we-use',
        },
        {
          title: t({
            en: 'Strictly Necessary cookies:',
            cy: 'Cwcis Cwbl angenrheidiol',
          }),
          anchor: 'strictly-necessary',
        },
        {
          title: t({
            en: 'Cookies that measure website use (Analytics):',
            cy: "Cwcis sy'n mesur defnydd o'r wefan (Dadansoddeg)",
          }),
          anchor: 'analytics-cookies',
        },
        {
          title: t({
            en: 'Cookies that help with our communications and marketing:',
            cy: "Cwcis sy'n helpu gyda'n cyfathrebu a'n marchnata:",
          }),
          anchor: 'marketing-cookies',
        },
      ],
    },
    content: [
      {
        id: 'what-are-cookies',
        heading: t({
          en: 'What are cookies?',
          cy: 'Beth yw cwcis?',
        }),
        paragraphs: t({
          en: [
            'Cookies are small files that websites save on your phone, tablet or computer to help them remember your preferences and improve your experience.',
          ],
          cy: [
            "Ffeiliau bach yw cwcis y mae gwefannau'n eu cadw ar eich ffôn, tabled neu gyfrifiadur i'w helpu i gofio eich dewisiadau a gwella eich profiad.",
          ],
        }),
      },
      {
        id: 'control-cookies',
        heading: t({
          en: 'How can I control my cookies?',
          cy: 'Sut alla i reoli fy nghwcis?',
        }),
        paragraphs: t({
          en: [
            "You can change your cookie preferences at any time using the 'Cookie preferences' link in the footer of this site. Alternatively, most web browsers allow some control of most cookies through the browser settings.",
            "There is more information on how to manage cookies on the Information Commissioner's Office website.",
          ],
          cy: [
            "Gallwch newid eich dewisiadau cwcis unrhyw bryd gan ddefnyddio'r ddolen 'Dewisiadau cwcis' yng ngwaelod y wefan hon. Fel arall, mae'r rhan fwyaf o borwyr gwe yn caniatáu rhywfaint o reolaeth dros y rhan fwyaf o gwcis trwy osodiadau'r porwr.",
            "Mae rhagor o wybodaeth am sut i reoli cwcis ar wefan Swyddfa'r Comisiynydd Gwybodaeth.",
          ],
        }),
      },
      {
        id: 'cookies-we-use',
        heading: t({
          en: 'What cookies do we use?',
          cy: 'Pa Gwcis rydym yn eu defnyddio?',
        }),
        paragraphs: t({
          en: [
            'We currently use three types of cookies:',
            '- Strictly Necessary cookies, which are required for the site to work',
            '- Analytics cookies, which collect information about how you use the service to help us improve it',
            '- Marketing and Communication cookies',
            'The Money Advisor Network Debt Advice Referral is intended for UK-based users so we follow UK law, including the Data (Use and Access) Act 2025.',
            "We've recently updated our approach to cookies to improve your experience on our website. In line with the Data (Use and Access) Act 2025, we won't have to ask you to accept analytics cookies, which help us improve our services. But you can still reject these cookies using the 'Cookie preferences' link in the footer of this site.",
            <>
              There is more information on{' '}
              <a
                href="https://ico.org.uk/for-the-public/online/cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                how to manage cookies
              </a>{' '}
              on the Information Commissioner&apos;s Office website.
            </>,
          ],
          cy: [
            'Ar hyn o bryd rydym yn defnyddio tri math o gwcis:',
            "- Cwcis Cwbl angenrheidiol, eu hangen er mwyn i'r wefan weithio",
            "- Cwcis dadansoddeg, sy'n casglu gwybodaeth am sut rydych chi'n defnyddio'r gwasanaeth i'n helpu i'w wella",
            '- Cwcis Marchnata a Chyfathrebu',
            "Mae Rhwydwaith Cynghorydd Arian Atgyfeiriad Cyngor Dyled wedi'i bwriadu ar gyfer defnyddwyr yn y DU felly rydym yn dilyn cyfraith y DU, gan gynnwys Deddf Data (Defnydd a Mynediad) 2025.",
            "Rydym wedi diweddaru ein dull o ymdrin â chwcis yn ddiweddar i wella eich profiad ar ein gwefan. Yn unol â Deddf Data (Defnydd a Mynediad) 2025, ni fydd yn rhaid i ni ofyn i chi dderbyn cwcis dadansoddeg, sy'n ein helpu i wella ein gwasanaethau. Ond gallwch barhau i wrthod y cwcis hyn gan ddefnyddio'r ddolen 'Dewisiadau cwcis' ar waelod y safle.",
            <>
              Mae rhagor o wybodaeth am{' '}
              <a
                href="https://ico.org.uk/for-the-public/online/cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                sut i reoli cwcis
              </a>{' '}
              ar wefan Swyddfa&apos;r Comisiynydd Gwybodaeth.
            </>,
          ],
        }),
      },
      {
        id: 'strictly-necessary',
        heading: t({
          en: 'Strictly Necessary cookies:',
          cy: 'Cwcis Cwbl angenrheidiol:',
        }),
        paragraphs: t({
          en: [
            "These cookies are essential for the website to work, and to keep your information secure. Without these, the website won't work properly. We do not need to ask permission for essential cookies. They do not store any personal data. They expire as shown in the table below.",
            'If you do not want us to use them, you can turn off cookies in your web browser, but the service may not work properly.',
          ],
          cy: [
            "Mae'r cwcis hyn yn hanfodol er mwyn i'r wefan weithio, ac i gadw eich gwybodaeth yn ddiogel. Heb y rhain, ni fydd y wefan yn gweithio'n iawn. Nid oes angen i ni ofyn am ganiatâd ar gyfer cwcis hanfodol. Nid ydynt yn cadw unrhyw ddata personol. Maent yn dod i ben fel y dangosir yn y tabl isod.",
            "Os nad ydych eisiau i ni eu defnyddio, gallwch chi ddiffodd cwcis yn eich porwr gwe, ond efallai na fydd y gwasanaeth yn gweithio'n iawn.",
          ],
        }),
        table: {
          caption: t({
            en: 'Necessary cookies we use are:',
            cy: "Y cwcis angenrheidiol rydyn ni'n eu defnyddio yw:",
          }),
          headers: t({
            en: ['Cookie Name', 'Purpose', 'Expires'],
            cy: ['Enw Cwci', 'Pwrpas', 'Dod i Ben'],
          }),
          rows: t({
            en: [
              [
                'accessToken',
                'Token used for application access/authentication',
                'Session expiry',
              ],
              [
                'refreshToken',
                'Token used to refresh the accessToken when the session expires (providing the refresh token is still valid).',
                'Session expiry',
              ],
              [
                'userId',
                'Used in analyitcs as a way to identify if a new session is the same user - no personal information.',
                'Session expiry',
              ],
              [
                'csrfToken',
                'Used for security when making external API calls',
                'Session expiry',
              ],
              [
                'user',
                'Encrypted user session data including username and session info',
                'Session expiry',
              ],
              [
                'data',
                'Encrypted application data and user responses to questionnaire flow',
                'Session expiry',
              ],
              [
                '__cf_bm',
                'Cloudflare places the __cf_bm cookie on End User devices that access Customer sites that are protected by Bot Management or Bot Fight Mode.',
                '30 mins',
              ],
              [
                'AMP_TOKEN',
                'Used to track user activity and link user sessions between AMP (Accelerated Mobile Pages) content and non-AMP content.',
                '1 hour',
              ],
              [
                'CookieControl',
                'Set when a user first lands on our website and the top cookie consent banner is displayed. With this cookie in place, the top cookie consent banner will be hidden.',
                '1 year and 1 month',
              ],
            ],
            cy: [
              [
                'accessToken',
                'Tocyn a ddefnyddir er mwyn cyrchu/dilysiant rhaglenni',
                'Sesiwn yn gorffen',
              ],
              [
                'refreshToken',
                "Tocyn a ddefnyddir i adnewyddu'r accessToken pan ddaw'r sesiwn i ben (ar yr amod bod y tocyn adnewyddu yn dal yn ddilys).",
                'Sesiwn yn gorffen',
              ],
              [
                'userId',
                'Defnyddir mewn dadansoddeg fel ffordd o nodi a yw sesiwn newydd yr un defnyddiwr - dim gwybodaeth bersonol.',
                'Sesiwn yn gorffen',
              ],
              [
                'csrfToken',
                'Defnyddir er mwyn diogelwch wrth wneud galwadau API allanol',
                'Sesiwn yn gorffen',
              ],
              [
                'user',
                "Data sesiwn defnyddiwr wedi'i amgryptio gan gynnwys enw defnyddiwr a gwybodaeth sesiwn",
                'Sesiwn yn gorffen',
              ],
              [
                'data',
                "Data cais wedi'i amgryptio ac ymatebion defnyddwyr i lif holiadur",
                'Sesiwn yn gorffen',
              ],
              [
                '__cf_bm',
                "Mae Cloudflare yn gosod y cwci __cf_bm ar ddyfeisiau Defnyddwyr Terfynol sy'n cyrchu safleoedd Cwsmeriaid sy'n cael eu diogelu gan Bot Management neu Bot Fight Mode.",
                '30 munud',
              ],
              [
                'AMP_TOKEN',
                "Defnyddir i olrhain gweithgaredd defnyddwyr a chysylltu sesiynau defnyddwyr rhwng cynnwys AMP (Tudalennau Symudol Cyflym) a chynnwys nad yw'n AMP.",
                '1 awr',
              ],
              [
                'CookieControl',
                "Yn cael ei osod pryd y bydd defnyddiwr yn glanio ar ein gwefan am y tro cyntaf ac mae'r faner caniatâd cwci uchaf yn cael ei harddangos. Gyda'r cwci hwn yn ei le, bydd y faner caniatâd cwci uchaf yn cael ei guddio.",
                '1 flwyddyn ac 1 mis',
              ],
            ],
          }),
        },
      },
      {
        id: 'analytics-cookies',
        heading: t({
          en: 'Cookies that measure website use (Analytics):',
          cy: "Cwcis sy'n mesur defnydd o'r wefan (Dadansoddeg):",
        }),
        paragraphs: t({
          en: [
            'We use analytics cookies to collect information about how you use the Money Advisor Network Debt Advice Referral Service, for example what pages you visit and what you click on.',
            'This helps us understand how we can improve the services.',
            'We do not share this data or allow anyone else to use it.',
          ],
          cy: [
            "Rydym yn defnyddio cwcis dadansoddeg i gasglu gwybodaeth am sut rydych yn defnyddio'r Gwasanaeth Rhwydwaith Cynghorydd Arian Atgyfeiriad Cyngor Dyled, er enghraifft pa dudalennau rydych chi'n ymweld â nhw a beth rydych yn clicio arno.",
            "Mae hyn yn ein helpu i ddeall sut y gallwn wella'r gwasanaethau.",
            "Nid ydym yn rhannu'r data hwn nac yn caniatáu i unrhyw un arall ei ddefnyddio.",
          ],
        }),
        table: {
          caption: t({
            en: 'Analytics cookies we use:',
            cy: 'Cwcis dadansoddol rydym yn eu defnyddio:',
          }),
          headers: t({
            en: ['Name', 'Purpose', 'Expires'],
            cy: ['Enw', 'Pwrpas', 'Dod i ben'],
          }),
          rows: t({
            en: [
              // Microsoft Clarity
              ['Microsoft Clarity', '', ''],
              [
                '_clck',
                'Stores a unique ID and your preferences so the website can anonymously track how people use the site and make improvements based on that behaviour.',
                '13 months',
              ],
              [
                '_clsk',
                'Links together the different pages you visit during one visit, so your activity can be viewed as a single session to better understand how people use the site.',
                '1 year',
              ],
              [
                'CLID',
                'Identifies the first-time Clarity saw this user on any site using Clarity.',
                '13 months',
              ],
              [
                'ANONCHK',
                "Checks if a unique ID used for advertising is being shared, but since this site doesn't use that advertising feature, the setting is always turned off.",
                '13 months',
              ],
              [
                'MR',
                'Indicates whether to refresh MUID (Microsoft User ID).',
                '13 months',
              ],
              [
                'MUID',
                'Identifies unique web browsers visiting Microsoft sites. These cookies are used for advertising, site analytics, and other operational purposes.',
                '13 months',
              ],
              [
                'SM',
                'Used in synchronizing the MUID across Microsoft domains.',
                '13 months',
              ],

              // Google Analytics
              ['Google Analytics', '', ''],
              [
                '_ga',
                'Used by Google Analytics to recognise returning visitors by assigning a unique ID, helping us understand how people use our website over time.',
                '2 years',
              ],
              [
                '_gid',
                'Used by Google Analytics to identify visitors but only tracks activity within a single day.',
                '24 hours',
              ],
              [
                '_ga_<container-id>',
                'Used by Google Analytics to identify and track an individual session with a user device.',
                '1 minute',
              ],
              [
                '_gat_gtag_<container-id>',
                'Used by Google Analytics to limit requests to its service.',
                '1 minute',
              ],
              [
                '_utma',
                'Used by Google Analytics to track visitor behaviour and measure site performance.',
                '2 years',
              ],
              [
                '_gat_UA',
                'Used by Google to limit collection of data on high traffic sites.',
                '10 minutes',
              ],
              [
                '_dc_gtm_*',
                'Used by Google Tag Manager to load scripts related to Google Analytics.',
                '1 minute',
              ],

              // Glassbox
              ['Glassbox', '', ''],
              [
                '_cls_s',
                'Session identifying cookie. It also indicates if the visitor is new or existing.',
                'Session expiry',
              ],
              ['_cls_v', 'Visitor identifying cookie.', '1 year'],
              [
                'Bc',
                'Enables recording of user sessions across subdomains.',
                'Session expiry',
              ],

              // Adobe Marketing Cloud
              ['Adobe Marketing Cloud', '', ''],
              [
                's_ecid',
                'Stores a unique Experience Cloud ID, which helps link your visits and activity across different parts of the website for analytics purposes.',
                '2 years',
              ],
              [
                's_cc',
                'Determines if cookies are enabled. Set by JavaScript.',
                'Session expiry',
              ],
              [
                's_sq',
                'Used by Activity Map. It contains information about the previous link clicked by the visitor.',
                'Session expiry',
              ],
              ['s_vi', 'Stores a unique visitor ID and timestamp.', '2 years'],
              [
                's_fid',
                'Stores the fallback unique visitor ID and timestamp.',
                '2 years',
              ],
              [
                's_ac',
                "Helps set other cookies correctly and is deleted right after it's used.",
                'Immediate',
              ],
              [
                'mbox',
                'Stores a few values, including your session ID and settings, to help the website work properly.',
                '2 years',
              ],
              [
                'at_check',
                'Temporary cookie to check if the cookie read/write capability is enabled on the browser.',
                'Session expiry',
              ],
              ['AMCV_*', 'Stores a unique visitor ID.', 'Session expiry'],
              [
                'AMCVS_*',
                'Used to indicate that a session is in progress.',
                'Session expiry',
              ],
            ],
            cy: [
              // Microsoft Clarity
              ['Microsoft Clarity', '', ''],
              [
                '_clck',
                "Yn cadw ID unigryw a'ch dewisiadau fel y gall y wefan olrhain yn ddienw sut mae pobl yn defnyddio'r wefan a gwneud gwelliannau yn seiliedig ar yr ymddygiad hwnnw.",
                '13 mis',
              ],
              [
                '_clsk',
                "Yn cysylltu'r gwahanol dudalennau rydych yn ymweld â hwy yn ystod un ymweliad, fel y gellir gweld eich gweithgaredd fel un sesiwn i ddeall yn well sut mae pobl yn defnyddio'r wefan.",
                'Blwyddyn',
              ],
              [
                'CLID',
                "Yn nodi'r tro cyntaf i Clarity weld y defnyddiwr hwn ar unrhyw wefan sy'n defnyddio Clarity.",
                '13 mis',
              ],
              [
                'ANONCHK',
                "Yn gwirio a yw ID unigryw a ddefnyddir ar gyfer hysbysebu yn cael ei rannu, ond gan nad yw'r wefan hon yn defnyddio'r nodwedd hysbysebu honno, mae'r gosodiad bob amser wedi'i ddiffodd.",
                '13 mis',
              ],
              [
                'MR',
                'Yn nodi a ddylid adnewyddu MUID (ID Defnyddiwr Microsoft).',
                '13 mis',
              ],
              [
                'MUID',
                "Yn nodi porwyr gwe unigryw sy'n ymweld â safleoedd Microsoft. Defnyddir y cwcis hyn ar gyfer hysbysebu, dadansoddi safleoedd, a dibenion gweithredol eraill.",
                '13 mis',
              ],
              [
                'SM',
                "Yn cael ei ddefnyddio wrth gydamseru'r MUID ar draws parthau Microsoft.",
                '13 mis',
              ],

              // Google Analytics
              ['Google Analytics', '', ''],
              [
                '_ga',
                "Yn cael ei ddefnyddio gan Google Analytics i adnabod ymwelwyr sy'n dychwelyd trwy roi ID unigryw, gan ein helpu i ddeall sut mae pobl yn defnyddio ein gwefan dros amser.",
                '2 flynedd',
              ],
              [
                '_gid',
                'Yn cael ei ddefnyddio gan Google Analytics i adnabod ymwelwyr ond dim ond yn olrhain gweithgaredd o fewn un diwrnod.',
                '24 awr',
              ],
              [
                '_ga_<container-id>',
                'Yn cael ei ddefnyddio gan Google Analytics i nodi ac olrhain sesiwn unigol gyda dyfais defnyddiwr.',
                '1 munud',
              ],
              [
                '_gat_gtag_<container-id>',
                "Yn cael ei ddefnyddio gan Google Analytics i gyfyngu ar geisiadau i'w wasanaeth.",
                '1 munud',
              ],
              [
                '_utma',
                'Yn cael ei ddefnyddio gan Google Analytics i olrhain ymddygiad ymwelwyr a mesur perfformiad y safle.',
                '2 flynedd',
              ],
              [
                '_gat_UA',
                'Yn cael ei ddefnyddio gan Google i gyfyngu ar gasglu data ar safleoedd traffig uchel.',
                '10 munud',
              ],
              [
                '_dc_gtm_*',
                "Yn cael ei ddefnyddio gan Google Tag Manager i lwytho sgriptiau sy'n berthnasol i Google Analytics.",
                '1 munud',
              ],

              // Glassbox
              ['Glassbox', '', ''],
              [
                '_cls_s',
                "Cwci adnabod sesiwn. Mae hefyd yn dangos a yw'r ymwelydd yn newydd neu'n ymwelydd presennol.",
                'Terfyn y sesiwn',
              ],
              ['_cls_v', 'Cwci adnabod ymwelwyr.', 'Blwyddyn'],
              [
                'Bc',
                'Yn galluogi recordio sesiynau defnyddwyr ar draws is-barthau.',
                'Terfyn y sesiwn',
              ],

              // Adobe Marketing Cloud
              ['Adobe Marketing Cloud', '', ''],
              [
                's_ecid',
                "Yn cadw ID Experience Cloud unigryw, sy'n helpu i gysylltu eich ymweliadau a'ch gweithgaredd ar draws gwahanol rannau o'r wefan at ddibenion dadansoddi.",
                '2 flynedd',
              ],
              [
                's_cc',
                "Yn penderfynu a yw cwcis wedi'u galluogi. Wedi'i osod gan JavaScript.",
                'Terfyn y sesiwn',
              ],
              [
                's_sq',
                "Yn cael ei ddefnyddio gan Activity Map. Mae'n cynnwys gwybodaeth am y ddolen flaenorol a gliciwyd gan yr ymwelydd.",
                'Terfyn y sesiwn',
              ],
              [
                's_vi',
                'Yn cadw ID unigryw ymwelydd a stamp amser.',
                '2 flynedd',
              ],
              [
                's_fid',
                "Yn cadw'r ID unigryw wrth gefn ymwelydd a'r stamp amser.",
                '2 flynedd',
              ],
              [
                's_ac',
                'Yn helpu i osod cwcis eraill yn gywir ac yn cael ei ddileu yn syth ar ôl ei ddefnyddio.',
                'Yn syth',
              ],
              [
                'mbox',
                "Yn cadw ychydig o werthoedd, gan gynnwys eich ID sesiwn a'ch gosodiadau, i helpu'r wefan i weithio'n iawn.",
                '2 flynedd',
              ],
              [
                'at_check',
                "Cwci dros dro i wirio a yw'r gallu darllen/ysgrifennu cwcis wedi'i alluogi ar y porwr.",
                'Terfyn y sesiwn',
              ],
              ['AMCV_*', 'Yn cadw ID unigryw ymwelydd', 'Terfyn y sesiwn'],
              [
                'AMCVS_*',
                'Yn cael ei ddefnyddio i ddangos bod sesiwn ar y gweill.',
                'Terfyn y sesiwn',
              ],
            ],
          }),
        },
      },
      {
        id: 'marketing-cookies',
        heading: t({
          en: 'Cookies that help with our communications and marketing:',
          cy: "Cwcis sy'n helpu gyda'n cyfathrebu a'n marchnata:",
        }),
        table: {
          caption: t({
            en: 'These cookies may be set by third party websites.',
            cy: 'Gall y cwcis hyn gael eu gosod gan wefannau trydydd parti.',
          }),
          headers: t({
            en: ['Cookie Name', 'Purpose', 'Expires'],
            cy: ['Enw Cwci', 'Pwrpas', 'Dod i Ben'],
          }),
          rows: t({
            en: [
              [
                'SRM_B',
                'This cookie is set by Microsoft Bing Ads and is used to collect user information for advertising purposes. It helps deliver targeted ads and measure the effectiveness of ad campaigns across websites.',
                '1 year',
              ],
              [
                '_uetvid',
                'This is a cookie utilised by Microsoft Bing Ads and is a tracking cookie. It allows us to engage with a user that has previously visited our website.',
                '1 day',
              ],
              [
                '_uetsid',
                'Used by Microsoft Bing Ads to track user behavior on a website.',
                '1 day',
              ],
              [
                'bcookie',
                'It helps LinkedIn track user activity, primarily for security and and improved user experience, and supports features like the LinkedIn app login.',
                '1 year',
              ],
              [
                'li_gc',
                'Used by LinkedIn to record whether a user has agreed to the use of non-essential cookies on LinkedIn to track conversions and analyse advertising performance.',
                '6 months',
              ],
              [
                'lidc',
                "Used by LinkedIn to select the appropriate data center for a user's activity to ensure your information is sent to the correct location.",
                '1 day',
              ],
              [
                'Muc_ads',
                'Used to track user interactions with Twitter ads to improve ad targeting and performance measurement.',
                '1 year and 1 month',
              ],
              [
                'Personalization_id',
                'Used to personalize the user experience, such as remembering preferences or displaying relevant content.',
                '8 weeks',
              ],
              [
                'test_cookie',
                "This cookie is set by Google's DoubleClick advertising platform to check if a user's browser accepts cookies.",
                '15 minutes',
              ],
              [
                '__adal_ca',
                'Records information about the advertising campaign that brought you to our website. This helps us measure which ads are most effective.',
                '6 months',
              ],
              [
                '__adal_cw',
                "Tracks which ads you've already seen so we don't show you the same one too many times.",
                '7 days',
              ],
              [
                '__adal_id',
                'Stores an anonymous identifier so Adform can recognise your browser during a visit and on future visits for advertising and analytics purposes.',
                '1 year',
              ],
              [
                '__adal_ses',
                'Keeps track of your activity on our site during a single visit (session) so we can understand how people interact with our pages.',
                '30 minutes',
              ],
              [
                '_fbp',
                'Used to store and track visits across the website.',
                '3 months',
              ],
              [
                '_gcl_au',
                'Used to store and track conversions (Google Adsense)',
                '3 months',
              ],
            ],
            cy: [
              [
                'SRM_B',
                "Mae'r cwci hwn yn cael ei osod gan Microsoft Bing Ads ac fe'i defnyddir i gasglu gwybodaeth defnyddiwr at ddibenion hysbysebu. Mae'n helpu i gyflwyno hysbysebion wedi'u targedu a mesur effeithiolrwydd ymgyrchoedd hysbysebu ar draws gwefannau.",
                '1 flwyddyn',
              ],
              [
                '_uetvid',
                "Mae hwn yn gwci a ddefnyddir gan Microsoft Bing Ads ac mae'n gwci olrhain. Mae'n caniatáu i ni ymgysylltu â defnyddiwr sydd wedi ymweld â'n gwefan o'r blaen.",
                '1 diwrnod',
              ],
              [
                '_uetsid',
                'Defnyddir gan Microsoft Bing Ads i olrhain ymddygiad defnyddwyr ar wefan.',
                '1 diwrnod',
              ],
              [
                'bcookie',
                "Mae'n helpu LinkedIn i olrhain gweithgaredd defnyddwyr, yn bennaf ar gyfer diogelwch a gwell Profiad defnyddiwr, ac yn cefnogi nodweddion fel mewngofnodi i ap LinkedIn.",
                '1 flwyddyn',
              ],
              [
                'li_gc',
                "Defnyddir gan LinkedIn i gofnodi a yw defnyddiwr wedi cytuno i'r defnydd o gwcis nad ydynt yn hanfodol ar LinkedIn i olrhain sgyrsiau a dadansoddi perfformiad hysbysebu.",
                '6 mis',
              ],
              [
                'lidc',
                "Defnyddir gan LinkedIn i ddewis y ganolfan ddata briodol ar gyfer gweithgaredd defnyddiwr i sicrhau bod eich gwybodaeth yn cael ei hanfon i'r lleoliad cywir.",
                '1 diwrnod',
              ],
              [
                'Muc_ads',
                'Defnyddir i olrhain rhyngweithiadau defnyddwyr â hysbysebion Twitter i wella targedu hysbysebion a mesur perfformiad.',
                '1 flwyddyn and 1 month',
              ],
              [
                'Personalization_id',
                'Defnyddir i bersonoli profiad y defnyddiwr, fel cofio dewisiadau neu arddangos cynnwys perthnasol',
                '8 wythnosau',
              ],
              [
                'test_cookie',
                "Mae'r cwci hwn yn cael ei osod gan blatfform hysbysebu Google DoubleClick i wirio a yw porwr defnyddiwr yn derbyn cwcis.",
                '15 munud',
              ],
              [
                '__adal_ca',
                "Cofnodi gwybodaeth am yr ymgyrch hysbysebu a ddaeth â chi i'n gwefan. Mae hyn yn ein helpu i fesur pa hysbysebion sydd fwyaf effeithiol.",
                '6 mis',
              ],
              [
                '__adal_cw',
                "Olrhain pa hysbysebion rydych eisoes wedi'u gweld felly nid ydym yn dangos yr un rhai ormod o weithiau i chi.",
                '7 diwrnod',
              ],
              [
                '__adal_id',
                'Storio dynodwr dienw fel y gall Adform adnabod eich porwr yn ystod ymweliad ac ar ymweliadau yn y dyfodol at ddibenion hysbysebu a dadansoddeg.',
                '1 flwyddyn',
              ],
              [
                '__adal_ses',
                "Cadw golwg ar eich gweithgaredd ar ein gwefan yn ystod un ymweliad (sesiwn) fel y gallwn ddeall sut mae pobl yn rhyngweithio â'n tudalennau.",
                '30 munud',
              ],
              [
                '_fbp',
                'Defnyddir i storio ac olrhain ymweliadau ar draws y wefan.',
                '3 mis',
              ],
              [
                '_gcl_au',
                'Defnyddir i storio ac olrhain sgyrsiau (Google Adsense)',
                '3 mis',
              ],
            ],
          }),
        },
      },
    ],
  };
};
