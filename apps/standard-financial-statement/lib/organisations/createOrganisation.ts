import { Entry } from 'lib/types';
import { Organisation } from 'types/Organisations';

import { dbConnect } from '../database/dbConnect';

export const createOrganisation = async (
  entry: Entry,
  emailAddress: string,
) => {
  const { container } = await dbConnect();

  // Query to find the highest licence_number value
  const querySpec = {
    query:
      'SELECT TOP 1 c.licence_number FROM c WHERE IS_DEFINED(c.licence_number) AND c.licence_number != "" ORDER BY c.licence_number DESC',
  };
  const { resources: highestLicence } = await container.items
    .query(querySpec)
    .fetchAll();

  const licenceNumber =
    highestLicence.length > 0 ? Number(highestLicence[0]?.licence_number) : 0;

  const {
    organisationName,
    organisationWebsite,
    organisationStreet,
    organisationCity,
    organisationPostcode,
    organisationType,
    organisationTypeOther,
    organisationUse,
    organisationUseOther,
    sfsLaunchDate,
    caseManagementSoftware,
    sfslive,
    geoRegions,
    fcaReg,
    fcaRegNumber,
    debtAdvice,
    memberships,
  } = entry.data;

  try {
    const organisation: Omit<Organisation, 'id'> = {
      name: organisationName ?? '',
      licence_number: licenceNumber + 1,
      type: {
        title: organisationType ?? '',
        type_other: organisationTypeOther ?? '',
      },
      licence_status: 'Pending',
      sfs_live: !!sfslive,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      email: emailAddress,
      declined_reason: '',
      fca: {
        fca_number: fcaReg === 'fca-yes' ? fcaRegNumber : '',
        fca_registered: fcaReg === 'fca-yes' ? 'yes' : 'no',
      },
      website: organisationWebsite ?? '',
      address: `${organisationStreet ?? ''}, ${organisationCity ?? ''}, ${
        organisationPostcode ?? ''
      }`,
      users: [
        {
          email: emailAddress,
        },
      ],
      usage: {
        launch_date: formatDate(new Date(sfsLaunchDate as string)),
        management_software_used: caseManagementSoftware ?? '',
        intended_use: organisationUse,
        other_use: organisationUseOther ?? '',
      },
      geo_regions:
        geoRegions?.map((region) => ({
          title: region,
          key: region,
        })) ?? [],
      delivery_channel:
        debtAdvice?.map((region) => ({
          title: region,
          key: region,
        })) ?? [],
      organisation_membership:
        memberships?.map((membership) => ({
          title: membership,
          key: entry.data[membership] ?? '',
        })) ?? [],
    };

    const response = await container.items.create(organisation);

    return { success: true, response: response.resource };
  } catch (error) {
    console.error('Create failed:', error);
    return { error: 'Failed to create organisation' };
  }
};

const formatDate = (date: Date) => {
  return (
    date.getDate().toString().padStart(2, '0') +
    '/' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    date.getFullYear()
  );
};
