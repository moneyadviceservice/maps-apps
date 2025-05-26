/*eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { getStore } from '@netlify/blobs';

import { FormType } from '../../data/form-data/org_signup';
import { EntryData } from '../../lib/types';
import { loadEnv } from '../../utils/loadEnv';
import { getStoreEntry } from '../../utils/store';

export default async function (req: Request) {
  if (req.method === 'POST') {
    try {
      // Parse the form data
      const requestData = await req.formData();
      const dataObject = {} as EntryData;
      requestData.forEach((value, fieldName) => {
        if (fieldName in dataObject) {
          if (!Array.isArray(dataObject[fieldName])) {
            dataObject[fieldName] = [dataObject[fieldName]];
          }
          dataObject[fieldName].push(
            typeof value === 'object'
              ? JSON.stringify(value)
              : value.toString(),
          );
        } else if (
          [
            'memberships',
            'debtAdviceDelivery',
            'debtAdvice',
            'geoRegions',
          ].includes(fieldName)
        ) {
          dataObject[fieldName] = value
            .toString()
            .split(',')
            .map((item) => item.trim());
        } else {
          dataObject[fieldName] =
            typeof value === 'object'
              ? JSON.stringify(value)
              : value.toString();
        }
      });

      // Get the session ID from the cookie
      const cookieHeader = req.headers.get('cookie') ?? '';
      let key = /(?:^|;\s*)fsid=([^;]*)/.exec(cookieHeader)?.[1] ?? null;

      const { storeName } = loadEnv();
      const store = getStore({ name: storeName, consistency: 'strong' });

      const responseHeaders = new Headers();

      if (!key) {
        // Generate a new session ID
        key = uuidv4();

        // Set the cookie in the response headers
        responseHeaders.append(
          'Set-Cookie',
          `fsid=${key}; Path=/; HttpOnly; Secure; SameSite=Lax;`,
        );

        // Create a new store instance and initialize the entry
        const initialEntry = {
          data: {
            lang: dataObject?.lang ?? 'en',
            flow: FormType.NEW_ORG,
          },
          errors: [],
        };

        // Save the initial entry to the store
        await store.setJSON(key, initialEntry);
      }

      // Get the entry from the store
      const { entry } = await getStoreEntry(key);

      if (!dataObject?.debtAdvice?.includes('other')) {
        delete dataObject['debtAdviceOther'];
        delete entry.data['debtAdviceOther'];
      }

      if (dataObject?.fcaReg === 'fca-no') {
        delete dataObject['fcaRegNumber'];
        delete entry.data['fcaRegNumber'];
      }

      // Update the entry with the new data
      entry.data = {
        ...entry.data,
        ...dataObject,
        geoRegions: dataObject.geoRegions ?? [],
        organisationType: dataObject.organisationType,
        sfslive: dataObject.sfslive ?? '',
        organisationUse: dataObject.organisationUse ?? '',
        fcaReg: dataObject.fcaReg ?? '',
        debtAdvice: dataObject.debtAdvice,
        organisationTypeOther: dataObject.organisationTypeOther,
        memberships: dataObject.memberships ?? [],
      };

      await store.setJSON(key, entry);

      const errors = validateFormSubmission(entry.data);

      if (errors) {
        entry.errors = errors;
        await store.setJSON(key, entry);
      } else {
        entry.errors = [];
        await store.setJSON(key, entry);
      }

      responseHeaders.append(
        'Location',
        `/${dataObject.lang || 'en'}/apply-to-use-the-sfs${
          errors ? '' : '?user=true'
        }`,
      );

      return new Response(null, { status: 303, headers: responseHeaders });
    } catch (error: any) {
      console.error('Error processing form submission:', error); // DEBUG
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}

export const validationSchemas = z.object({
  organisationName: z.string().min(1, 'required'),
  organisationWebsite: z
    .string()
    .min(1, 'required')
    .url({ message: 'invalid' }),
  organisationStreet: z.string().min(1, 'required'),
  organisationCity: z.string().min(1, 'required'),
  organisationPostcode: z.string().min(1, 'required'),
  sfsLaunchDate: z.date(),
  caseManagementSoftware: z.string().optional(),
  sfslive: z.string().min(1, 'required'),
  organisationType: z.string().min(1, 'required'),
  organisationTypeOther: z.string().min(1, 'required').optional(),
  geoRegions: z.array(z.string()).min(1, 'required'),
  organisationUse: z.string().min(1, 'required'),
  debtAdvice: z.array(z.string()).min(1, 'required'),
  debtAdviceOther: z.string().min(1, 'required').optional(),
  fcaReg: z.string().min(1, 'required'),
  fcaRegNumber: z.string().min(1, 'required').optional(),
  memberships: z.array(z.string()).min(1, 'required'),
  'advice-ni': z.string().min(1, 'required').optional(),
  'advice-uk': z.string().min(1, 'required').optional(),
  'citizens-advice': z.string().min(1, 'required').optional(),
  ccua: z.string().min(1, 'required').optional(),
  civea: z.string().min(1, 'required').optional(),
  cma: z.string().min(1, 'required').optional(),
  csa: z.string().min(1, 'required').optional(),
  demsa: z.string().min(1, 'required').optional(),
  drf: z.string().min(1, 'required').optional(),
  fla: z.string().min(1, 'required').optional(),
  hceoa: z.string().min(1, 'required').optional(),
  ima: z.string().min(1, 'required').optional(),
  ipa: z.string().min(1, 'required').optional(),
  irrv: z.string().min(1, 'required').optional(),
  r3: z.string().min(1, 'required').optional(),
  'uk-finance': z.string().min(1, 'required').optional(),
  none: z.string().min(1, 'required').optional(),
  other: z.string().min(1, 'required').optional(),
});

function validateFormSubmission(entry: EntryData): any {
  const result = validationSchemas.safeParse({
    ...entry,
    sfsLaunchDate: entry.sfsLaunchDate ? new Date(entry.sfsLaunchDate) : '',
  });

  if (!result.success) {
    return result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0] as string;
      const type = issue.code;

      if (!acc.find((item) => item.field === field)) {
        acc.push({ field, type });
      }

      return acc;
    }, [] as { field: string; type: string }[]);
  }

  return null;
}
