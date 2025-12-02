import { UserFormValues } from "@/components/AdminUserForm";
import api from "../../hooks/useAxios";

export const createUser = (data:UserFormValues) => api.post("/admin/user/createUser", data);
export const getAllUsers = (
  currentPage: number,
  limit: number,
  search: string
) =>
  api.get(
    `/admin/user/getAllUsers?page=${currentPage}&limit=${limit}&search=${search}`
  );
export const getUserById = (id: string) =>
  api.get(`/admin/user/getUserById/${id}`);

export const updateUser=(id:string,data:UserFormValues)=>api.post(`/admin/user/updateUser/${id}`,data)

export const deleteUser=(id:string)=>api.delete(`/admin/user/deleteUser/${id}`)