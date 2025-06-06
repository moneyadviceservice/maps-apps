import { GetServerSideProps, NextPage } from 'next';

import { Callout } from '@maps-react/common/components/Callout';
import { H1, H3 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { SaveReturnLink } from '@maps-react/pwd/components/SaveReturnLink';
import { TaskList, TaskStatus } from '@maps-react/pwd/components/TaskList';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';

import { fetchApptPage, fetchShared } from '../../../utils';

type SaveAndReturnModel = {
  language: string;
  query: Record<string, string>;
};

const SaveAndReturn = ({ language, query }: SaveAndReturnModel) => {
  return (
    <SaveReturnLink
      href={{
        pathname: `/${language}/${process.env.appUrl}/save`,
        query,
      }}
      className="float-right"
    />
  );
};

type ApptPageModel = {
  title: string;
  welcomeBackTitle: string;
  welcomeBackText: JsonRichText;
  toolIntro: JsonRichText;
  section1Title: string;
  section1Description: JsonRichText;
  section1Tasks: string[];
  section2Title: string;
  section2Description: JsonRichText;
  section2Tasks: string[];
  section3Title: string;
  section3Description: JsonRichText;
  section3Tasks: string[];
  subtitle?: string;
};

type ApptPageProps = {
  data: ApptPageModel;
};

const Page: NextPage<PensionWisePageProps & ApptPageProps> = ({
  data,
  ...pageProps
}) => {
  const {
    route: { query },
  } = pageProps;

  const {
    title,
    subtitle,
    welcomeBackTitle,
    welcomeBackText,
    toolIntro,
    section1Title,
    section1Description,
    section1Tasks,
    section2Title,
    section2Description,
    section2Tasks,
    section3Title,
    section3Description,
    section3Tasks,
  } = data;

  const { language, error, returning, ...newQuery } = query;

  const h3Classes = '!text-2xl mb-4';

  const createArrayOfTasks = (tasks: string[], offset?: number) => {
    const arrayOfTasks: string[] = [];
    const offsetBy = offset ?? 0;
    tasks.forEach((_, idx) => {
      arrayOfTasks.push(`t${idx + 1 + offsetBy}`);
    });
    return arrayOfTasks;
  };

  const enableTaskList = (keysToCheck: string[]) => {
    const numberOfTasks = keysToCheck.length;
    let completedTasks = 0;

    for (const key in query) {
      if (
        keysToCheck.includes(key) &&
        query[key] === TaskStatus.COMPLETED.toString()
      ) {
        completedTasks++;
      }
    }

    return completedTasks === numberOfTasks;
  };

  const optionsEnabled = enableTaskList(createArrayOfTasks(section1Tasks));
  const summaryEnabled = enableTaskList(
    createArrayOfTasks(section2Tasks, section1Tasks.length),
  );

  return (
    <PensionwisePageLayout {...pageProps}>
      <ToolIntro className="mb-10">{mapJsonRichText(toolIntro.json)}</ToolIntro>

      {returning && (
        <Callout className="mb-10">
          <p className="mb-4 text-xl font-bold">{welcomeBackTitle}</p>
          <RichTextAem className="text-lg">
            {mapJsonRichText(welcomeBackText.json)}
          </RichTextAem>
        </Callout>
      )}

      <H1 className="mt-10 mb-8" data-testid="section-title">
        {title}
      </H1>
      {subtitle && <Paragraph className="mb-4">{subtitle}</Paragraph>}
      <H3 id="helping" className={h3Classes} data-testid="task-list-title1">
        {section1Title}
      </H3>

      {mapJsonRichText(section1Description.json)}

      <div className="mb-16">
        <TaskList
          formAction="/api/start-task"
          query={query}
          tasks={section1Tasks}
          enableLinks
          className="mb-4"
        />

        {!optionsEnabled && (
          <SaveAndReturn language={language} query={newQuery} />
        )}
      </div>

      <H3 id="options" className={h3Classes} data-testid="task-list-title2">
        {section2Title}
      </H3>

      {mapJsonRichText(section2Description.json)}

      <div className="mb-16">
        <TaskList
          formAction="/api/start-task"
          query={query}
          tasks={section2Tasks}
          startIndex={section1Tasks.length}
          enableLinks={optionsEnabled}
          className="mb-4"
        />

        {optionsEnabled && !summaryEnabled && (
          <SaveAndReturn language={language} query={newQuery} />
        )}
      </div>

      <H3 className={h3Classes} data-testid="task-list-title3">
        {section3Title}
      </H3>

      {mapJsonRichText(section3Description.json)}

      <div className="mb-10">
        <TaskList
          formAction="/api/start-task"
          query={query}
          tasks={section3Tasks}
          startIndex={section1Tasks.length + section2Tasks.length}
          className="mb-4"
          enableLinks={summaryEnabled}
        />
        {summaryEnabled && (
          <SaveAndReturn language={language} query={newQuery} />
        )}
      </div>
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchApptPage(query);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data.browserPageTitle,
      route: {
        query,
        app: process.env.appUrl,
      },
    },
  };
};
