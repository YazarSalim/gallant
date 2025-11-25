export interface ClientFormValues {
  id?: string;
  clientCode: string;
  clientName: string;
  contact: string;
}

export interface Client {
  id: string;
  clientName: string;
  clientCode: string;
  contact: string;
}

export interface Site {
  id: string;
  siteName: string;
  siteCode: string;
  clientName: string;
  clientId: string;
}
