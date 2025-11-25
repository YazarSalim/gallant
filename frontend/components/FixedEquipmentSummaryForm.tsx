"use client";

import api from "@/hooks/useAxios";
import { Categories, KPIs } from "@/utils/kpivaluescategories";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface Client {
  id: number;
  clientName: string;
}
interface Site {
  id: number;
  siteName: string;
}
interface Job {
  id: number;
  jobName: string;
}


interface FixedEquipmentSummaryFormProps {
  setIsOpen: (open: boolean) => void;
  editingEntry?: {
    id: number;
    client: Client;
    site: Site;
    job: Job;
    entryDate: string;
    kpiValues: {
      kpi: { id: number; name: string };
      category: { id: number; name: string };
      value: number;
    }[];
  } | null;
}

const formSchema = z.object({
  clientId: z.string().nonempty("Client is required"),
  siteId: z.string().nonempty("Site is required"),
  jobId: z.string().nonempty("Job is required"),
  entryDate: z.string().nonempty("Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FixedEquipmentSummaryForm: React.FC<FixedEquipmentSummaryFormProps> = ({
  setIsOpen,
  editingEntry,
}) => {

  const [clients, setClients] = useState<Client[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tableData, setTableData] = useState<{
    [cat: string]: { [kpi: string]: number | "" };
  }>({});

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { clientId: "", siteId: "", jobId: "", entryDate: "" },
  });

  const selectedClient = watch("clientId");
  const selectedSite = watch("siteId");

  useEffect(() => {
    const initialData: { [cat: string]: { [kpi: string]: number | "" } } = {};
    Categories.forEach((cat) => {
      initialData[cat] = {};
      KPIs.forEach((kpi) => {
        initialData[cat][kpi] = 0;
      });
    });
    setTableData(initialData);
  }, []);

  useEffect(() => {
    api
      .get("/admin/client")
      .then((res) => setClients(res.data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedClient) return;
    api
      .get(`/admin/site/${selectedClient}`)
      .then((res) => setSites(res.data.data))
      .catch(console.error);
  }, [selectedClient]);

  useEffect(() => {
    if (!selectedSite) return;
    api
      .get(`/admin/job/${selectedSite}`)
      .then((res) => setJobs(res.data.data))
      .catch(console.error);
  }, [selectedSite]);

  useEffect(() => {
    if (!editingEntry) return;

    setValue("clientId", editingEntry.client.id.toString());
    setValue("siteId", editingEntry.site.id.toString());
    setValue("jobId", editingEntry.job.id.toString());
    const isoDate = new Date(editingEntry.entryDate);
    const formattedDate = isoDate.toISOString().split("T")[0];
    setValue("entryDate", formattedDate);


    const newTableData: { [cat: string]: { [kpi: string]: number | "" } } = {};
    Categories.forEach((cat) => {
      newTableData[cat] = {};
      KPIs.forEach((kpi) => {
        newTableData[cat][kpi] = 0;
      });
    });

    editingEntry.kpiValues.forEach((kv) => {
      const cat = kv.category.name;
      const kpi = kv.kpi.name;
      if (newTableData[cat] && newTableData[cat][kpi] !== undefined) {
        newTableData[cat][kpi] = kv.value;
      }
    });

    setTableData(newTableData);
  }, [editingEntry, setValue]);

  const onSubmit = async (data: FormValues) => {
    const values = [];
    Categories.forEach((cat, ci) => {
      KPIs.forEach((kpi, ki) => {
        values.push({
          kpiId: ki + 1,
          categoryId: ci + 1,
          value: Number(tableData[cat][kpi]) || 0,
        });
      });
    });

    const payload = {
      clientId: Number(data.clientId),
      siteId: Number(data.siteId),
      jobId: Number(data.jobId),
      entryDate: data.entryDate,
      values,
    };

    try {
      if (editingEntry) {
        await api.put(`/admin/kpi/kpi-entry-log/${editingEntry.id}`, payload);
      } else {
        await api.post("/admin/kpi/savevalues", payload);
      }
      toast.success("Saved successfully!");
      setIsOpen(false);
      window.location.reload()
    } catch (error) {
      console.error(error);
      toast.error("Error saving data");
    }
  };

  return (
    <div className="p-4 relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-5 justify-end mb-4">
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <select
                {...field}
                className="border rounded-full px-3 py-1"
                onChange={(e) => {
                  field.onChange(e);
                  setValue("siteId", "");
                  setValue("jobId", "");
                  setSites([]);
                  setJobs([]);
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

          <Controller
            control={control}
            name="siteId"
            render={({ field }) => (
              <select
                {...field}
                className="border rounded-full px-3 py-1"
                disabled={!selectedClient}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("jobId", "");
                  setJobs([]);
                }}
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
            <span className="text-red-500">{errors.siteId.message}</span>
          )}

          <Controller
            control={control}
            name="jobId"
            render={({ field }) => (
              <select
                {...field}
                className="border rounded-full px-3 py-1"
                disabled={!selectedSite}
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
            <span className="text-red-500">{errors.jobId.message}</span>
          )}

          <Controller
            control={control}
            name="entryDate"
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

        <div className="overflow-auto">
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border p-2">Category / KPI</th>
                {KPIs.map((kpi) => (
                  <th key={kpi} className="border p-2">
                    {kpi}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Categories.map((cat) => (
                <tr key={cat}>
                  <td className="border border-gray-300 p-2 font-semibold">
                    {cat}
                  </td>
                  {KPIs.map((kpi) => (
                    <td
                      key={kpi}
                      className="border border-gray-300 p-1 text-center"
                    >
                      <input
                        type="number"
                        className="w-16 text-center border-0 outline-0 rounded"
                        value={tableData[cat]?.[kpi] ?? ""}
                        onFocus={() => {
                          if (tableData[cat][kpi] === 0)
                            setTableData((prev) => ({
                              ...prev,
                              [cat]: { ...prev[cat], [kpi]: "" },
                            }));
                        }}
                        onChange={(e) =>
                          setTableData((prev) => ({
                            ...prev,
                            [cat]: {
                              ...prev[cat],
                              [kpi]: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FixedEquipmentSummaryForm;
