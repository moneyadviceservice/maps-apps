import { Config, Context } from '@netlify/functions';

import {
  AppConfigOptions,
  appConfigHandler,
} from '@maps-react/netlify-functions/appConfig';
const appConfigOptions: AppConfigOptions = {
  appName: 'stamp-duty-calculator',
};

export default async function (req: Request, context: Context) {
  return appConfigHandler(req, context, appConfigOptions);
}

export const config: Config = {
  path: ['/api/appconfig'],
};
