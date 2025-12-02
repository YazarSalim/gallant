"use client";

import api from "@/hooks/useAxios";
import { fetchAllClientsForForm } from "@/services/clientServices.ts/client";
import { fetchSitesBySelectedClient } from "@/services/siteServices/site";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface RowType {
  label: string;
  value: number | null;
}

export interface TurnAroundFormInputs {
  clientId: number;
  siteId: number;
  jobId: number;
  entryDate: string;
}

export interface EditingEntryType {
  id: number;
  clientId: number;
  siteId: number;
  jobId: number;
  entryDate: string;
  directEarned: RowType[];
  percentComplete: RowType[];
}

interface TurnAroundExecutionFormProps {
  setIsOpen: (value: boolean) => void;
  editingEntry?: EditingEntryType | null;
  onSuccess: () => void;
}


const TurnAroundExecutionForm = ({ setIsOpen, editingEntry, onSuccess }: TurnAroundExecutionFormProps) => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TurnAroundFormInputs>({
    defaultValues: {
      clientId: "",
      siteId: "",
      jobId: "",
      entryDate: "",
    },
  });

  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [jobs, setJobs] = useState([]);
  const DIRECT_EARNED_ROWS = [
    { label: "Planned Earn Period", value: 0 },
    { label: "Earn Period", value: 0 },
    { label: "Earn Cumulative", value: 0 },
    { label: "Actual Earn Cumulative", value: 0 },
  ];

  const PERCENT_COMPLETE_ROWS = [
    { label: "Planned Earn Period", value: 0 },
    { label: "Actual Earn Period", value: 0 },
    { label: "Baseline Planned Cumulative", value: 0 },
    { label: "Actual Earn Cumulative", value: 0 },
  ];

  const [directRows, setDirectRows] = useState(DIRECT_EARNED_ROWS);
  const [percentRows, setPercentRows] = useState(PERCENT_COMPLETE_ROWS);

  const handleOnSubmit = async (data:EditingEntryType) => {
    const payload = {
      clientId: data.clientId,
      siteId: data.siteId,
      jobId: data.jobId,
      entryDate: data.entryDate,
      directEarned: directRows,
      percentComplete: percentRows,
    };

    if(editingEntry){
      const res = await api.put(`/turnaroudexecution/updateTurnAroundExecution/${editingEntry.id}`,payload);
      setIsOpen(false)
      onSuccess()
      toast.success(res.data.message)
      return
    }
     const res = await api.post(
      "/turnaroudexecution/createTurnAroundExecution",
      payload
    );
    setIsOpen(false)
    onSuccess()

    toast.success(res.data.message)
  };

  const fetchAllClients = async () => {
    const response = await fetchAllClientsForForm();
    setClients(response.data.data);
  };

  const selectedClient = watch("clientId");
  const selectedSite = watch("siteId");

  useEffect(() => {
    if (!selectedClient) return;
    fetchSitesBySelectedClient(selectedClient)
      .then((res) => setSites(res.data.data))
      .catch(console.error);
  }, [selectedClient]);

  useEffect(() => {
    if (!selectedSite) return;
    api
      .get(`/admin/job/site/${selectedSite}`)
      .then((res) => setJobs(res.data.data))
      .catch(console.error);
  }, [selectedSite]);


useEffect(() => {
  if (!editingEntry) return;

  // Fill form
  reset({
    clientId: editingEntry.clientId,
    siteId: editingEntry.siteId,
    jobId: editingEntry.jobId,
    entryDate: editingEntry.entryDate?.slice(0, 10),
  });

  // Table rows
  setDirectRows(editingEntry.directEarned || DIRECT_EARNED_ROWS);
  setPercentRows(editingEntry.percentComplete || PERCENT_COMPLETE_ROWS);

  // Load dependent dropdowns
  fetchSitesBySelectedClient(editingEntry.clientId)
    .then((res) => setSites(res.data.data));

  api
    .get(`/admin/job/site/${editingEntry.siteId}`)
    .then((res) => setJobs(res.data.data));
}, [editingEntry]);

useEffect(()=>{
  fetchAllClients()
},[])

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="flex justify-end gap-5">
            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="clientId"
                rules={{ required: "Client is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
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
                <span className="text-red-500">{errors.clientId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="siteId"
                disabled={!selectedClient}
                rules={{ required: "Site is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    <option value="">Site</option>
                    {sites?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.siteName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.siteId && (
                <span className="text-red-500">{errors.siteId.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="jobId"
                rules={{ required: "Job is required" }}
                disabled={!selectedSite}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    <option value="">Job</option>
                    {jobs?.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.jobName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.jobId && (
                <span className="text-red-500">{errors.jobId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="entryDate"
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="border px-3 py-1 rounded-full"
                  />
                )}
              />
              {errors.entryDate && (
                <span className="text-red-500">{errors.entryDate.message}</span>
              )}
            </div>
          </div>

          <div className="flex gap-10">
            {/* LEFT COLUMN */}

            <div className="w-full  rounded p-4">
              <div className="font-bold text-lg mb-4 border-b pb-2">
                Direct Earned MHRS
              </div>

              <div className="flex flex-col gap-3">
                {directRows.map((row, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="text-sm">{row.label}</div>
                    <input
                      type="number"
                      min={0}
                      value={row.value ?? ""}
                      className="border p-1 w-20 rounded"
                      onChange={(e) => {
                        const updated = [...directRows];
                        const val =
                          e.target.value === "" ? null : Number(e.target.value);
                        updated[index].value = val;
                        setDirectRows(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full  rounded p-4">
              <div className="font-bold text-lg mb-4 border-b pb-2">
                % Complete
              </div>

              <div className="flex flex-col gap-3">
                {percentRows.map((row, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="text-sm">{row.label}</div>
                    <input
                      type="number"
                      min={0}
                      value={row.value ?? ""}
                      className="border p-1 w-20 rounded"
                      onChange={(e) => {
                        const updated = [...percentRows];
                        const val =
                          e.target.value === "" ? null : Number(e.target.value);
                        updated[index].value = val;
                        setPercentRows(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TurnAroundExecutionForm;
