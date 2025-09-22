// Organisations CVS sharepoint location url:
// https://mapsorg.sharepoint.com.mcas.ms/sites/TMT-TechMigrationTeam/_layouts/15/doc.aspx?sourcedoc={affb93e7-e2aa-40b3-a61c-fce124aac086}&action=edit

export interface ProviderJSON {
  id: string;
  name: string;
  address_street_address: string;
  address_locality: string;
  address_region: string;
  address_postcode: string;
  lat: string;
  lng: string;
  email_address: string;
  website_address: string;
  minicom: string;
  notes: string;
  provides_face_to_face: string;
  provides_telephone: string;
  provides_web: string;
  created_at: string;
  updated_at: string;
  telephone_en: string;
  telephone_cy: string;
  region_england: string;
  region_northern_ireland: string;
  region_scotland: string;
  region_wales: string;
  website_address_text: string;
  notes_cy: string;
  debt_advice_locator_organisation_standard_id: string;
  display_in_accredited_list: string;
  standard_ids: string;
  distance?: number | string;
}

export type ProviderType = {
  id?: number;
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postcode: string;
  lat?: number | null;
  lng?: number | null;
  emailAddress: string;
  telephoneNumber: string;
  websiteAddress: string;
  notesEN: string;
  notesCY: string;
  providesFaceToFace: boolean;
  providesTelephone: boolean;
  providesWeb: boolean;
  availableInEngland: boolean;
  availableInNorthernIreland: boolean;
  availableInScotland: boolean;
  availableInWales: boolean;
  distance: number;
};

export function getLocalData(data: ProviderJSON[]): Promise<ProviderType[]> {
  return Promise.resolve(
    data.map(
      (item: ProviderJSON) =>
        ({
          id: Number(item['id']),
          name: item['name'],
          streetAddress: item['address_street_address'],
          addressLocality: item['address_locality'],
          addressRegion: item['address_region'],
          postcode: item['address_postcode'],
          lat: Number(item['lat']) || null,
          lng: Number(item['lng']) || null,
          emailAddress: item['email_address'],
          telephoneNumber: item['telephone_en'],
          websiteAddress: item['website_address'],
          notesEN: item['notes'],
          notesCY: item['notes_cy'],
          providesFaceToFace:
            item['provides_face_to_face'].toLowerCase() === 'true',
          providesTelephone:
            item['provides_telephone'].toLowerCase() === 'true',
          providesWeb: item['provides_web'].toLowerCase() === 'true',
          availableInEngland: item['region_england'].toLowerCase() === 'true',
          availableInNorthernIreland:
            item['region_northern_ireland'].toLowerCase() === 'true',
          availableInScotland: item['region_scotland'].toLowerCase() === 'true',
          availableInWales: item['region_wales'].toLowerCase() === 'true',
          distance: item.distance ? item.distance : 0,
        } as ProviderType),
    ),
  );
}

const shuffle = (array: ProviderType[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function getProviders(data: ProviderType[]) {
  const filterByCountryAndType = (
    country: string,
    type: string,
  ): ProviderType[] => {
    return shuffle(
      data
        .filter((provider) => {
          if (
            (country === '0' && provider.availableInEngland) ||
            (country === '2' && provider.availableInWales)
          ) {
            return provider;
          } else if (country === '3' && provider.availableInNorthernIreland) {
            return provider;
          } else if (country === '1' && provider.availableInScotland) {
            return provider;
          } else {
            return false;
          }
        })
        .filter((provider) => {
          if (type === '0' && provider.providesWeb) {
            return provider;
          } else if (type === '1' && provider.providesTelephone) {
            return provider;
          } else if (type === '2' && provider.providesFaceToFace) {
            return provider;
          } else {
            return false;
          }
        }),
    );
  };

  return {
    filterByCountryAndType,
  };
}
