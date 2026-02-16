import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

type OptionalInfoFieldsetProps = {
  title: { en: string; cy: string };
  description?: { en: string; cy: string } | React.ReactNode;
  paragraph?: { en: string; cy: string } | React.ReactNode;
  listItems?: { en: string; cy: string }[];
  descriptionId?: string;
  children?: React.ReactNode;
};

export const OptionalInfoFieldset = ({
  title,
  description,
  paragraph,
  listItems,
  descriptionId,
  children,
}: OptionalInfoFieldsetProps) => {
  const { z } = useTranslation();

  const isTranslationGroup = (
    value: unknown,
  ): value is { en: string; cy: string } =>
    typeof value === 'object' &&
    value !== null &&
    'en' in value &&
    'cy' in value;

  return (
    <fieldset className="p-0 m-0 mt-6 border-0 lg:mt-8">
      <legend className="mb-4 text-base text-blue-700">
        <H2 variant="secondary" className="inline">
          {z(title)}
        </H2>
        <span className="block mt-1 text-lg text-blue-700 lg:inline lg:mt-0 lg:ml-2">
          {z({ en: '(optional)', cy: '(dewisol)' })}
        </span>
      </legend>

      {description && (
        <Paragraph className="mt-2 mb-4">
          {isTranslationGroup(description) ? z(description) : description}
        </Paragraph>
      )}
      {(paragraph || listItems) && (
        <div id={descriptionId} className="mt-2 mb-2 text-base">
          {paragraph && (
            <Paragraph className="mb-2">
              {typeof paragraph === 'object' &&
              'en' in paragraph &&
              'cy' in paragraph
                ? z(paragraph)
                : paragraph}
            </Paragraph>
          )}

          {listItems && listItems.length > 0 && (
            <ul className="mb-6 ml-4">
              {listItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 mb-2 list-none text-[18px]"
                >
                  <span className="flex-shrink-0 inline-block w-2 h-2 mr-2 bg-blue-700 rounded-full" />
                  <span>{z(item)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {children}
    </fieldset>
  );
};
