import { ChangeEvent, useEffect, useId, useRef, useState } from 'react';

import copy from 'copy-to-clipboard';
import { Highlight, themes } from 'prism-react-renderer';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Select } from '@maps-react/form/components/Select';
import { generateEmbedCode } from '@maps-react/utils/generateEmbedCode';

export type ToolEmbedType = {
  url?: string;
  embedCode?: string;
};

export type ToolProps = {
  title: string;
  path: string; // Path/route for the tool (e.g., "income", "question-1", "midlife-mot/question-1")
  description: string;
  live?: boolean; // if false, the tool will not be shown on production tools-index
  productionOrigin?: string;
  stagingOrigin?: string;
  developOrigin?: string;
  details?: { en: ToolEmbedType; cy: ToolEmbedType };
  showEmbed?: boolean; // If false, the iframe embed code will not be show – only a direct link to the tool will be included
};

export const Tool = ({
  title,
  path,
  description,
  productionOrigin,
  stagingOrigin,
  developOrigin,
  details,
  showEmbed,
}: ToolProps) => {
  const [language, setLanguage] = useState('en');
  const [done, setDone] = useState(false);
  const doneTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectId = useId();

  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const isProduction = environment === 'production';
  const isStaging = environment === 'staging';

  const origin =
    (isProduction && productionOrigin) ||
    (isStaging && stagingOrigin) ||
    developOrigin ||
    '';

  const languages = [
    { name: 'en', title: 'English' },
    { name: 'cy', title: 'Cymraeg' },
  ];

  const code = details
    ? (details as { [key: string]: ToolEmbedType })[language]?.embedCode
    : generateEmbedCode({ origin, language, name: path });

  const resetDoneTimeout = () => {
    if (!doneTimeout.current) return;

    clearTimeout(doneTimeout.current);
    doneTimeout.current = null;
  };

  const startDoneTimeout = () => {
    resetDoneTimeout();

    doneTimeout.current = setTimeout(() => {
      setDone(false);
      doneTimeout.current = null;
    }, 3000);
  };

  const handleClickCopyToClipboard = () => {
    copy(code ?? '', { debug: true });
    setDone(true);
    startDoneTimeout();
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      resetDoneTimeout();
    };
  }, []);

  return (
    <div id={title.replace(/ /g, '')} className="p-3 space-y-4 border">
      <H2 color="text-blue-700">{title}</H2>
      <hr />
      <div className="text-lg text-gray-700">{description}</div>
      <div className="space-y-4">
        <ul>
          {/* Tool home page links */}
          {languages.map((l) => (
            <li key={l.name}>
              {details ? (
                <Link
                  href={
                    (details as { [key: string]: ToolEmbedType })[l.name]
                      ?.url ?? ''
                  }
                >
                  {l.title} home page
                </Link>
              ) : (
                <Link href={`${origin}/${l.name}/${path}`}>
                  {l.title} home page
                </Link>
              )}
            </li>
          ))}

          {/* Iframe embed links */}
          {showEmbed !== false &&
            languages.map((l) => (
              <li key={l.name}>
                <Link
                  href={{
                    pathname: '/api/test-embed',
                    query: {
                      origin,
                      language: l.name,
                      name: path,
                      isRuby: !!details,
                    },
                  }}
                >
                  {l.title} Example page
                </Link>
              </li>
            ))}
        </ul>

        {/* Iframe embed code */}
        {showEmbed !== false && (
          <div className="border shadow">
            <div className="px-3 py-2 border-b">
              <div>
                <label
                  htmlFor={selectId}
                  className="block mb-1 text-lg font-bold text-gray-700"
                >
                  1. Choose a language
                </label>
                <div className="max-w-sm">
                  <Select
                    id={selectId}
                    name="language"
                    data-testid="language-select"
                    value={language}
                    hideEmptyItem
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setLanguage(e.target.value)
                    }
                    options={languages.map((l) => ({
                      text: l.title,
                      value: l.name,
                    }))}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="px-3 py-4 text-lg font-bold text-gray-700">
                2. Copy the code below and paste it in your HTML.
              </div>
              <code>
                <Highlight
                  code={code ?? ''}
                  language="jsx"
                  theme={themes.github}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre
                      className={twMerge(className, 'p-3', 'overflow-scroll')}
                      style={style}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </code>
              <div className="flex items-center gap-3 p-3">
                <Button
                  className="text-lg"
                  data-testid="copy-embed"
                  onClick={handleClickCopyToClipboard}
                >
                  Copy to clipboard
                </Button>
                {done && (
                  <div className="text-lg font-bold text-gray-900 animate-bounce">
                    Done!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
