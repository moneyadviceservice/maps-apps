import {
  monthSelectOptions,
  saveSelectOptions,
} from 'data/baby-costs-calculator/select-options';
import { GroupType, TabPageData } from '@maps-react/pension-tools/types/forms';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const formGroups = {
  'b-bedroom': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: "Baby's bedroom",
      cy: 'Ystafell wely y babi',
    }),
    text: z({
      en: 'These items are nice to have but not essential. Many parents find them unnecessary, so you may not need to buy them.',
      cy: "Mae'r eitemau hyn yn braf i'w cael, ond nid yn hanfodol. Mae llawer o rieni yn eu gweld yn ddiangen, felly efallai na fyddwch angen eu prynu.",
    }),
    key: 'b-bedroom',
    type: GroupType.EXPANDABLE,
  }),
  't-and-p': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Travel and Playtime',
      cy: 'Teithio ac Amser Chwarae',
    }),
    text: z({
      en: 'These are items you might want for outings and playtime with your baby.',
      cy: "Mae'r rhain yn eitemau y gallech fod eu heisiau ar gyfer tripiau ac amser chwarae gyda'ch babi.",
    }),
    key: 't-and-p',
    type: GroupType.EXPANDABLE,
  }),
  feeding: (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Feeding',
      cy: 'Bwydo',
    }),
    text: z({
      en: 'These are items for feeding time that might help you and your baby.',
      cy: "Mae'r rhain yn eitemau ar gyfer amser bwydo a allai eich helpu chi a'ch babi.",
    }),
    key: 'feeding',
    type: GroupType.EXPANDABLE,
  }),
  'clothing-bathing': (z: ReturnType<typeof useTranslation>['z']) => ({
    label: z({
      en: 'Clothing, bathing, and changing',
      cy: 'Dillad, ymolchi a newid',
    }),
    key: 'clothing-bathing',
    type: GroupType.EXPANDABLE,
  }),
};

export const babyCostData = (
  z: ReturnType<typeof useTranslation>['z'],
  isEmbed: boolean,
): TabPageData => {
  return {
    toolHeading: z({
      en: 'Baby costs calculator',
      cy: 'Cyfrifiannell costau babi',
    }),
    summaryHeading: z({
      en: 'Summary so far',
      cy: 'Crynodeb hyd yn hyn',
    }),
    tabs: [
      {
        linkText: z({
          en: 'Baby Due Date',
          cy: 'Dyddiad Disgwyl geni babi',
        }),
        heading: z({
          en: 'When is your baby due?',
          cy: "Pryd mae disgwyl i'ch babi gael ei eni?",
        }),
        summary: {
          label: z({
            en: 'Baby due in',
            cy: 'Disgwyl eich babi mewn',
          }),
          unit: 'months',
          calc: 'exclude',
        },
        content: z({
          en: "Don't worry if you don't have a due date or are not pregnant yet, whatever you choose we can help you work out how much money you will have with a bit of budgeting and regular monthly saving.",
          cy: "Peidiwch â phoeni os nad oes gennych ddyddiad y mae disgwyl i'ch babi gael ei eni neu os nad ydych yn feichiog eto, beth bynnag a ddewiswch gallwn eich helpu i gyfrifo faint o arian fydd gennych gydag ychydig o gyllidebu a chynilo misol rheolaidd.",
        }),
        fields: [
          {
            key: 'baby-due',
            label: z({
              en: 'Your baby is due in:',
              cy: 'Disgwyl eich babi mewn:',
            }),
            type: 'select',
            options: monthSelectOptions(z),
            defaultSelectValue: '9',
            validation: {
              required: true,
              requiredPageMessage: z({
                en: 'Please select a date to continue.',
                cy: 'Dewiswch ddyddiad i barhau.',
              }),
              requiredInputMessage: z({
                en: 'Please select a date from below.',
                cy: "Gwall - dewiswch ddyddiad o'r isod.",
              }),
            },
          },
        ],
      },
      {
        linkText: z({
          en: 'Essential Items',
          cy: 'Eitemau hanfodol',
        }),
        heading: z({
          en: 'How much do your essential items cost?',
          cy: 'Faint mae eich eitemau hanfodol yn ei gostio?',
        }),
        summary: {
          label: z({
            en: 'Essentials',
            cy: 'Hanfodion',
          }),
          unit: 'pounds',
          calc: 'sub',
        },
        content: z({
          en: "These are the things you'll need after your baby is born. If you think you'll get some as gifts, leave the cost at £0.",
          cy: "Dyma'r pethau y byddwch eu hangen ar ôl i'ch babi gael ei eni. Os ydych yn meddwl y byddwch chi'n cael rhai fel anrhegion, cadwch y llithryddion ar £0.",
        }),
        fields: [
          {
            key: 'cot-cotbed',
            label: z({
              en: 'Cot (including mattress)',
              cy: 'Crud (yn cynnwys matres)',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about cots',
                cy: 'Mwy am grudiau',
              }),
              text: z({
                en: "If you're using a second-hand cot, cot bed or a moses basket, the NHS recommends buying a new mattress. Make sure it's firm, flat, fits well with no gaps, is clean, and waterproof.",
                cy: "Os ydych yn defnyddio crud ail-law, gwely crud neu fasged Moses, mae'r GIG yn argymell prynu matres newydd. Gwnewch yn siŵr ei fod yn gadarn, yn fflat, yn ffitio yn dda heb fylchau, yn lân, ac yn dal dŵr.",
              }),
            },
          },
          {
            key: 'bedding',
            label: z({
              en: 'Bedding, blankets and sleeping bags',
              cy: 'Dillad gwely, blancedi a sach gysgu',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about bedding',
                cy: 'Mwy am ddillad gwely',
              }),
              text: z({
                en: "You'll need sheets for the mattress. Fitted sheets are convenient but can be pricey, so old sheets can work too. You'll also need light blankets. Tuck sheets and blankets below your baby's shoulder level for safety. Alternatively, baby sleeping bags are also safe.",
                cy: "Byddwch angen blancedi ar gyfer y matres. Mae blancedi sy'n ffitio yn gyfleus ond gallant fod yn ddrud, felly gall hen flancedi weithio hefyd. Byddwch hefyd angen cael blancedi ysgafn. Rhowch ymyl y blancedi o dan lefel ysgwydd eich babi ar gyfer diogelwch. Fel arall, mae sachau cysgu babanod hefyd yn ddiogel.",
              }),
            },
          },
          {
            key: 'car-seat',
            label: z({
              en: 'Car seat',
              cy: 'Sedd car',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about car seats',
                cy: 'Mwy am seddi car',
              }),
              text: z({
                en: "Your baby must always travel in a car seat by law. Never use a second-hand car seat unless you're sure it hasn't been in an accident.",
                cy: "Rhaid i'ch babi bob amser deithio mewn sedd car yn ôl y gyfraith. Peidiwch byth â defnyddio sedd car ail-law oni bai eich bod yn siŵr nad yw wedi bod mewn damwain.",
              }),
            },
          },
          {
            key: 'pram',
            label: z({
              en: 'Pram, pushchair or travel system',
              cy: 'Pram, cadair gwthio neu system deithio',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about prams',
                cy: 'Mwy am bramiau',
              }),
              text: z({
                en: "Prams are for babies who can't sit up, pushchairs for those who can. A travel system is a pushchair that can also hold a car seat or carrycot. Buying second-hand can save money. Consider how and where you'll use it. Larger wheels are useful for rough paths, while a travel system that easily fits in and out of cars or buses may be needed.",
                cy: "Mae pramiau ar gyfer babanod na allant eistedd i fyny, mae cadeiriau gwthio ar gyfer y rhai sy'n gallu. Mae system deithio yn gadair wthio a all hefyd ddal sedd car neu grud cario. Gall prynu yn ail-law arbed arian. Ystyriwch sut a ble y byddwch chi'n ei ddefnyddio. Mae olwynion mwy yn ddefnyddiol ar gyfer llwybrau garw, neu efallai bydd angen system deithio sy'n ffitio'n hawdd i mewn ac allan o geir neu fysiau.",
              }),
            },
          },
          {
            key: 's-equip',
            label: z({
              en: 'Sterilising equipment',
              cy: 'Offer sterileiddio',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about sterilising equipment',
                cy: 'Mwy am offer sterileiddio',
              }),
              text: z({
                en: 'Bottles need to be sterilised to prevent harmful bacteria growth. You can boil items in a pan or use a microwave to sterilise them.',
                cy: "Mae angen sterileiddio poteli i atal twf bacteria niweidiol. Gallwch ferwi'r eitemau mewn sosban neu ddefnyddio microdon i'w sterileiddio.",
              }),
            },
          },
          {
            key: 'clothing',
            label: z({
              en: 'Essential clothing',
              cy: 'Dillad hanfodol',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about essential clothing',
                cy: 'Mwy am ddillad hanfodol',
              }),
              text: z({
                en: 'Babies outgrow clothes very quickly. Look for local baby clubs to swap clothes or get them for free, sometimes even brand new.',
                cy: "Mae babanod yn tyfu allan o'u dillad yn gyflym iawn. Chwiliwch am glybiau babanod lleol i gyfnewid dillad neu eu cael am ddim, weithiau hyd yn oed yn newydd sbon.",
              }),
            },
          },
          {
            key: 'nappies',
            label: z({
              en: 'Disposable or Reusable nappies',
              cy: 'Cewynnau tafladwy neu ailddefnyddiadwy',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about nappies',
                cy: 'Mwy am gewynnau',
              }),
              text: z({
                en: 'Newborns usually need 10 to 12 nappy changes a day.',
                cy: 'Fel arfer mae babanod newydd-anedig angen newid cewyn 10 i 12 gwaith y dydd.',
              }),
            },
          },
          {
            key: 'bottles',
            label: z({
              en: 'Baby bottles and teats',
              cy: 'Poteli babanod a thethi',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about bottles',
                cy: 'Mwy am boteli',
              }),
              text: z({
                en: "If you're bottle feeding your baby, you'll need baby bottles, teats and bottle brushes. These items are essential for feeding and keeping the bottles clean.",
                cy: "Os ydych yn bwydo eich babi gyda photel, bydd angen poteli, tethi a brwsys potel arnoch. Mae'r eitemau hyn yn hanfodol ar gyfer bwydo a chadw'r poteli yn lân.",
              }),
            },
          },
        ],
      },
      {
        linkText: z({
          en: 'Non-Essential Items',
          cy: 'Eitemau nad ydynt yn hanfodol',
        }),
        heading: z({
          en: 'How much do your non-essential items cost?',
          cy: 'Faint mae eich eitemau nad ydynt yn hanfodol yn ei gostio?',
        }),
        summary: {
          label: z({
            en: 'Non-Essentials',
            cy: 'Eitemau nad ydynt yn hanfodol',
          }),
          unit: 'pounds',
          calc: 'sub',
        },
        content: z({
          en: "From here on, this is a list of non-essential items which are nice to have but you could do without. Don't feel pressured into buying them because many parents say that they are a waste of money.",
          cy: "O hyn ymlaen, dyma restr o eitemau nad ydynt yn hanfodol sy'n braf eu cael ond fe allech wneud hebddynt. Peidiwch â theimlo dan bwysau i'w prynu oherwydd bod llawer o rieni yn dweud eu bod yn wastraff arian.",
        }),
        fields: [
          // Baby's bedroom
          {
            key: 'changing-table',
            label: z({
              en: 'Changing table',
              cy: 'Bwrdd newid',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about changing tables',
                cy: 'Mwy am fyrddau newid',
              }),
              text: z({
                en: 'Many parents regret buying this because it takes up space and is rarely used.',
                cy: 'Mae llawer o rieni yn difaru prynu hwn oherwydd ei fod yn cymryd lle ac yn cael ei ddefnyddio yn anaml.',
              }),
            },
            group: formGroups['b-bedroom'](z),
          },
          {
            key: 'baby-monitor',
            label: z({
              en: 'Baby monitor',
              cy: 'Monitor babi',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby monitors',
                cy: 'Mwy am fonitor babi',
              }),
              text: z({
                en: 'Some parents find using a baby monitor reassuring, while others never use it. If you live in a small home and can hear your baby, you might not need one.',
                cy: 'Mae rhai rhieni yn gweld bod defnyddio monitor babi yn gysur, tra bod eraill byth yn ei ddefnyddio. Os ydych yn byw mewn cartref bach ac yn gallu clywed eich babi, efallai na fyddwch angen un.',
              }),
            },
            group: formGroups['b-bedroom'](z),
          },
          {
            key: 'mobile',
            label: z({
              en: 'Baby mobile',
              cy: 'Tegan symudol babi',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about mobiles',
                cy: 'Mwy am degannau symudol babi',
              }),
              text: z({
                en: 'A cheap cot or crib baby mobile can entertain and calm your baby.',
                cy: 'Gall Tegan symudol babi ar gyfer crud ddiddanu a thawelu eich babi.',
              }),
            },
            group: formGroups['b-bedroom'](z),
          },
          {
            key: 'room-thermometer',
            label: z({
              en: 'Room thermometer',
              cy: 'Thermomedr ystafell',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about room thermometers',
                cy: 'Mwy am thermomedrau ystafell',
              }),
              text: z({
                en: "A room thermometer can tell you if your baby's room is too hot, and you don't need to spend a lot on it.",
                cy: "Gall thermomedr ystafell ddweud wrthych a yw ystafell eich babi'n rhy boeth, ac nid oes angen i chi wario llawer arno.",
              }),
            },
            group: formGroups['b-bedroom'](z),
          },
          {
            key: 'nightlight',
            label: z({
              en: 'Nightlight',
              cy: 'Golau nos',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about nightlights',
                cy: 'Mwy am oleuadau nos',
              }),
              text: z({
                en: 'Some parents find it helps their baby fall asleep.',
                cy: "Mae rhai rhieni'n gweld ei fod yn helpu eu babi i gysgu.",
              }),
            },
            group: formGroups['b-bedroom'](z),
          },
          // Travel & Playtime
          {
            key: 'travel-cot',
            label: z({
              en: 'Travel cot',
              cy: 'Crud teithio',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about travel cots',
                cy: 'Mwy am grudiau teithio',
              }),
              text: z({
                en: 'You only need a travel cot if you plan to stay overnight away from home with your baby.',
                cy: "Dim ond os ydych chi'n bwriadu aros dros nos i ffwrdd o gartref gyda'ch babi y byddwch angen crud teithio.",
              }),
            },
            group: formGroups['t-and-p'](z),
          },
          {
            key: 'b-s-carrier',
            label: z({
              en: 'Baby carrier or sling',
              cy: 'Cludwr babi neu sling',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby carriers',
                cy: 'Mwy am gludwyr babi',
              }),
              text: z({
                en: "Many parents feel a fancy carrier or sling isn't worth the money. It's a good idea to try different brands before you buy one.",
                cy: "Mae llawer o rieni yn teimlo nad yw cludwr ffansi neu sling yn werth yr arian. Mae'n syniad da rhoi cynnig ar wahanol frandiau cyn prynu un.",
              }),
            },
            group: formGroups['t-and-p'](z),
          },
          {
            key: 'c-bag',
            label: z({
              en: 'Baby changing bag',
              cy: 'Bag newid',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby changing bags',
                cy: 'Mwy am fagiau newid babi',
              }),
              text: z({
                en: 'You can use any bag as a changing bag. You might already have one that fits a few nappies and baby-changing essentials.',
                cy: "Gallwch ddefnyddio unrhyw fag fel bag newid. Efallai bod gennych un eisoes sy'n addas i gario ychydig o gewynnau a hanfodion newid babi.",
              }),
            },
            group: formGroups['t-and-p'](z),
          },
          {
            key: 'playmat',
            label: z({
              en: 'Playmat',
              cy: 'Mat chwarae',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about playmats',
                cy: 'Mwy am fatiau chwarae ',
              }),
              text: z({
                en: 'Not essential, but great for your newborn to get some exercise and playtime.',
                cy: "Nid yw'n hanfodol, ond yn wych i'ch baban newydd gael rhywfaint o ymarfer corff ac amser chwarae.",
              }),
            },
            group: formGroups['t-and-p'](z),
          },
          {
            key: 'bouncer',
            label: z({
              en: 'Baby bouncer or rocker',
              cy: 'Siglwr babi',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby bouncers',
                cy: 'Mwy am siglwyr babi',
              }),
              text: z({
                en: "Some babies love them, some don't. They can be helpful if you need free hands for a few minutes.",
                cy: "Mae rhai babanod wrth eu bodd gyda hwy, ond nid yw pob un. Gallant fod yn ddefnyddiol os ydych angen eich dwylo'n rhydd am ychydig funudau.",
              }),
            },
            group: formGroups['t-and-p'](z),
          },
          {
            key: 'rattles',
            label: z({
              en: 'Rattles, teether and other toys',
              cy: 'Ratl, danneddwr a theganau eraill',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby toys',
                cy: 'Mwy am deganau babi',
              }),
              text: z({
                en: 'You might get these as gifts or make your own. You could also look at swapping toys with friends for variety.',
                cy: 'Efallai y byddwch yn cael y rhain fel anrhegion neu wneud rhai eich hun. Gallech hefyd edrych ar gyfnewid teganau gyda ffrindiau am amrywiaeth.',
              }),
            },
            group: formGroups['t-and-p'](z),
          },
          // Feeding
          {
            key: 'b-pumps',
            label: z({
              en: 'Breast pump',
              cy: 'Pwmp y fron',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about breast pumps',
                cy: "Mwy am bympiau'r fron",
              }),
              text: z({
                en: 'Electric pumps are usually more expensive than manual ones. You might also be able to rent a pump from your local breastfeeding clinic.',
                cy: "Mae pympiau trydan fel arfer yn ddrutach na rhai llaw. Efallai y byddwch hefyd yn gallu rhentu pwmp o'ch clinig bwydo ar y fron lleol.",
              }),
            },
            group: formGroups['feeding'](z),
          },
          {
            key: 'bras-pads',
            label: z({
              en: 'Maternity bras',
              cy: 'Bras mamolaeth',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about maternity bras',
                cy: 'Mwy am fras mamolaeth',
              }),
              text: z({
                en: 'Maternity bras cost more than regular ones but can be more comfortable for long-term breastfeeding. Some women prefer using large, non-wired bras instead.',
                cy: "Mae bras mamolaeth yn costio mwy na rhai arferol ond gallant fod yn fwy cyfforddus ar gyfer bwydo ar y fron yn y tymor hir. Mae'n well gan rai merched ddefnyddio bras mawr, heb wifrau yn lle hynny.",
              }),
            },
            group: formGroups['feeding'](z),
          },
          {
            key: 'muslins',
            label: z({
              en: 'Muslin cloths and bibs',
              cy: 'Clytiau a bibiau mwslin',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about muslin cloths and bibs',
                cy: 'Mwy am gadachau a bibiau musli',
              }),
              text: z({
                en: 'You can use old towels or other fabric items as substitutes.',
                cy: 'Gallwch ddefnyddio hen dyweli neu eitemau ffabrig eraill yn eu lle.',
              }),
            },
            group: formGroups['feeding'](z),
          },
          {
            key: 'n-pillows',
            label: z({
              en: 'Nursing pillow',
              cy: 'Gobennydd nyrsio',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about nursing pillows',
                cy: 'Mwy am gobenyddion nyrsio',
              }),
              text: z({
                en: 'Old towels or pillows and cushions can also be used instead of a nursing pillow.',
                cy: 'Gellir defnyddio hen dywelion neu glustogau yn lle clustog nyrsio.',
              }),
            },
            group: formGroups['feeding'](z),
          },
          {
            key: 'dummies',
            label: z({
              en: 'Dummies',
              cy: 'Dymis',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about dummies',
                cy: 'Mwy am ddymis babi',
              }),
              text: z({
                en: "Using dummies is a personal choice. Some babies don't need them.",
                cy: 'Mae defnyddio dwmi yn ddewis personol. Nid yw babanod eu hangen.',
              }),
            },
            group: formGroups['feeding'](z),
          },
          {
            key: 'highchair',
            label: z({
              en: 'Highchair',
              cy: 'Cadair uchel',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about highchairs',
                cy: 'Mwy am gadeiriau uchel',
              }),
              text: z({
                en: 'A highchair might be useful when your baby gets older.',
                cy: "Gallai cadair uchel fod yn ddefnyddiol pan fydd eich babi'n tyfu.",
              }),
            },
            group: formGroups['feeding'](z),
          },
          {
            key: 'weaning',
            label: z({
              en: 'Weaning accessories',
              cy: 'Ategolion diddyfnu',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about weaning',
                cy: 'Mwy am ddiddyfnu',
              }),
              text: z({
                en: 'When transitioning your baby to solid foods, you might need items like weaning spoons, bowls, and bottles.',
                cy: 'Wrth symud eich babi i fwydydd solet, efallai y byddwch angen eitemau fel llwyau diddyfnu, powlenni a photeli.',
              }),
            },
            group: formGroups['feeding'](z),
          },
          // clothing-bathing
          {
            key: 'b-bath',
            label: z({
              en: 'Baby bath',
              cy: 'Bath babi',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby baths',
                cy: 'Mwy am fath babi',
              }),
              text: z({
                en: 'A baby bath is nice to have, but lots of parents say that they bought one, yet never used them, preferring to wash their baby in the bath.',
                cy: "Mae bath babi yn braf i'w gael, ond mae llawer o rieni'n dweud eu bod wedi prynu un, ond byth yn ei ddefnyddio, mae'n well ganddynt olchi eu babi yn y bath.",
              }),
            },
            group: formGroups['clothing-bathing'](z),
          },
          {
            key: 'b-towel',
            label: z({
              en: 'Baby towel',
              cy: 'Tywel babi',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about baby towels',
                cy: 'Mwy am dywelion babi',
              }),
              text: z({
                en: 'There is no need to go out and buy towels specifically made for babies, as any towel will dry your little one.',
                cy: "Nid oes angen mynd allan a phrynu tyweli sydd wedi'i greu yn enwedig am fabanod, gan fydd unrhyw dywel yn sychu eich babi.",
              }),
            },
            group: formGroups['clothing-bathing'](z),
          },
          {
            key: 'b-thermometer',
            label: z({
              en: 'Bath thermometer',
              cy: 'Thermomedr bath',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about bath thermometers',
                cy: 'Mwy am thermomedrau bath',
              }),
              text: z({
                en: 'Many parents use their elbow to test how warm the water is but if you want one, a baby bath thermometer can cost as little as a few pounds.',
                cy: "Mae nifer o rieni yn defnyddio'r prawf penelin i brofi pa mor dwym yw'r dŵr, ond os ydych eisiau un mae thermomedr bath babi yn costio ychydig bunnoedd yn unig.",
              }),
            },
            group: formGroups['clothing-bathing'](z),
          },
          {
            key: 'g-essentials',
            label: z({
              en: 'Baby grooming items ',
              cy: 'Eitemau paratoi babanod',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about grooming items ',
                cy: 'Mwy am eitemau paratoi',
              }),
              text: z({
                en: 'This includes nail clippers, brush or comb, toothbrush and any other grooming essentials you need.',
                cy: 'Mae hyn yn cynnwys clipwyr ewinedd, brwsh neu grib, brwsh dannedd ac unrhyw hanfodion ymbincio eraill sydd ei angen arnoch.',
              }),
            },
            group: formGroups['clothing-bathing'](z),
          },
        ],
      },
      {
        linkText: z({
          en: 'Your Budget',
          cy: 'Eich cyllideb',
        }),
        heading: z({
          en: 'Your budget',
          cy: 'Eich cyllideb',
        }),
        summary: {
          label: z({
            en: 'Your Budget',
            cy: 'Eich cyllideb',
          }),
          unit: 'pounds',
          calc: 'add',
        },
        content: z({
          en: (
            <>
              <Paragraph className="mb-6 text-2xl">
                Now that you have a list of items and their estimated costs for
                your new baby, it&apos;s time to see if it fits within your
                budget.
              </Paragraph>
              <Heading level="h2" className="mb-8 text-blue-800">
                How much money do you have now?
              </Heading>
            </>
          ),
          cy: (
            <>
              <Paragraph className="mb-6 text-2xl">
                Nawr bod gennych restr o eitemau a&apos;u costau amcangyfrifedig
                ar gyfer eich babi newydd, mae&apos;n bryd gweld a yw&apos;n
                cyd-fynd â&apos;ch cyllideb.
              </Paragraph>
              <Heading level="h2" className="mb-8 text-blue-800">
                Faint o arian sydd gennych chi nawr?
              </Heading>
            </>
          ),
        }),
        fields: [
          {
            key: 'in-bank',
            label: z({
              en: 'Money in the bank',
              cy: 'Arian yn y banc',
            }),
            description: z({
              en: 'Check your current savings and funds.',
              cy: 'Dylech gynnwys unrhyw gynilion sydd gennych.',
            }),
            type: 'input-currency',
            placeholder: '0.00',
            expandableContent: {
              title: z({
                en: 'More about your budget',
                cy: 'Mwy am eich cyllideb',
              }),
              text: z({
                en: "Consider the money in your bank and your budget for baby items. If you're over budget, you can cut back on non-essential items.",
                cy: "Ystyriwch yr arian yn eich banc a'ch cyllideb ar gyfer eitemau babanod. Os ydych dros y gyllideb, gallwch dorri'n ôl ar eitemau nad ydynt yn hanfodol.",
              }),
            },
          },
          {
            key: 'can-save',
            connectField: 'baby-due',
            label: z({
              en: 'How much will you be able to save before the baby arrives?',
              cy: "Faint gallwch chi gynilo cyn i'r babi cyrraedd?",
            }),
            type: 'input-currency-with-select',
            options: saveSelectOptions(z),
            placeholderInput: '0.00',
            defaultSelectValue: '30',
            expandableContent: {
              title: z({
                en: 'More about your savings',
                cy: 'Mwy am eich cynilion',
              }),
              text: z({
                en: (
                  <>
                    Look at any non-essential spending you can reduce. For
                    example, giving up a daily hot drink could save you £60 a
                    month. Find out how much you can save in our guide{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                      target={isEmbed ? '_blank' : '_self'}
                    >
                      Managing your money
                    </Link>
                    .
                  </>
                ),
                cy: (
                  <>
                    Edrychwch ar unrhyw wariant nad yw&apos;n hanfodol y gallwch
                    ei leihau. Er enghraifft, gallai rhoi&apos;r gorau i ddiod
                    boeth dyddiol arbed £60 y mis i chi. Darganfyddwch faint y
                    gallwch ei arbed yn ein canllaw{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/beginners-guide-to-managing-your-money"
                      target={isEmbed ? '_blank' : '_self'}
                    >
                      Rheoli eich arian
                    </Link>
                    .
                  </>
                ),
              }),
            },
          },
        ],
      },
      {
        linkText: z({
          en: 'Your Results',
          cy: 'Eich canlyniadau',
        }),
        heading: z({
          en: 'Your results',
          cy: 'Eich canlyniadau',
        }),
        summary: {
          label: z({
            en: 'Result',
            cy: 'Canlyniad',
          }),
          unit: 'pounds',
          calc: 'result',
        },
        result: {
          success: {
            title: z({
              en: 'Your baby costs leave you with:',
              cy: 'Mae eich costau babi yn eich gadael gyda:',
            }),
            content: z({
              en: "Good news! It looks like you can afford everything you want to buy for your baby - you'll even have {amount} left over.",
              cy: "Newyddion da! Mae'n edrych fel petaech chi'n gallu fforddio popeth rydych eisiau ei brynu ar gyfer eich baban - bydd gennych hyd yn oed rywfaint {amount} dros ben.",
            }),
          },
          error: {
            title: z({
              en: 'Your baby costs leave you with:',
              cy: 'Mae eich costau babi yn eich gadael gyda:',
            }),
            content: z({
              en: "It looks like you're planning to spend more than you can save before your baby arrived, leaving you {amount} out of pocket. Is there anything you can do without? Or could you cut costs by buying second-hand?",
              cy: "Mae'n edrych fel petaech yn bwriadu gwario mwy nag y gallwch gynilo cyn i'ch babi gyrraedd, gan eich gadael {amount} yn brin o arian. Oes yna unrhyw beth y gallech fyw hebddo? Neu a allech leihau costau trwy brynu'n ail law?",
            }),
          },
          subHeading: z({
            en: 'A breakdown of your spending',
            cy: "Dadansoddiad o'ch gwariant",
          }),
        },
      },
    ],
  };
};
