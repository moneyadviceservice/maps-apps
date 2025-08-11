/*eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { getStore } from '@netlify/blobs';

import { membershipBody } from '../../data/form-data/membership_body';
import { FormType } from '../../data/form-data/org_signup';
import { EntryData } from '../../lib/types';
import { loadEnv } from '../../utils/loadEnv';
import { getStoreEntry } from '../../utils/store';

export default async function (req: Request) {
  if (req.method === 'POST') {
    try {
      const requestData = await req.json();

      const dataObject = {} as EntryData;
      Object.keys(requestData).forEach((fieldName) => {
        if (fieldName in dataObject) {
          if (!Array.isArray(dataObject[fieldName])) {
            dataObject[fieldName] = [dataObject[fieldName]];
          }
          dataObject[fieldName].push(
            typeof requestData[fieldName] === 'object'
              ? JSON.stringify(requestData[fieldName])
              : requestData[fieldName].toString(),
          );
        } else if (
          [
            'memberships',
            'debtAdviceDelivery',
            'debtAdvice',
            'geoRegions',
          ].includes(fieldName)
        ) {
          dataObject[fieldName] = requestData[fieldName]
            .toString()
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '');
        } else {
          dataObject[fieldName] =
            typeof requestData[fieldName] === 'object'
              ? JSON.stringify(requestData[fieldName])
              : requestData[fieldName].toString();
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

      if (dataObject?.fcaReg === 'fca-no') {
        delete dataObject['fcaRegNumber'];
        delete entry.data['fcaRegNumber'];
      }

      const membershipNumbers = membershipBody.reduce((acc, body) => {
        acc[body.key] = dataObject.memberships?.includes(body.key)
          ? dataObject[body.key]
          : undefined;
        return acc;
      }, {} as Record<string, any>);

      membershipBody.forEach((body) => {
        delete dataObject[body.key];
      });

      // Update the entry with the new data
      entry.data = {
        ...entry.data,
        ...dataObject,
        organisationName: dataObject.organisationName ?? '',
        organisationWebsite: dataObject.organisationWebsite?.length
          ? dataObject.organisationWebsite
          : undefined,
        organisationStreet: dataObject.organisationStreet ?? '',
        organisationCity: dataObject.organisationCity ?? '',
        organisationPostcode: dataObject.organisationPostcode ?? '',
        geoRegions: dataObject.geoRegions ?? [],
        organisationType: dataObject.organisationType,
        organisationTypeOther: dataObject.organisationTypeOther,
        sfslive: dataObject.sfslive ?? '',
        organisationUse: dataObject.organisationUse ?? '',
        organisationUseOther: dataObject.organisationUseOther,
        fcaReg: dataObject.fcaReg ?? '',
        debtAdvice: dataObject.debtAdvice,
        memberships: dataObject.memberships ?? [],
        ...membershipNumbers,
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

      return new Response(
        JSON.stringify({
          success: true,
          entry,
        }),
        {
          status: 200,
          headers: {
            ...Object.fromEntries(responseHeaders.entries()),
            'Content-Type': 'application/json',
          },
        },
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}

export const validationSchemas = z.object({
  organisationName: z.string().min(1, 'required'),
  organisationWebsite: z
    .string()
    .min(1, 'required')
    .url({ message: 'invalid' })
    .optional(),
  organisationStreet: z.string().min(1, 'required'),
  organisationCity: z.string().min(1, 'required'),
  organisationPostcode: z.string().min(1, 'required'),
  organisationType: z.string().min(1, 'required'),
  organisationTypeOther: z.string().min(1, 'required').optional(),
  geoRegions: z.array(z.string()).min(1, 'required'),
  organisationUse: z.string().min(1, 'required'),
  organisationUseOther: z.string().min(1, 'required').optional(),
  debtAdvice: z.array(z.string()).min(1, 'required'),
  debtAdviceOther: z.string().min(1, 'required').optional(),
  sfslive: z.string().min(1, 'required'),
  sfsLaunchDate: z.date(),
  caseManagementSoftware: z.string().optional(),
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
