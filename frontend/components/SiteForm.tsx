"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";
import { createSite, updateSite } from "@/services/siteServices/site";
import { Client } from "@/types/types";
import Input from "./Input";

const siteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteCode: z.string().min(1, "Site code is required"),
  clientId: z.string().min(1, "Client is required"),
});

export type SiteFormValues = z.infer<typeof siteSchema>;

interface SiteFormProps {
  initialData?: SiteFormValues & { id: string };
  onClose: () => void;
  onSuccess: () => void;
}


const SiteForm = ({ initialData, onClose,onSuccess }: SiteFormProps) => {
  const isEditMode = !!initialData;
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: initialData
      ? {
          siteName: initialData.siteName,
          siteCode: initialData.siteCode,
          clientId: String(initialData.clientId),
        }
      : {
          siteName: "",
          siteCode: "",
          clientId: "",
        },
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/admin/client");
        setClients(res.data.data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (initialData && !loadingClients) {
      reset({
        siteName: initialData.siteName,
        siteCode: initialData.siteCode,
        clientId: String(initialData.clientId),
      });
    }
  }, [initialData, loadingClients, reset]);

  const onSubmit = async (data: SiteFormValues) => {
    try {
      if (initialData) {
        await updateSite(initialData.id,data);
        toast.success("Site updated!");
        onSuccess()
      } else {
        await createSite(data);
        toast.success("Site created!");
        onSuccess()
      }

      onClose();
    } catch (err) {
      console.error("Site save failed", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {initialData ? "Edit Site" : "Add Site"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Site Code"
              disabled={isEditMode}
              {...register("siteCode")}
              // className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full 
              //   focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.siteCode && (
              <p className="text-red-500 text-xs mt-1">{errors.siteCode.message}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder="Site Name"
              {...register("siteName")}
              // className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full 
              //   focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.siteName && (
              <p className="text-red-500 text-xs mt-1">{errors.siteName.message}</p>
            )}
          </div>
        </div>
        <div>
          <select
            {...register("clientId")}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full bg-white
              focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Client</option>
            {loadingClients ? (
              <option disabled>Loading...</option>
            ) : (
              clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.clientName}
                </option>
              ))
            )}
          </select>
          {errors.clientId && (
            <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : initialData ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteForm;
