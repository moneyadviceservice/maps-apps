import { TranslationGroup, TranslationGroupString } from 'types';
import { Link, ListElement } from '@maps-digital/shared/ui';

interface Condition {
  question: string;
  answer: string;
}

type Tile = {
  id: string;
  title: {
    en: string;
    cy: string;
  };
  content: TranslationGroup;
  conditions?: Condition[];
};

type Data = {
  title: TranslationGroupString;
  intro: TranslationGroupString;
  tiles: Tile[];
};

const tiles: Tile[] = [
  {
    id: '1',
    title: {
      en: 'Get help with your current finances',
      cy: `Cael help gyda'ch cyllid presennol`,
    },
    content: {
      en: (
        <div>
          <p>
            If you're struggling, borrowing money might seem your only option.
            But it can make things worse. You're not alone and help is
            available.
          </p>
          <br />
          <p>Here's what to do:</p>
          <br />
          <ListElement
            variant="ordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                Use our{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/bill-prioritiser"
                  target="_blank"
                >
                  Bill prioritiser
                </Link>{' '}
                to help you understand which debt to tackle first.
              </span>,
              <span>
                If you think you'll miss a payment,{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/talking-to-your-creditor"
                  target="_blank"
                >
                  contact your creditor
                </Link>{' '}
                to let them know.
              </span>,
              <span>
                If you've already missed a payment, use our{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator"
                  target="_blank"
                >
                  Debt advice locator tool
                </Link>
                .
              </span>,
              <span>
                Use a{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/en/benefits/benefits-calculator"
                  target="_blank"
                >
                  Benefits calculator
                </Link>{' '}
                to see if you qualify for any support.
              </span>,
              <span>
                Use our{' '}
                <Link
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner'
                  }
                  target="_blank"
                >
                  Budget planner
                </Link>{' '}
                to keep track of your money and bills.
              </span>,
            ]}
          />
        </div>
      ),
      cy: (
        <div>
          <p>
            Os ydych yn cael trafferth, efallai bod benthyca arian yn ymddangos
            fel eich unig opsiwn. Ond gall wneud pethau'n waeth. Nid ydych ar
            eich pen eich hun ac mae help ar gael.
          </p>
          <br />
          <p>Dyma beth i'w wneud:</p>
          <br />
          <ListElement
            variant="ordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                Defnyddiwch ein{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/bill-prioritiser"
                  target="_blank"
                >
                  Blaenoriaethwr Biliau
                </Link>{' '}
                i'ch helpu i ddeall pa ddyled i fynd i'r afael â hi'n gyntaf.
              </span>,
              <span>
                Os credwch y byddwch yn methu taliad,{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/talking-to-your-creditor"
                  target="_blank"
                >
                  cysylltwch â'ch credydwr
                </Link>{' '}
                i roi gwybod iddynt.
              </span>,
              <span>
                Os ydych eisoes wedi methu taliad, defnyddiwch ein{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator"
                  target="_blank"
                >
                  Teclyn lleolwr cyngor ar ddyledion
                </Link>
                .
              </span>,
              <span>
                Defnyddiwch{' '}
                <Link
                  asInlineText
                  href="https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator"
                  target="_blank"
                >
                  Gyfrifiannell budd-daliadau
                </Link>{' '}
                i weld a ydych yn gymwys i gael unrhyw gymorth.
              </span>,
              <span>
                Defnyddiwch ein{' '}
                <Link
                  asInlineText
                  href={
                    'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner'
                  }
                  target="_blank"
                >
                  Cynlluniwr cyllideb
                </Link>{' '}
                i gadw llygad ar eich arian a'ch biliau.
              </span>,
            ]}
          />
        </div>
      ),
    },
    conditions: [
      {
        question: '6',
        answer: '1',
      },
    ],
  },
  {
    id: '2',
    title: {
      en: 'Wait for six months before applying again',
      cy: 'Arhoswch chwe mis cyn gwneud cais eto',
    },
    content: {
      en: (
        <>
          <p>
            Multiple applications in a short time period can damage your credit
            score. You could appear desperate for credit, so lenders might be
            less likely to lend to you.
          </p>
          <br />
          <p>
            Instead, ask why you were declined. You might be able to fix the
            problem or appeal the decision.
          </p>
          <br />
          <p>
            If that doesn't work, it's usually best to wait six months before
            trying again.
          </p>
          <p>
            If you can't wait, you could consider other ways to borrow, such as
            from your{' '}
            <Link
              asInlineText
              href={
                'https://www.moneyhelper.org.uk/en/everyday-money/credit/credit-unions'
              }
              target="_blank"
            >
              local credit union
            </Link>{' '}
            or a{' '}
            <Link
              asInlineText
              href={
                'https://www.moneyhelper.org.uk/en/everyday-money/credit/budgeting-loans-and-budgeting-advances'
              }
              target="_blank"
            >
              Budgeting Loan or Advance
            </Link>{' '}
            if you receive certain benefits.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Gall ceisiadau lluosog mewn cyfnod byr niweidio eich sgôr credyd.
            Efallai y byddwch yn ymddangos yn daer am gredyd, felly bydd
            benthycwyr yn llai tebygol o roi benthyg i chi.
          </p>
          <br />
          <p>
            Yn lle, gofynnwch pam y cawsoch eich gwrthod. Efallai gallwch
            ddatrys y broblem neu apelio yn erbyn y penderfyniad.
          </p>
          <br />
          <p>
            Os nad yw hynny'n gweithio, fel arfer mae'n well aros chwe mis cyn
            ceisio eto.
          </p>
          <p>
            Os na allwch aros, gallech ystyried ffyrdd eraill o fenthyca, fel
            gan eich{' '}
            <Link
              asInlineText
              href={
                'https://www.moneyhelper.org.uk/cy/everyday-money/credit/credit-unions'
              }
              target="_blank"
            >
              undeb credyd lleol
            </Link>{' '}
            neu{' '}
            <Link
              asInlineText
              href={
                'https://www.moneyhelper.org.uk/cy/everyday-money/credit/budgeting-loans-and-budgeting-advances'
              }
              target="_blank"
            >
              Benthyciadau Trefnu a Thaliadau Cyllidebu Ymlaen Llaw
            </Link>{' '}
            os ydych yn derbyn budd-daliadau penodol.
          </p>
        </>
      ),
    },
    conditions: [
      {
        question: '1',
        answer: '0',
      },
    ],
  },
  {
    id: '3',
    title: {
      en: 'Check your credit report for errors',
      cy: 'Gwiriwch eich adroddiad credyd am wallau',
    },
    content: {
      en: (
        <>
          <p>
            Make sure all your details are correct at the three credit reference
            agencies. You can check for free using:
          </p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                <Link
                  asInlineText
                  href="https://www.moneysavingexpert.com/creditclub/"
                  target="_blank"
                >
                  MoneySavingExpert's Credit Club
                </Link>{' '}
                for Experian
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.clearscore.com/"
                  target="_blank"
                >
                  ClearScore
                </Link>{' '}
                for Equifax
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.creditkarma.co.uk/"
                  target="_blank"
                >
                  Credit Karma
                </Link>{' '}
                for TransUnion
              </span>,
            ]}
          />
          <br />
          <p>
            Report any mistakes to the credit reference agency straight away -
            even a typo in your address can affect an application.
          </p>
          <br />
          <p>
            If you spot products in your name that you didn't apply for, you
            could be a victim of{' '}
            <Link
              asInlineText
              href={
                'https://www.moneyhelper.org.uk/en/everyday-money/credit/identity-theft-and-scams-what-you-are-liable-for'
              }
              target="_blank"
            >
              identity theft
            </Link>
            . You should also:
          </p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                Speak to the provider of any fraudulent account listed on your
                file
              </span>,
              <span>
                Report the crime to{' '}
                <Link
                  asInlineText
                  href={
                    'https://www.actionfraud.police.uk/reporting-fraud-and-cyber-crime'
                  }
                  target="_blank"
                >
                  Action Fraud
                </Link>{' '}
                or by calling 101 in Scotland.
              </span>,
            ]}
          />
          <p>
            You could also consider paying for{' '}
            <Link
              asInlineText
              href={'https://www.cifas.org.uk/pr'}
              target="_blank"
            >
              Cifas Protective Registration
            </Link>
            . This tells lenders you've been a victim of fraud, so they'll make
            extra checks to make sure any new application for credit is genuine.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Sicrhewch fod eich holl fanylion yn gywir yn y tair asiantaeth
            gwirio credyd. Gallwch wirio am ddim gan ddefnyddio:
          </p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                <Link
                  asInlineText
                  href="https://www.moneysavingexpert.com/creditclub/"
                  target="_blank"
                >
                  Clwb Credyd MoneySavingExpert
                </Link>{' '}
                ar gyfer Experian
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.clearscore.com/"
                  target="_blank"
                >
                  ClearScore
                </Link>{' '}
                ar gyfer Equifax
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.creditkarma.co.uk/"
                  target="_blank"
                >
                  Credit Karma
                </Link>{' '}
                ar gyfer TransUnion
              </span>,
            ]}
          />
          <br />
          <p>
            Rhowch wybod am unrhyw gamgymeriadau i'r asiantaeth gwirio credyd ar
            unwaith - gall hyd yn oed teipo yn eich cyfeiriad effeithio ar gais.
          </p>
          <br />
          <p>
            Os gwelwch gynhyrchion yn eich enw na wnaethoch gais amdanynt,
            gallech fod yn ddioddefwr{' '}
            <Link
              asInlineText
              href={
                'https://www.moneyhelper.org.uk/cy/everyday-money/credit/identity-theft-and-scams-what-you-are-liable-for'
              }
              target="_blank"
            >
              lladrad hunaniaeth
            </Link>
            . Dylech hefyd:
          </p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                siarad â darparwr unrhyw gyfrif twyllodrus a restrir ar eich
                ffeil
              </span>,
              <span>
                rhoi gwybod am y drosedd i{' '}
                <Link
                  asInlineText
                  href={
                    'https://www.actionfraud.police.uk/reporting-fraud-and-cyber-crime'
                  }
                  target="_blank"
                >
                  Action Fraud
                </Link>{' '}
                neu drwy ffonio 101 yn yr Alban.
              </span>,
            ]}
          />
          <p>
            Gallech hefyd ystyried talu am{' '}
            <Link
              asInlineText
              href={'https://www.cifas.org.uk/pr'}
              target="_blank"
            >
              Gofrestriad Diogelwch Cifas
            </Link>
            . Mae hyn yn rhoi gwybod i fenthycwyr eich bod wedi dioddef twyll,
            felly byddant yn gwneud gwiriadau ychwanegol i sicrhau bod unrhyw
            gais newydd am gredyd yn ddilys.
          </p>
        </>
      ),
    },
    conditions: [
      {
        question: '2',
        answer: '1',
      },
    ],
  },
  {
    id: '4',
    title: {
      en: "Make sure you're managing existing credit well",
      cy: 'Sicrhewch eich bod yn rheoli credyd presennol yn dda',
    },
    content: {
      en: (
        <>
          <p>
            When you apply for credit, lenders decide if you can afford to repay
            it. Part of this is looking at how well you manage your existing
            credit commitments, like loan or credit card repayments and using an
            overdraft.
          </p>
          <br />
          <p>
            For example, if you're already maxed out on a credit card, only pay
            the minimum repayment each month or use it to take out cash, lenders
            might think you couldn't take on more credit.
          </p>
          <br />
          <p>
            If you can afford to, try to repay as much as you can so you're less
            reliant on credit. See{' '}
            <Link
              asInlineText
              href="https://www.moneyhelper.org.uk/en/money-troubles/cost-of-living/using-credit-wisely#manage-credit-repayments"
              target="_blank"
            >
              Manage your credit repayments
            </Link>{' '}
            for more help.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Pan fyddwch yn gwneud cais am gredyd, mae benthycwyr yn penderfynu a
            allwch fforddio ei ad-dalu. Mae rhan o hyn yn edrych ar ba mor dda
            yr ydych yn rheoli eich ymrwymiadau presennol, fel ad-daliadau
            benthyciad neu gerdyn credyd a defnyddio gorddrafft.
          </p>
          <br />
          <p>
            Er enghraifft, os ydych eisoes wedi cyrraedd terfyn cerdyn credyd,
            dim ond yn talu isafswm yr ad-daliadau bob mis neu'n ei ddefnyddio i
            dynnu arian, efallai bydd credydwyr yn meddwl na allech gymryd mwy o
            gredyd.
          </p>
          <br />
          <p>
            Os gallwch fforddio gwneud, ceisiwch ad-dalu cymaint ag y gallwch
            fel eich bod yn llai dibynnol ar gredyd. Gweler{' '}
            <Link
              asInlineText
              href="https://www.moneyhelper.org.uk/cy/money-troubles/cost-of-living/using-credit-wisely#manage-credit-repayments"
              target="_blank"
            >
              Rheoli eich ad-daliadau credyd
            </Link>{' '}
            am fwy o help.
          </p>
        </>
      ),
    },
    conditions: [
      {
        question: '5',
        answer: '0',
      },
    ],
  },
  {
    id: '5',
    title: {
      en: 'Check how your linked finances affect you',
      cy: 'Gwiriwch sut mae eich cyllid cysylltiedig yn effeithio arnoch chi',
    },
    content: {
      en: (
        <>
          <p>
            A joint account links you financially to another person. This means
            companies will look at both of your credit histories as part of any
            credit checks.
          </p>
          <br />
          <p>
            So, if the person you're financially linked to has a poor credit
            history, this might lower your chances of acceptance. Ask them to
            complete this tool to identify if there are any potential problems.
          </p>
          <br />
          <p>
            If you no longer have any financial connection to them (so no open
            joint account, loan or mortgage) you can ask the credit reference
            agencies to issue a 'notice of disassociation'. This stops the other
            person affecting your future credit applications.
          </p>
          <br />
          <p>The three agencies to contact are:</p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                <Link
                  asInlineText
                  href="https://www.equifax.co.uk/Contact-us/Contact_Us_Personal_Solutions.html"
                  target="_blank"
                >
                  Equifax
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://ins.experian.co.uk/disassociation"
                  target="_blank"
                >
                  Experian
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.transunion.co.uk/consumer/consumer-enquiry-form"
                  target="_blank"
                >
                  TransUnion
                </Link>
              </span>,
            ]}
          />
        </>
      ),
      cy: (
        <>
          <p>
            Mae cyfrif ar y cyd yn eich cysylltu'n ariannol â pherson arall. Mae
            hyn yn golygu y bydd cwmnïau'n edrych ar hanes credyd y ddau ohonoch
            fel rhan o unrhyw wiriadau credyd.
          </p>
          <br />
          <p>
            Felly, os oes ganddynt hanes credyd gwael, gallai hyn leihau eich
            cyfle o gael eich derbyn. Gofynnwch iddynt gwblhau'r teclyn hwn i
            adnabod a oes unrhyw broblemau posibl.
          </p>
          <br />
          <p>
            Os nad oes gennych unrhyw gysylltiad ariannol â nhw mwyach (dim
            cyfrif ar y cyd, benthyciad neu forgais agored) gallwch ofyn i'r
            asiantaeth gwirio credyd gyhoeddi 'hysbysiad datgysylltiad'. Mae hyn
            yn eu hatal rhag effeithio ar eich ceisiadau credyd yn y dyfodol.
          </p>
          <br />
          <p>Y tri i gysylltu â nhw yw:</p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                <Link
                  href="https://www.equifax.co.uk/Contact-us/Contact_Us_Personal_Solutions.html"
                  target="_blank"
                >
                  Equifax
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://ins.experian.co.uk/disassociation"
                  target="_blank"
                >
                  Experian
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.transunion.co.uk/consumer/consumer-enquiry-form"
                  target="_blank"
                >
                  TransUnion
                </Link>
              </span>,
            ]}
          />
        </>
      ),
    },
    conditions: [
      {
        question: '8',
        answer: '0',
      },
    ],
  },
  {
    id: '6',
    title: {
      en: "Update your bank and credit lenders' records",
      cy: 'Diweddarwch gofnodion eich banc a benthycwyr credyd',
    },
    content: {
      en: (
        <>
          <p>
            Lenders might reject your application if your details don't match
            the information on your credit file. For example, you apply using
            your new address but your bank thinks you're living somewhere else.
          </p>
          <br />
          <p>
            Spend some time checking that all your accounts have the correct
            details.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Efallai y bydd benthycwyr yn gwrthod eich cais os nad yw eich
            manylion yn cyfateb i'r wybodaeth ar eich ffeil credyd. Er
            enghraifft, rydych yn gwneud eich cais gan ddefnyddio eich cyfeiriad
            newydd ond mae eich banc yn meddwl eich bod yn byw yn rhywle arall.
          </p>
          <br />
          <p>
            Treuliwch ychydig o amser yn gwirio bod y manylion cywir gan eich
            holl gyfrifon.
          </p>
        </>
      ),
    },
    conditions: [
      {
        question: '4',
        answer: '0',
      },
    ],
  },
  {
    id: '7',
    title: {
      en: 'Register to vote at your current address',
      cy: 'Cofrestrwch i bleidleisio yn eich cyfeiriad presennol',
    },
    content: {
      en: (
        <>
          <p>
            When you apply for credit, lenders need to check your identity and
            proof of address.
          </p>
          <br />
          <p>
            Registering to vote at your current address helps verify where you
            live, which can improve your chances of being accepted.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Pan fyddwch yn gwneud cais am gredyd, mae angen i fenthycwyr wirio
            pwy ydych a chyfeiriad
          </p>
          <br />
          <p>
            Mae cofrestru i bleidleisio yn eich cyfeiriad presennol yn helpu i
            gadarnhau ble rydych yn byw, a all wella eich cyfle o gael eich
            derbyn.
          </p>
        </>
      ),
    },
    conditions: [
      {
        question: '7',
        answer: '1',
      },
    ],
  },
  {
    id: '8',
    title: {
      en: 'Open a bank account and/or set up Direct Debits',
      cy: 'Agorwch gyfrif banc a/neu sefydlwch Ddebydau Uniongyrchol',
    },
    content: {
      en: (
        <>
          <p>
            Lenders use your credit history to predict if you're likely to make
            your repayments on time. But if you're new to credit, you won't have
            built up a credit history.
          </p>
          <br />
          <p>
            The first step is opening a bank account, so you have the ability to
            make repayments to lenders. See{' '}
            <Link
              asInlineText
              href="https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-open-switch-or-close-your-bank-account#how-to-open-a-bank-account"
              target="_blank"
            >
              how to open a bank account
            </Link>{' '}
            for more information.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Mae benthycwyr yn defnyddio eich hanes credyd i ragweld a ydych yn
            debygol o wneud eich ad-daliadau ar amser. Ond os ydych chi'n newydd
            i gredyd, ni fyddwch wedi cronni hanes credyd.
          </p>
          <br />
          <p>
            Y cam cyntaf yw agor cyfrif banc, fel bod gennych y gallu i wneud
            ad-daliadau i fenthycwyr. Gweler{' '}
            <Link
              asInlineText
              href="https://www.moneyhelper.org.uk/cy/everyday-money/banking/how-to-open-switch-or-close-your-bank-account#how-to-open-a-bank-account"
              target="_blank"
            >
              sut i agor cyfrif banc
            </Link>{' '}
            am fwy o wybodaeth.
          </p>
        </>
      ),
    },
    conditions: [
      {
        question: '3',
        answer: '!0',
      },
    ],
  },
  {
    id: '9',
    title: {
      en: 'Consider putting household bills in your name',
      cy: 'Ystyriwch roi biliau cartref yn eich enw chi',
    },
    content: {
      en: (
        <>
          <p>
            If you're responsible for paying bills (like mobile phone, gas,
            electricity, broadband and insurance) - and you pay them on time -
            it shows you have a good track record of repaying. This can mean
            lenders are more likely to let you borrow money.
          </p>
          <br />
          <p>
            Just be aware that missing a payment has the opposite effect, and
            can damage your credit file. If you're named on the account but
            share the bill, you're responsible for paying that bill on time -
            even if others haven't paid you their share.
          </p>
          <br />
          <p>You could also try:</p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                Adding any rental payments to your credit report using
                Experian's{' '}
                <Link
                  asInlineText
                  href="https://www.experian.co.uk/business/customer-insights/risk-analysis/rental-exchange/tenant-information"
                  target="_blank"
                >
                  Rental Exchange
                </Link>
                .
              </span>,
              <span>
                Using the optional{' '}
                <Link
                  asInlineText
                  href={
                    'https://www.experian.co.uk/consumer/experian-boost.html'
                  }
                  target="_blank"
                >
                  Experian Boost scheme
                </Link>{' '}
                to include payments for Council Tax, subscriptions and to
                savings accounts when calculating your credit score.
              </span>,
            ]}
          />
        </>
      ),
      cy: (
        <>
          <p>
            Os ydych yn gyfrifol am dalu'r biliau (fel ffôn symudol, nwy,
            trydan, band eang ac yswiriant) - ac rydych yn eu talu ar amser -
            mae'n dangos bod gennych gofnod da o ad-dalu. Gallai hyn olygu bod
            benthycwyr yn fwy tebygol o'ch gadael i fenthyg arian.
          </p>
          <br />
          <p>
            Byddwch yn ymwybodol bod methu taliad yn cael yr effaith groes, a
            gall niweidio'ch ffeil credyd. Os ydych wedi'ch enwi ar y cyfrif ond
            yn rhannu'r bil, chi sy'n gyfrifol am dalu'r bil hwnnw ar amser -
            hyd yn oed os nad yw eraill wedi talu eu cyfran i chi.
          </p>
          <br />
          <p>Gallech hefyd roi cynnig ar:</p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                Ychwanegu unrhyw daliadau rhent i'ch adroddiad credyd gan
                ddefnyddio{' '}
                <Link
                  asInlineText
                  href="https://www.experian.co.uk/business/customer-insights/risk-analysis/rental-exchange/tenant-information"
                  target="_blank"
                >
                  Rental Exchange
                </Link>{' '}
                Experian.
              </span>,
              <span>
                Defnyddio{' '}
                <Link
                  asInlineText
                  href={
                    'https://www.experian.co.uk/consumer/experian-boost.html'
                  }
                  target="_blank"
                >
                  cynllun Boost dewisol Experian
                </Link>{' '}
                i gynnwys taliadau ar gyfer Treth Gyngor, tanysgrifiadau a
                chyfrifon cynilo wrth gyfrifo eich sgôr credyd.
              </span>,
            ]}
          />
        </>
      ),
    },
    conditions: [
      {
        question: '3',
        answer: '!1',
      },
    ],
  },
  {
    id: '10',
    title: {
      en: 'Before applying again, use an eligibility checker',
      cy: 'Cyn gwneud cais eto, defnyddiwch wiriwr cymhwysedd',
    },
    content: {
      en: (
        <>
          <p>
            Eligibility calculators show if you're likely to be accepted, before
            applying. This is the best way as it doesn't mark your credit file.
          </p>
          <br />
          <p>
            You can find them on many lenders' websites and comparison sites,
            such as:
          </p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                <Link
                  asInlineText
                  href="https://www.moneysavingexpert.com/eligibility/"
                  target="_blank"
                >
                  MoneySavingExpert
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.creditkarma.co.uk/"
                  target="_blank"
                >
                  Credit Karma
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.clearscore.com/"
                  target="_blank"
                >
                  ClearScore
                </Link>
              </span>,
            ]}
          />
          <br />
          <p>
            If you're not seeing many results, it's worth looking at credit
            builder products - like credit cards that help build your credit
            history.
          </p>
          <br />
          <p>
            If you can't find an eligibility checker for the product you're
            after, always double check you at least meet minimum eligibility
            criteria (such as a minimum income amount).
          </p>
          <br />
          <p>
            See{' '}
            <Link
              asInlineText
              href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit"
              target="_blank"
            >
              How to apply for credit
            </Link>{' '}
            for more information.
          </p>
        </>
      ),
      cy: (
        <>
          <p>
            Mae cyfrifianellau cymhwysedd yn dangos a ydych yn debygol o gael
            eich derbyn, cyn gwneud cais. Dyma'r ffordd orau gan nad yw'n
            marcio'ch ffeil credyd.
          </p>
          <br />
          <p>
            Gallwch ddod o hyd iddynt ar wefannau nifer o fenthycwyr a gwefannau
            cymharu, fel:
          </p>
          <br />
          <ListElement
            variant="unordered"
            color="blue"
            className="ml-7"
            items={[
              <span>
                <Link
                  asInlineText
                  href="https://www.moneysavingexpert.com/eligibility/"
                  target="_blank"
                >
                  MoneySavingExpert
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.creditkarma.co.uk/"
                  target="_blank"
                >
                  Credit Karma
                </Link>
              </span>,
              <span>
                <Link
                  asInlineText
                  href="https://www.clearscore.com/"
                  target="_blank"
                >
                  ClearScore
                </Link>
              </span>,
            ]}
          />
          <br />
          <p>
            Os nad ydych yn gweld llawer o lwyddiant, mae'n werth edrych ar
            gynhyrchion adeiladwyr credyd - fel cardiau credyd sy'n helpu i
            adeiladu eich hanes credyd.
          </p>
          <br />
          <p>
            Os na allwch ddod o hyd i wiriwr cymhwysedd ar gyfer y cynnyrch
            rydych chi ei eisiau, sicrhewch eich bod o leiaf yn bodloni'r meini
            prawf gofynnol (fel isafswm incwm).
          </p>
          <br />
          <p>
            Gweler{' '}
            <Link
              asInlineText
              href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit"
              target="_blank"
            >
              Sut i wneud cais am gredyd
            </Link>{' '}
            am fwy o wybodaeth.
          </p>
        </>
      ),
    },
  },
];

const data: Data = {
  title: {
    en: 'Your action plan',
    cy: 'Eich cynllun gweithredu',
  },
  intro: {
    en: "Based on your answers, here's your action plan. We've listed the actions that could make the most impact first, but you can do them in any order.",
    cy: "Yn seiliedig ar eich atebion, dyma eich cynllun gweithredu. Rydym wedi rhestru'r camau gweithredu a allai gael yr effaith fwyaf yn gyntaf, ond gallwch chi eu gwneud mewn unrhyw drefn.",
  },
  tiles,
};

export default data;
