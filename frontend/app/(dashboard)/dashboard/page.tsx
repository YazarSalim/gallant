"use client";

import Skeleton from "@/components/Skeleton";
import TurnAroundExecSummary from "@/components/TurnAroundExecSummary";
import api from "@/hooks/useAxios";
import { Categories, KPIs } from "@/utils/kpivaluescategories";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

interface Client {
  id: string;
  clientName: string;
}

interface Site {
  id: string;
  siteName: string;
}

interface Job {
  id: string;
  jobName: string;
}

interface FormValues {
  clientId: string;
  siteId: string;
  jobId: string;
  from: string;
  to: string;
}

interface SummaryItem {
  categoryName: string;
  kpiName: string;
  total: number;
}

const SummaryPage = () => {
  const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      clientId: "",
      siteId: "",
      jobId: "",
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
    },
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [tableData, setTableData] = useState<
    Record<string, Record<string, number>>
  >(
    Categories.reduce((acc, cat) => {
      acc[cat] = KPIs.reduce((k, kpi) => {
        k[kpi] = 0;
        return k;
      }, {} as Record<string, number>);
      return acc;
    }, {} as Record<string, Record<string, number>>)
  );

  const selectedClient = watch("clientId");
  const selectedSite = watch("siteId");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get<{ data: Client[] }>("/admin/client");
        const clientsData = res.data.data;
        setClients(clientsData);

        if (clientsData.length > 0) {
          const firstClientId = clientsData[clientsData.length - 1].id;
          setValue("clientId", firstClientId);

          // Fetch sites
          const sitesRes = await api.get<{ data: Site[] }>(
            `/admin/site/${firstClientId}`
          );
          const sitesData = sitesRes.data.data;
          setSites(sitesData);

          if (sitesData.length > 0) {
            const firstSiteId = sitesData[0].id;
            setValue("siteId", firstSiteId);

            // Fetch jobs
            const jobsRes = await api.get<{ data: Job[] }>(
              `/admin/job/site/${firstSiteId}`
            );
            const jobsData = jobsRes.data.data;
            setJobs(jobsData);

            if (jobsData.length > 0) {
              const firstJobId = jobsData[0].id;
              setValue("jobId", firstJobId);

              const today = new Date();
              const to = today.toISOString().split("T")[0];

              const lastWeek = new Date();
              lastWeek.setDate(today.getDate() - 7);
              const from = lastWeek.toISOString().split("T")[0];
              setValue("from", from);
              setValue("to", to);

              // Fetch initial summary
              fetchSummary({
                clientId: firstClientId,
                siteId: firstSiteId,
                jobId: firstJobId,
                from,
                to,
              });
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSummary = async (params: FormValues) => {
      try {
        const res = await api.get<{ data: SummaryItem[] }>(
          "/admin/kpi/kpiSummaryValues",
          { params }
        );
        const summary = res.data.data;

        const formatted = Categories.reduce((acc, cat) => {
          acc[cat] = KPIs.reduce((kpiObj, kpi) => {
            const found = summary.find(
              (item) => item.categoryName === cat && item.kpiName === kpi
            );
            kpiObj[kpi] = found ? found.total : 0;
            return kpiObj;
          }, {} as Record<string, number>);
          return acc;
        }, {} as Record<string, Record<string, number>>);

        setTableData(formatted);
      } catch (error) {
        console.error("Error fetching initial summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [setValue]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: SummaryItem[] }>(
        "/admin/kpi/kpiSummaryValues",
        { params: data }
      );
      const summary = res.data.data;

      const formatted = Categories.reduce((acc, cat) => {
        acc[cat] = KPIs.reduce((kpiObj, kpi) => {
          const found = summary.find(
            (item) => item.categoryName === cat && item.kpiName === kpi
          );
          kpiObj[kpi] = found ? found.total : 0;
          return kpiObj;
        }, {} as Record<string, number>);
        return acc;
      }, {} as Record<string, Record<string, number>>);

      setTableData(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-5 justify-evenly mb-4">
          {/* CLIENT */}
          <Controller
            control={control}
            name="clientId"
            rules={{ required: "Please select a client" }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <select
                  {...field}
                  className="bg-white rounded-full px-4 py-2 w-[250px]"
                  onChange={async (e) => {
                    field.onChange(e);
                    setValue("siteId", "");
                    setValue("jobId", "");
                    setSites([]);
                    setJobs([]);

                    const sitesRes = await api.get<{ data: Site[] }>(
                      `/admin/site/${e.target.value}`
                    );
                    setSites(sitesRes.data.data);
                  }}
                >
                  <option value="">Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.clientName}
                    </option>
                  ))}
                </select>

                {/* Display validation error */}
                {fieldState.error && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          {/* SITE */}
          <Controller
            control={control}
            name="siteId"
            rules={{ required: "Please select a Site" }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <select
                  {...field}
                  disabled={!selectedClient}
                  className="bg-white rounded-full px-4 py-2 w-[250px]"
                  onChange={async (e) => {
                    field.onChange(e);
                    setValue("jobId", "");
                    setJobs([]);

                    const jobsRes = await api.get<{ data: Job[] }>(
                      `/admin/job/site/${e.target.value}`
                    );
                    setJobs(jobsRes.data.data);
                  }}
                >
                  <option value="">Site</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.siteName}
                    </option>
                  ))}
                </select>

                {/* Display validation error */}
                {fieldState.error && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          {/* JOB */}
          <Controller
            control={control}
            name="jobId"
            rules={{ required: "Please select a job" }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <select
                  {...field}
                  disabled={!selectedSite}
                  className="bg-white rounded-full px-4 py-2 w-[250px]"
                >
                  <option value="">Job</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.jobName}
                    </option>
                  ))}
                </select>

                {/* Display validation error */}
                {fieldState.error && (
                  <span className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          {/* FROM DATE */}
          <Controller
            control={control}
            name="from"
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="bg-white rounded-full px-4 py-2 w-[250px]"
              />
            )}
          />

          {/* TO DATE */}
          <Controller
            control={control}
            name="to"
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="bg-white rounded-full px-4 py-2 w-[250px]"
              />
            )}
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-1 rounded-full hover:cursor-pointer w-[120px]"
          >
            Apply
          </button>
        </div>

        {/* SUMMARY TABLE */}
        <div className="overflow-auto  p-5 rounded-2xl">
          {loading ? (
            <Skeleton className="h-10 w-full" count={5} />
          ) : (
            <div>

              <div className="bg-white p-3 rounded-2xl">
              <table className="border-collapse border-b border-b-gray-100 w-full bg-white rounded-2xl">
                <thead>
                  <tr>
                    <th className="p-2">KPI</th>
                    {KPIs.map((kpi) => (
                      <th key={kpi} className="p-2">
                        {kpi}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Categories.map((cat) => (
                    <tr key={cat}>
                      <td className="border-b border-gray-100 p-2 font-semibold text-[14px] text-gray-600">
                        {cat}
                      </td>
                      {KPIs.map((kpi) => (
                        <td
                          key={kpi}
                          className="border-b border-gray-100 p-2 text-center text-[14px] text-gray-600"
                        >
                          {tableData[cat][kpi]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <TurnAroundExecSummary
                clientId={watch("clientId")}
                siteId={watch("siteId")}
                jobId={watch("jobId")}
                startDate={watch("from")}
                endDate={watch("to")}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SummaryPage;
