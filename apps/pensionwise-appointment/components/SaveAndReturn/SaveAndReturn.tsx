import { Button, Errors, H1 } from '@maps-digital/shared/ui';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';
import { ApptSaveModel } from '../../utils';

type Props = {
  data: ApptSaveModel;
  nonce: string | undefined;
  pageProps: {
    query: Record<string, string>;
    back?: string;
    app: string | undefined;
  };
};

const SaveAndReturn = ({ data, nonce, pageProps }: Props) => {
  const {
    query: { language, error },
  } = pageProps;

  const {
    title,
    slug,
    pageDescription,
    labelText,
    labelSubText,
    errorMessageEmail,
    errorMessageSend,
    submitButtonText,
  } = data;

  const borderColour = error ? 'border-red-700' : 'border-gray-400';

  return (
    <div>
      <H1 className="mt-10 mb-6" data-testid="section-title">
        {title}
      </H1>
      {pageDescription && (
        <div className="mb-6">{mapJsonRichText(pageDescription.json)}</div>
      )}
      <form method="POST" noValidate>
        <input type="HIDDEN" name="language" defaultValue={language} />
        <input type="hidden" name="slug" value={slug} />
        <Errors errors={error ? [error] : []}>
          <label className="block mb-1 text-lg" htmlFor="email">
            {labelText}
          </label>
          <p id="email-hint" className="mb-1 text-gray-400">
            {labelSubText}
          </p>
          {error && (
            <p id="email-error" className="mb-1 text-red-700">
              Error:{' '}
              {error === 'email'
                ? `${errorMessageEmail}`
                : `${errorMessageSend}`}
            </p>
          )}

          <input
            className={`px-3 m-px mt-1 w-full h-10 rounded border ${borderColour} focus:outline-none focus:shadow-focus-outline md:w-80 obfuscate`}
            id="email"
            name="email"
            type="email"
            aria-describedby={`email-hint ${error ? 'email-error' : ''}`}
            data-testid="email"
          />
        </Errors>

        <Button
          className="mt-6 w-full md:w-auto"
          formAction="/api/save-and-return"
          data-testid="save-and-return"
        >
          {submitButtonText}
        </Button>
      </form>
    </div>
  );
};

export default SaveAndReturn;
