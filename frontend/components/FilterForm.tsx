"use client";

import api from "@/hooks/useAxios";
import { fetchAllClientsForForm } from "@/services/clientServices.ts/client";
import { fetchSitesBySelectedClient } from "@/services/siteServices/site";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface FilterFormInputs {
  clientId: number | "";
  siteId: number | "";
  jobId: number | "";
  date?: string | "";
  startDate?: string | "";
  endDate?: string | "";
}

interface Props {
  onFilter: (filters: FilterFormInputs) => void;
  mode?: "single" | "range";
}

interface ClientType {
  id: number;
  clientName: string;
}

interface SiteType {
  id: number;
  siteName: string;
}

interface JobType {
  id: number;
  jobName: string;
}

const FilterForm = ({ onFilter, mode = "single" }: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FilterFormInputs>({
    defaultValues: {
      clientId: "",
      siteId: "",
      jobId: "",
      date: "",
      startDate: "",
      endDate: "",
    },
  });

  const selectedClient = watch("clientId");
  const selectedSite = watch("siteId");

  const [clients, setClients] = useState<ClientType[]>([]);
  const [sites, setSites] = useState<SiteType[]>([]);
  const [jobs, setJobs] = useState<JobType[]>([]);

  // Fetch clients
  useEffect(() => {
    fetchAllClientsForForm()
      .then((res) => setClients(res.data.data))
      .catch(console.error);
  }, []);

  // Fetch sites
  useEffect(() => {
    if (!selectedClient) {
      setSites([]);
      return;
    }

    fetchSitesBySelectedClient(selectedClient)
      .then((res) => setSites(res.data.data))
      .catch(console.error);
  }, [selectedClient]);

  // Fetch jobs
  useEffect(() => {
    if (!selectedSite) {
      setJobs([]);
      return;
    }

    api
      .get(`/admin/job/site/${selectedSite}`)
      .then((res) => setJobs(res.data.data))
      .catch(console.error);
  }, [selectedSite]);

  const onSubmit = (data: FilterFormInputs) => {
    onFilter(data);
  };

  const handleReset = () => {
    reset({
      clientId: "",
      siteId: "",
      jobId: "",
      date: "",
      startDate: "",
      endDate: "",
    });

    onFilter({
      clientId: "",
      siteId: "",
      jobId: "",
      date: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 rounded-lg flex flex-col gap-4 w-full"
    >
      {/* ROW 1 → CLIENT + DATE OR DATE RANGE */}
      <div className="flex flex-col gap-4 w-full">
        {/* DATE — SINGLE OR RANGE */}
        <div className="flex-1">
          {mode === "single" ? (
            <>
              <Controller
                control={control}
                name="date"
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className={`border outline-0 px-4 py-2 rounded-full w-full ${
                      errors.date ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="startDate"
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className={`border outline-0 px-4 py-2 rounded-full w-full ${
                        errors.startDate ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Controller
                  control={control}
                  name="endDate"
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className={`border outline-0 px-4 py-2 rounded-full w-full ${
                        errors.endDate ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CLIENT */}
        <div className="flex-1">
          <Controller
            control={control}
            name="clientId"
            // rules={{ required: "Client is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`border outline-0 px-4 py-2 rounded-full w-full ${
                  errors.clientId ? "border-red-500" : "border-gray-400"
                }`}
              >
                <option value="">Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientName}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.clientId && (
            <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>
          )}
        </div>
      </div>

      {/* ROW 2 → SITE */}
      <div className="w-full">
        <Controller
          control={control}
          name="siteId"
          // rules={{ required: "Site is required" }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedClient}
              className={`border outline-0 px-4 py-2 rounded-full w-full ${
                errors.siteId ? "border-red-500" : "border-gray-400"
              }`}
            >
              <option value="">Site</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.siteName}
                </option>
              ))}
            </select>
          )}
        />
        {errors.siteId && (
          <p className="text-red-500 text-sm mt-1">{errors.siteId.message}</p>
        )}
      </div>

      {/* ROW 3 → JOB */}
      <div className="w-full">
        <Controller
          control={control}
          name="jobId"
          // rules={{ required: "Job is required" }}
          render={({ field }) => (
            <select
              {...field}
              disabled={!selectedSite}
              className={`border outline-0 px-4 py-2 rounded-full w-full ${
                errors.jobId ? "border-red-500" : "border-gray-400"
              }`}
            >
              <option value="">Job</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.jobName}
                </option>
              ))}
            </select>
          )}
        />
        {errors.jobId && (
          <p className="text-red-500 text-sm mt-1">{errors.jobId.message}</p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-full"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="bg-white text-black border px-6 py-2 rounded-full"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default FilterForm;
