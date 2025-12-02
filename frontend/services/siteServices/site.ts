import { SiteFormValues } from '@/components/SiteForm';
import api from '../../hooks/useAxios';

export const getSiteById = (siteId:string)=>api.get(`/admin/site/getSiteById/${siteId}`)
export const deleteSite=(deleteSiteId:string)=>api.patch(`/admin/site/deletesite/${deleteSiteId}`)
export const updateSite=(id:string,data:SiteFormValues)=>api.put(`/admin/site/updatesite/${id}`, data)
export const createSite=(data:SiteFormValues)=>api.post("/admin/site/createsite", data)
export const fetchSitesBySelectedClient=(selectedClientId:string)=>api.get(`/admin/site/${selectedClientId}`)
export const getAllSites=(currentPage:number,limit:number,search:string)=>api.get("/admin/site/allSites", {
        params: {
          page: currentPage,
          limit: limit,
          search: search || "",
        },
      });