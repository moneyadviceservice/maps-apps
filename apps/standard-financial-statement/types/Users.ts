export interface UserData {
  id: string;
  userPrincipalName: string;
  givenName?: string;
  surname?: string;
  displayName?: string;
  mail?: string;
  jobTitle?: string;
  createdDateTime?: string;
  signInActivity?: {
    lastSignInDateTime?: string;
    lastSuccessfulSignInDateTime?: string;
  };
}

export type Users = UserData[];

export interface BatchResponse {
  id: string;
  status: number;
  headers: Record<string, string>;
  body?: unknown;
}
