import { JobFormValues } from "@/components/JobForm";
import api from "../../hooks/useAxios";

export const deleteJob = (selectedJobId: string) =>
  api.delete(`/admin/job/deletejob/${selectedJobId}`);
export const updateJob = (id: string, data: JobFormValues) =>
  api.put(`/admin/job/updatejob/${id}`, data);
export const createJob = (data: JobFormValues) =>
  api.post("/admin/job/createjob", data);
export const getAlljobs = (currentPage:number,limit:number,search:string) =>
  api.get(
    `/admin/job?page=${currentPage}&limit=${limit}&search=${search || ""}`
  );
