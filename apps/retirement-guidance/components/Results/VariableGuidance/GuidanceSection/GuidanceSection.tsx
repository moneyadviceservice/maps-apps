import { ContentItem } from 'lib/types';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H6 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type GuidanceSectionProps = {
  translationPrefix: string;
  testId: string;
  contentId: string;
  content: ContentItem[];
};

export const GuidanceSection = ({
  translationPrefix,
  testId,
  contentId,
  content,
}: GuidanceSectionProps) => {
  const { t } = useTranslation();

  const renderContent = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'markdown': {
        const translationKey = `${translationPrefix}.${item.key}`;
        return (
          <Markdown key={index} content={t(translationKey)} withIcon={false} />
        );
      }
      case 'paragraph': {
        const translationKey = `${translationPrefix}.${item.key}`;
        return (
          <p key={index} className="mt-2 mb-2">
            {t(translationKey)}
          </p>
        );
      }
      case 'list':
        return (
          <ul key={index} className="mb-4 ml-6 list-disc">
            {item.items.map((listItem, i) => {
              const key = `${translationPrefix}.${listItem.key}`;

              return (
                <li key={i} className="mt-1 mb-1">
                  {listItem.type === 'markdownListItem' ? (
                    <div className="[&_p]:my-0">
                      <Markdown content={t(key)} withIcon={false} />
                    </div>
                  ) : (
                    t(key)
                  )}
                  {listItem.sublist &&
                    listItem.sublist.length > 0 &&
                    (listItem.sublist[0].noIcon ? (
                      <div className="mt-1">
                        {listItem.sublist.map((subItem, j) => {
                          const subKey = `${translationPrefix}.${subItem.key}`;
                          return (
                            <p key={j} className="mt-1 mb-1 indent-6">
                              {t(subKey)}
                            </p>
                          );
                        })}
                      </div>
                    ) : listItem.sublist[0].insideIcon ? (
                      <ul className="mt-1 list-[circle] list-inside">
                        {listItem.sublist.map((subItem, j) => {
                          const subKey = `${translationPrefix}.${subItem.key}`;
                          return (
                            <li key={j} className="mt-1 mb-1 indent-6">
                              {t(subKey)}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <ul className="ml-6 mt-1 list-[circle]">
                        {listItem.sublist.map((subItem, j) => {
                          const subKey = `${translationPrefix}.${subItem.key}`;
                          return (
                            <li key={j} className="mt-1 mb-1">
                              {t(subKey)}
                            </li>
                          );
                        })}
                      </ul>
                    ))}
                </li>
              );
            })}
          </ul>
        );

      case 'heading': {
        const translationKey = `${translationPrefix}.${item.key}`;
        return (
          <H6 key={index} className="mt-2 mb-2">
            {t(translationKey)}
          </H6>
        );
      }
      default:
        return null;
    }
  };

  return (
    <ExpandableSection
      title={t(`${translationPrefix}.title`)}
      variant="mainLeftIcon"
      className="border-b-1"
      testId={testId}
      contentId={contentId}
    >
      {content.map((item, index) => renderContent(item, index))}
    </ExpandableSection>
  );
};
