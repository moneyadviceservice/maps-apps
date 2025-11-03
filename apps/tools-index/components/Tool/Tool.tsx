import { ChangeEvent, useId, useState } from 'react';

import copy from 'copy-to-clipboard';
import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Select } from '@maps-react/form/components/Select';
import { generateEmbedCode } from '@maps-react/utils/generateEmbedCode';

import { ToolEmbedType } from '../../data/tools-index-data';

export type ToolProps = {
  name: string;
  title: string;
  description: string;
  productionOrigin?: string;
  stagingOrigin?: string;
  developOrigin?: string;
  details?: { en: ToolEmbedType; cy: ToolEmbedType };
};

export const Tool = ({
  name,
  title,
  description,
  productionOrigin,
  stagingOrigin,
  developOrigin,
  details,
}: ToolProps) => {
  const [language, setLanguage] = useState('en');
  const [done, setDone] = useState(false);
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
    : generateEmbedCode({ origin, language, name });

  return (
    <div id={title.replace(/ /g, '')} className="p-3 space-y-4 border">
      <H2 color="text-blue-700">{title}</H2>
      <hr />
      <div className="text-lg text-gray-700">{description}</div>
      <div className="space-y-4">
        <ul>
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
                <Link href={`${origin}/${l.name}/${name}`}>
                  {l.title} home page
                </Link>
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
                    isRuby: !!details,
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
                      const lineProps = getLineProps({ line, key: i });
                      const { key: lineKey, ...restLineProps } = lineProps;

                      return (
                        <div key={lineKey} {...restLineProps}>
                          {line.map((token, key) => {
                            const tokenProps = getTokenProps({ token, key });
                            const { key: tokenKey, ...restTokenProps } =
                              tokenProps;

                            return <span key={tokenKey} {...restTokenProps} />;
                          })}
                        </div>
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
