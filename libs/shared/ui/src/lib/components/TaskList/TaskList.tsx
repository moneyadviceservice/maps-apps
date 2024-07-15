import { twMerge } from 'tailwind-merge';
import { commonLinkClasses } from '../../components/Link';
import { useTranslation, TranslationGroup } from '@maps-digital/shared/hooks';

export type TaskListProps = {
  formAction: string;
  tasks: string[];
  query: Record<string, string>;
  enableLinks?: boolean;
  startIndex?: number;
  notLaunched?: boolean;
  testId?: string;
  className?: string;
};

const TaskStatusMap: { [key: string]: TranslationGroup } = {
  0: { en: 'Launching soon', cy: 'Yn lawnsio cyn hir' },
  1: { en: 'Cannot start yet', cy: 'Methu cychwyn eto' },
  2: { en: 'Not started', cy: 'Heb ddechrau' },
  3: { en: 'In progress', cy: 'Ar waith' },
  4: { en: 'Completed', cy: `Wedi'i gwblhau` },
};

export enum TaskStatus {
  LAUNCHING_SOON = 0,
  CANNOT_START,
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
}

const { LAUNCHING_SOON, CANNOT_START, NOT_STARTED, IN_PROGRESS, COMPLETED } =
  TaskStatus;

type BadgeProps = {
  status: number;
};

const Badge = ({ status }: BadgeProps) => {
  const badgeClasses =
    'text-base text-gray-800 bg-gray-100 py-1 px-2 inline-block';
  const completedClasses = 'bg-green-700 text-white';
  const inProgressClasses = 'bg-gray-400 text-white';
  const { z } = useTranslation();

  return (
    <span
      className={twMerge(
        badgeClasses,
        status === COMPLETED
          ? completedClasses
          : status === IN_PROGRESS && inProgressClasses,
      )}
    >
      {z(TaskStatusMap[status])}
    </span>
  );
};

type StatusContentProps = {
  status: number;
  text: string;
};

const StatusContent = ({ status, text }: StatusContentProps) => (
  <>
    <div className="col-span-5">{text}</div>
    <div className="col-span-3 text-right">
      <Badge status={status} />
    </div>
  </>
);

export const TaskList = ({
  formAction,
  tasks,
  query,
  enableLinks = false,
  startIndex = 0,
  notLaunched = false,
  testId = 'task-list',
  className,
}: TaskListProps) => {
  const { language } = query;
  const linkClass = ['text-left'].concat(commonLinkClasses);
  const gridClass = 'grid grid-cols-8 items-center';

  const PREFIX = 't';

  return (
    <ol
      data-testid={testId}
      className={twMerge('border-t-1 border-slate-400', className)}
    >
      {tasks.map((text, idx) => {
        const taskId = startIndex + 1 + idx;
        const initialStatus =
          enableLinks && !notLaunched
            ? NOT_STARTED
            : notLaunched
            ? LAUNCHING_SOON
            : CANNOT_START;
        const statusFromQuery = +query[`${PREFIX}${taskId}`] || initialStatus;

        return (
          <li
            className="text-gray-800 border-b-1 border-slate-400 py-2"
            key={idx}
          >
            {enableLinks && !notLaunched ? (
              <form method="POST" noValidate>
                <input type="HIDDEN" name="task" defaultValue={taskId} />
                <input
                  type="HIDDEN"
                  name="status"
                  defaultValue={
                    statusFromQuery === NOT_STARTED
                      ? IN_PROGRESS
                      : statusFromQuery
                  }
                />
                <input type="HIDDEN" name="language" defaultValue={language} />

                <button
                  className={twMerge(linkClass, gridClass, 'w-full')}
                  formAction={formAction}
                  data-testid={`task-` + taskId}
                  role="link"
                >
                  <StatusContent text={text} status={statusFromQuery} />
                </button>
              </form>
            ) : (
              <div className={gridClass}>
                <StatusContent text={text} status={statusFromQuery} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};
