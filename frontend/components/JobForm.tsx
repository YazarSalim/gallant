"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";
import Input from "./Input";
import { Client, Site } from "@/types/types";
import { createJob, updateJob } from "@/services/jobServices/jobs";
import { fetchAllClientsForForm } from "@/services/clientServices.ts/client";
import { fetchSitesBySelectedClient } from "@/services/siteServices/site";

const jobSchema = z.object({
  jobName: z.string().min(1, "Job name is required"),
  jobCode: z.string().min(1, "Job code is required"),
  clientId: z.string().min(1, "Client is required"),
  siteId: z.string().min(1, "Site is required"),
});

export type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  initialData?: JobFormValues & { id: string };
  onClose: () => void;
  onSuccess: () => void;
}

const JobForm = ({ initialData, onClose, onSuccess }: JobFormProps) => {

  const isEditMode = !!initialData;
  const [clients, setClients] = useState<Client[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobName: "",
      jobCode: "",
      clientId: "",
      siteId: "",
    },
  });

  const selectedClientId = watch("clientId");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetchAllClientsForForm();
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
    if (!selectedClientId) return;

    const fetchSites = async () => {
      try {
        const res = await fetchSitesBySelectedClient(selectedClientId);
        setSites(res.data.data);
      } catch (err) {
        console.error("Failed to fetch sites", err);
      }
    };

    fetchSites();
  }, [selectedClientId]);

  useEffect(() => {
    if (!initialData?.clientId) return;

    const fetchSitesForEdit = async () => {
      try {
        const res = await api.get(`/admin/site/${initialData.clientId}`);
        setSites(res.data.data);
      } catch (err) {
        console.error("Failed to load sites for edit", err);
      }
    };

    fetchSitesForEdit();
  }, [initialData]);

  useEffect(() => {
    if (!initialData) return;
    if (loadingClients) return;
    if (sites.length === 0) return;

    reset({
      jobName: initialData.jobName,
      jobCode: initialData.jobCode,
      clientId: String(initialData.clientId),
      siteId: String(initialData.siteId),
    });
  }, [initialData, loadingClients, sites, reset]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      if (initialData) {
        await updateJob(initialData.id, data);
        toast.success("Job updated!");
        onSuccess();
      } else {
        const res = await createJob(data);
        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Job save failed", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl w-full max-w-lg ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {initialData ? "Edit Job" : "Add Job"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Job Code"
              {...register("jobCode")}
              disabled={isEditMode}
              error={errors.jobCode?.message}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Job Name"
              {...register("jobName")}
              error={errors.jobName?.message}
            />
          </div>
        </div>

        {/* Client Dropdown */}
        <div>
          <select
            {...register("clientId")}
            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-black focus:outline-none"
          >
            <option value="">Select Client</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.clientName}
              </option>
            ))}
          </select>

          {errors.clientId && (
            <p className="text-red-500 text-xs">{errors.clientId.message}</p>
          )}
        </div>

        {/* Site Dropdown */}
        <div>
          <select
            {...register("siteId")}
            disabled={!selectedClientId}
            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-black focus:outline-none"
          >
            <option value="">Select Site</option>

            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.siteName}
              </option>
            ))}
          </select>

          {errors.siteId && (
            <p className="text-red-500 text-xs">{errors.siteId.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
