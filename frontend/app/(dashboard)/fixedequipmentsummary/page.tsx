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

interface KpiEntry {
  id: number;
  entryDate: string;
  client: { id: number; clientName: string };
  site: { id: number; siteName: string };
  job: { id: number; jobName: string };
}

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KpiEntry | null>(null);
  const [kpiEntries, setKpiEntries] = useState<KpiEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  const limit = 10;

  const fetchKpiEntries = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/admin/kpi/getAllKpiEntries?page=${page}&limit=${limit}&search=${
          searchTerm || ""
        }&date=${selectedDate || ""}`
      );

      setKpiEntries(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching KPI entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpiEntries(page);
  }, [page, searchTerm, selectedDate]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await api.patch(`/admin/kpi/delete-kpiEntries/${id}`);
      console.log(res.data);

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

  return (
    <div className="p-4 bg-white rounded-3xl">
      <Header
        title="Data"
        icon={icon}
        onSearch={(value) => setSearchTerm(value)}
        onAdd={() => {
          setEditingEntry(null);
          setIsOpen(true);
        }}
        showDateFilter={true}
        onDateChange={(date) => setSelectedDate(date)} // ⭐ Capture selected date
      />

      <div className="overflow-auto rounded">
        {loading ? (
          <Skeleton className="h-10 w-full" count={limit} />
        ) : (
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
              {kpiEntries.length === 0 ? (
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
        )}
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 disabled:opacity-50"
        >
          {"<"}
        </button>
        <span className="px-3 py-1 bg-black text-white rounded-full">
          {page}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 disabled:opacity-50"
        >
          {">"}
        </button>
      </div> */}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => fetchKpiEntries(newPage)}
      />

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <FixedEquipmentSummaryForm
              setIsOpen={setIsOpen}
              editingEntry={editingEntry}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
