import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

interface ResultsHelpTextProps {
  className?: string;
}

export const ResultsHelpText = ({ className }: ResultsHelpTextProps) => {
  const { z } = useTranslation();

  return (
    <Paragraph variant="primary" className={className}>
      {z({
        en: (
          <>
            This is a realistic estimate. For more detailed results,{' '}
            <Link
              href="https://www.gov.uk/contact-hmrc"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              contact HMRC
            </Link>
            . Need more help? MoneyHelper has guidance on how to{' '}
            <Link
              href="https://www.moneyhelper.org.uk/en/work/employment/understanding-your-payslip"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              understand your payslip
            </Link>
            .
          </>
        ),
        cy: (
          <>
            Mae hwn yn amcangyfrif realistig. Am fwy o fanylion,{' '}
            <Link
              href="https://www.gov.uk/contact-hmrc"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              cysylltwch â HMRC
            </Link>
            . Angen mwy o gymorth? Mae gan MoneyHelper ganllawiau ar sut i{' '}
            <Link
              href="https://www.moneyhelper.org.uk/cy/work/employment/understanding-your-payslip"
              target="_blank"
              asInlineText
              withIcon={false}
            >
              ddeall eich cyflogres
            </Link>
            .
          </>
        ),
      })}
    </Paragraph>
  );
};
