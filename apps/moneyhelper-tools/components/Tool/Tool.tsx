import { Button, H2, Link } from '@maps-digital/shared/ui';
import { ChangeEvent, useEffect, useId, useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';
import { twMerge } from 'tailwind-merge';
import copy from 'copy-to-clipboard';
import { Select } from '../Select';
import { generateEmbedCode } from 'utils/generateEmbedCode';

export type ToolProps = {
  name: string;
  title: string;
  description: string;
};

export const Tool = ({ name, title, description }: ToolProps) => {
  const [language, setLanguage] = useState('en');
  const [done, setDone] = useState(false);
  const selectId = useId();

  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(location.protocol + '//' + location.host), []);

  const languages = [
    { name: 'en', title: 'English' },
    { name: 'cy', title: 'Cymraeg' },
  ];

  const code = generateEmbedCode({ origin, language, name });

  return (
    <div id={name} className="space-y-4 border p-3">
      <H2 color="text-blue-800">{title}</H2>
      <hr />
      <div className="text-lg text-gray-700">{description}</div>
      <div className="space-y-4">
        <ul>
          <li>
            <Link className="text-lg" href={`/en/${name}`}>
              English home page
            </Link>
          </li>
          <li>
            <Link className="text-lg" href={`/cy/${name}`}>
              Cymraeg home page
            </Link>
          </li>
          {languages.map((l) => (
            <li key={l.name}>
              <Link
                className="text-lg"
                href={{
                  pathname: '/api/test-embed',
                  query: { origin, language: l.name, name },
                }}
              >
                {l.title} Example page
              </Link>
            </li>
          ))}
        </ul>
        <div className="border shadow">
          <div className="px-3 border-b py-2">
            <div>
              <label
                htmlFor={selectId}
                className="text-lg text-gray-700 font-bold mb-1 block"
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
            <div className="text-lg text-gray-700 font-bold px-3 py-4">
              2. Copy the code below and paste it in your HTML.
            </div>
            <code>
              <Highlight
                {...defaultProps}
                code={code}
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
            <div className="p-3 flex items-center gap-3">
              <Button
                className="text-lg"
                data-testid="copy-embed"
                onClick={() => {
                  copy(code, { debug: true });
                  setDone(true);
                }}
              >
                Copy to clipboard
              </Button>
              {done && (
                <div className="text-lg text-gray-900 font-bold animate-bounce">
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
