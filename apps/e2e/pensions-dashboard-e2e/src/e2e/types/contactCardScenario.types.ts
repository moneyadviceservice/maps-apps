interface BaseContactCardDetailsRow {
  /**
   * The selector is just the text after 'dt-' or 'dd-'
   * Where 'dt' the row title
   * And 'dd' is the row description
   * Tests will prepend the tag before this string.
   */
  selector: string;
}

export type ContactCardDetailsRow = BaseContactCardDetailsRow & {
  title:
    | 'Pension provider'
    | 'Plan reference number'
    | 'Website'
    | 'Email address'
    | 'Address'
    | 'Email';
  description: string;
};

export type ContactCardDetailsNumberRow = BaseContactCardDetailsRow & {
  title: 'Phone number';
  description: string[];
};

export interface Pension {
  schemeName: string;
  pensionType: string;
  contactCardDetailsTable: Array<
    ContactCardDetailsRow | ContactCardDetailsNumberRow
  >;
}

export interface ContactCardScenario {
  option: string;
  pensions: Array<Pension>;
}
