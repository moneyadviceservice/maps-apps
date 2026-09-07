import {
  AppConfigOptions,
  appConfigHandler,
} from '@maps-react/netlify-functions/appConfig';
import { Config, Context } from '@netlify/functions';

const appConfigOptions: AppConfigOptions = {
  appName: 'standard-financial-statement',
};

export default async function (req: Request, context: Context) {
  return appConfigHandler(req, context, appConfigOptions);
}

export const config: Config = {
  path: ['/fn/appconfig'],
};
