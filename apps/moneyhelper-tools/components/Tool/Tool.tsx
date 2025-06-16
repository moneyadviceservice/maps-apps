import { ChangeEvent, useEffect, useId, useState } from 'react';

import copy from 'copy-to-clipboard';
import { ToolType } from 'data/tools-data';
import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Select } from '@maps-react/form/components/Select';
import { generateEmbedCode } from '@maps-react/utils/generateEmbedCode';

export type ToolProps = {
  name: string;
  title: string;
  description: string;
  details?: { en: ToolType; cy: ToolType };
};

export const Tool = ({ name, title, description, details }: ToolProps) => {
  const [language, setLanguage] = useState('en');
  const [done, setDone] = useState(false);
  const selectId = useId();

  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(location.protocol + '//' + location.host), []);

  const languages = [
    { name: 'en', title: 'English' },
    { name: 'cy', title: 'Cymraeg' },
  ];

  const code = details
    ? (details as { [key: string]: ToolType })[language]?.embedCode
    : generateEmbedCode({ origin, language, name });

  return (
    <div id={name} className="p-3 space-y-4 border">
      <H2 color="text-blue-800">{title}</H2>
      <hr />
      <div className="text-lg text-gray-700">{description}</div>
      <div className="space-y-4">
        <ul>
          {languages.map((l) => (
            <li key={l.name}>
              {details ? (
                <Link
                  href={
                    (details as { [key: string]: ToolType })[l.name]?.url ?? ''
                  }
                >
                  {l.title} home page
                </Link>
              ) : (
                <Link href={`/${l.name}/${name}`}>{l.title} home page</Link>
              )}
            </li>
          ))}
          {languages.map((l) => (
            <li key={l.name}>
              <Link
                href={{
                  pathname: '/api/test-embed',
                  query: {
                    origin,
                    language: l.name,
                    name,
                    externalTool: !!details,
                  },
                }}
              >
                {l.title} Example page
              </Link>
            </li>
          ))}
        </ul>
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
                {...defaultProps}
                code={code ?? ''}
                language="jsx"
                theme={github}
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
                    {tokens.map((line, i) => {
                      return (
                        /* eslint-disable react/jsx-key */
                        <div {...getLineProps({ line, key: i })}>
                          {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                          ))}
                        </div>
                        /* eslint-enable react/jsx-key */
                      );
                    })}
                  </pre>
                )}
              </Highlight>
            </code>
            <div className="flex items-center gap-3 p-3">
              <Button
                className="text-lg"
                data-testid="copy-embed"
                onClick={() => {
                  copy(code ?? '', { debug: true });
                  setDone(true);
                }}
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
      </div>
    </div>
  );
};
