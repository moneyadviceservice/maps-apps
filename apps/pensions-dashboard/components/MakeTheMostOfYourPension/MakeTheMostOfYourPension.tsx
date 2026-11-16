import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const MakeTheMostOfYourPension = () => {
  const { t, tList } = useTranslation();
  const tools: string[] = tList('timeout.make-the-most.tools');

  return (
    <>
      <Heading level="h2" className="mb-6 text-blue-700 md:text-5xl">
        {t('timeout.make-the-most.heading')}
      </Heading>

      <Markdown content={t('timeout.make-the-most.description')} withIcon />

      <Paragraph className="mb-2">
        {t('timeout.make-the-most.tools-intro')}
      </Paragraph>

      <ul className="pl-5 mb-8 space-y-2 list-disc">
        {tools.map((tool) => (
          <li key={tool}>
            <Markdown content={tool} disableParagraphs withIcon />
          </li>
        ))}
      </ul>
    </>
  );
};
