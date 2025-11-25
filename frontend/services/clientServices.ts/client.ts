import { ClientFormValues } from "@/types/types";
import api from "../../hooks/useAxios";

export const getClientById = (clientId: string) =>
  api.get(`/admin/client/getClientById/${clientId}`);

export const deleteClient = (deleteClientId: string) =>
  api.delete(`/admin/client/deleteClient/${deleteClientId}`);

export const getAllClients = (
  currentPage: number,
  limit: number,
  search: string
) =>
  api.get(`/admin/client?page=${currentPage}&limit=${limit}&search=${search}`);

export const updateClient = ( id:string,data:ClientFormValues) =>
  api.put(`/admin/client/updateClient/${id}`, data);

export const createClient = (data:ClientFormValues) =>
  api.post("/admin/client/createclient", data);
