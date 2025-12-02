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
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const limit = 5;

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
  }, [debouncedSearch, filters]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
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
      const entryWithValues = {
        ...entry,
        kpiValues: response.data.data,
      };
      setEditingEntry(entryWithValues);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching KPI entry details:", error);
    }
  };

const handleExportExcel = async (filters: any) => {
  console.log("Export filters:", filters);

  try {
    const query = new URLSearchParams({
      clientId: filters.clientId || "",
      siteId: filters.siteId || "",
      jobId: filters.jobId || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
    });

    // Call backend export API
    const res = await api.get(
      `/admin/kpi/exportFixedSummary?${query.toString()}`,
      { responseType: "blob" } 
    );

    // Create Blob and download
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FixedSummary.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Revoke the object URL
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
  }
};


  return (
    <div className="flex flex-col gap-3 justify-evenly">
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
                <th className="p-2">Date</th>
                <th className="p-2">Client</th>
                <th className="p-2">Site</th>
                <th className="p-2">Job</th>
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
                  <td colSpan={5} className="text-center p-4">
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
                        className="p-3 rounded-full border border-gray-300"
                        onClick={() => handleEdit(entry)}
                      >
                        <Image src={editIcon} alt="Edit" className="w-3 h-3" />
                      </button>

                      <button
                        className="p-3 rounded-full border border-gray-300"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Image
                          src={deleteIcon}
                          alt="Delete"
                          className="w-3 h-3"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl relative">
              <FixedEquipmentSummaryForm
                setIsOpen={setIsOpen}
                editingEntry={editingEntry}
                onSuccess={fetchKpiEntries}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white flex justify-end p-3 rounded-3xl">
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
