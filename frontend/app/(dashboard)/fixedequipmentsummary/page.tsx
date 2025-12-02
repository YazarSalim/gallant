"use client";
import { useEffect, useState } from "react";
import FixedEquipmentSummaryForm from "@/components/FixedEquipmentSummaryForm";
import api from "@/hooks/useAxios";
import Header from "@/components/Header";
import icon from "../../../public/clientIcon.svg";
import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";
import Image from "next/image";
import Skeleton from "@/components/Skeleton";
import Pagination from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";

interface KpiEntry {
  id: number;
  entryDate: string;
  client: { id: number; clientName: string };
  site: { id: number; siteName: string };
  job: { id: number; jobName: string };
}

interface KpiEntryDetail extends KpiEntry {
  kpiValues: {
    kpi: { id: number; name: string };
    category: { id: number; name: string };
    value: number;
  }[];
}

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KpiEntryDetail | null>(null);
  const [kpiEntries, setKpiEntries] = useState<KpiEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const limit = 5;
  const [loading, setLoading] = useState(true);

  // ⭐ Sorting state
  const [sortField, setSortField] = useState("entryDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchKpiEntries = async (currentPage = page) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(currentPage),
        limit: String(limit),
        search: debouncedSearch,
        clientId: filters.clientId || "",
        siteId: filters.siteId || "",
        jobId: filters.jobId || "",
        date: filters.date || "",
        sortField,
        sortOrder,
      });

      const response = await api.get(
        `/admin/kpi/getAllKpiEntries?${query.toString()}`
      );

      setKpiEntries(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error("Error fetching KPI entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpiEntries(1);
  }, [debouncedSearch, filters, sortField, sortOrder]);

  const handleSort = (field: string, order: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await api.patch(`/admin/kpi/delete-kpiEntries/${id}`);
      fetchKpiEntries(page);
    } catch (error) {
      console.error("Error deleting KPI entry:", error);
    }
  };

  const handleEdit = async (entry: KpiEntry) => {
    try {
      const { client, site, job, entryDate } = entry;
      const response = await api.get("/admin/kpi/getKpiValuesById", {
        params: {
          clientId: client.id,
          siteId: site.id,
          jobId: job.id,
          entryDate,
        },
      });

      setEditingEntry({
        ...entry,
        kpiValues: response.data.data,
      });
      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching KPI detail:", err);
    }
  };

  const handleExportExcel = async (filters: any) => {
    try {
      const query = new URLSearchParams({
        clientId: filters.clientId || "",
        siteId: filters.siteId || "",
        jobId: filters.jobId || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
      });

      const res = await api.get(
        `/admin/kpi/exportFixedSummary?${query.toString()}`,
        { responseType: "blob" }
      );
      toast.success("Excel export started")
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "FixedSummary.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel export failed:", err);
      toast.success("Excel export failed")
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="p-4 bg-white rounded-3xl h-[600px]">
        <Header
          title="Data"
          icon={icon}
          onSearch={(value) => setSearchTerm(value)}
          onAdd={() => {
            setEditingEntry(null);
            setIsOpen(true);
          }}
          onFilter={(f) => setFilters(f)}
          onExport={handleExportExcel}
        />

        <div className="overflow-auto rounded">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                {/* DATE SORT */}
                <th className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <span>Date</span>
                    <div className="flex flex-col text-[10px]">
                      <button
                        className={sortField === "entryDate" && sortOrder === "asc" ? "font-bold" : ""}
                        onClick={() => handleSort("entryDate", "asc")}
                      >
                        ▲
                      </button>
                      <button
                        className={sortField === "entryDate" && sortOrder === "desc" ? "font-bold" : ""}
                        onClick={() => handleSort("entryDate", "desc")}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </th>

                {/* CLIENT SORT */}
                <th className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <span>Client</span>
                    <div className="flex flex-col text-[10px]">
                      <button
                        className={sortField === "clientName" && sortOrder === "asc" ? "font-bold" : ""}
                        onClick={() => handleSort("clientName", "asc")}
                      >
                        ▲
                      </button>
                      <button
                        className={sortField === "clientName" && sortOrder === "desc" ? "font-bold" : ""}
                        onClick={() => handleSort("clientName", "desc")}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </th>

                {/* SITE SORT */}
                <th className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <span>Site</span>
                    <div className="flex flex-col text-[10px]">
                      <button
                        className={sortField === "siteName" && sortOrder === "asc" ? "font-bold" : ""}
                        onClick={() => handleSort("siteName", "asc")}
                      >
                        ▲
                      </button>
                      <button
                        className={sortField === "siteName" && sortOrder === "desc" ? "font-bold" : ""}
                        onClick={() => handleSort("siteName", "desc")}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </th>

                {/* JOB SORT */}
                <th className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <span>Job</span>
                    <div className="flex flex-col text-[10px]">
                      <button
                        className={sortField === "jobName" && sortOrder === "asc" ? "font-bold" : ""}
                        onClick={() => handleSort("jobName", "asc")}
                      >
                        ▲
                      </button>
                      <button
                        className={sortField === "jobName" && sortOrder === "desc" ? "font-bold" : ""}
                        onClick={() => handleSort("jobName", "desc")}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </th>

                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : kpiEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4">
                    No entries found
                  </td>
                </tr>
              ) : (
                kpiEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-2">
                      {new Date(entry.entryDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{entry.client.clientName}</td>
                    <td className="p-2">{entry.site.siteName}</td>
                    <td className="p-2">{entry.job.jobName}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="p-3 rounded-full border"
                        onClick={() => handleEdit(entry)}
                      >
                        <Image src={editIcon} alt="Edit" className="w-3 h-3" />
                      </button>
                      <button
                        className="p-3 rounded-full border"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Image src={deleteIcon} alt="Delete" className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl">
              <FixedEquipmentSummaryForm
                setIsOpen={setIsOpen}
                editingEntry={editingEntry}
                onSuccess={fetchKpiEntries}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-3 rounded-3xl flex justify-end">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => fetchKpiEntries(newPage)}
        />
      </div>
    </div>
  );
};

export default Page;
