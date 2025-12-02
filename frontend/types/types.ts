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


export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
}