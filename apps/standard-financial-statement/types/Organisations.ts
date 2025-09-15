type User = {
  first_name?: string;
  last_name?: string;
  email: string;
  job_title?: string;
  join_date?: string;
  last_login?: string;
};

type GeoRegions = {
  key: string;
  title: string;
};

type DeliveryChannel = {
  key: string;
  title: string;
};

type Membership = {
  key: string;
  title: string;
};

export type Organisation = {
  id: string;
  name: string;
  licence_number: number | string;
  type: {
    title: string;
    type_other?: string;
  };
  licence_status: string;
  sfs_live: boolean;
  created: string;
  modified: string;
  email?: string;
  declined_reason?: string;
  fca?: {
    fca_number?: string;
    fca_registered?: string;
  };
  website?: string;
  address?: string;
  users?: { email: string }[];
  usage?: {
    intended_use?: string;
    launch_date?: string;
    management_software_used?: string;
    other_use?: string;
  };
  geo_regions?: GeoRegions[];
  delivery_channel?: DeliveryChannel[];
  organisation_membership?: Membership[];
};

export type OrgProps = {
  data: Organisation[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  name?: string;
  type?: string;
  continuationToken?: string;
};
