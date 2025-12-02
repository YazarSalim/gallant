"use client";

import Header from "@/components/Header";
import Skeleton from "@/components/Skeleton";
import IconButton from "@/components/IconButton";
import TurnAroundExecutionForm from "@/components/TurnAroundExecutionForm";
import Pagination from "@/components/Pagination";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/hooks/useAxios";

import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";

import {
  TurnAroundExecutionEntry,
  TurnAroundExecutionListResponse,
} from "@/types/turnaround";
import ConfirmDeleteModal from "@/components/DeleteModal";

const TurnAroundExecutionPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [editingEntry, setEditingEntry] = useState<TurnAroundExecutionEntry | null>(null);

  const [limit] = useState(6);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTurnAroundExecutionId, setDeleteTurnAroundExecutionId] =
    useState<number | null>(null);

  const [turnAroundEntries, setTurnAroundEntries] = useState<
    TurnAroundExecutionEntry[]
  >([]);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchAllTurnAroundExecutionEntries = async (currentPage = page) => {
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

      // console.log(query.toString());
      

      const res = await api.get<{ result: TurnAroundExecutionListResponse }>(
        `/turnaroudexecution/getAllTurnAroundExecutionEntries?${query.toString()}`
      );
      // console.log(res.data);
      

      setTurnAroundEntries(res.data.result.entries);
      setTotalPages(res.data.result.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTurnAroundExecution = async (id: number) => {
    const response = await api.get<{ data: TurnAroundExecutionEntry }>(
      `/turnaroudexecution/getTurnAroundExecutionById/${id}`
    );
   
    
    setEditingEntry(response.data.data);
    setIsOpen(true);
  };

  const handleDeleteTurnAroundExecution = async () => {
    await api.delete(
      `/turnaroudexecution/deleteTurnAroundExecution/${deleteTurnAroundExecutionId}`
    );
    fetchAllTurnAroundExecutionEntries(1);
    setDeleteModalOpen(false);
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
      `/turnaroudexecution/exportTurnAroundExecution?${query.toString()}`,
      { responseType: "blob" } // important!
    );

    // Create Blob and download
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "TurnAroundExecution.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Revoke the object URL
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
  }
};


  useEffect(() => {
    fetchAllTurnAroundExecutionEntries(1);
  }, [debouncedSearch, filters]);

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6">
        <Header
          title="Turn Around Execution"
          onSearch={setSearchTerm}
          onAdd={() => {
            setEditingEntry(null);
            setIsOpen(true);
          }}
          onFilter={(f) => setFilters(f)}
          onExport={handleExportExcel}  
        />

        {loading ? (
          <Skeleton className="h-10 w-full" count={limit} />
        ) : (
          <div className="overflow-x-auto mt-6 bg-white rounded-xl shadow-md">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-sm font-semibold">Date</th>
                  <th className="p-4 text-sm font-semibold">Client Name</th>
                  <th className="p-4 text-sm font-semibold">Site Name</th>
                  <th className="p-4 text-sm font-semibold">Job Name</th>
                  <th className="p-4 text-sm font-semibold w-32">Actions</th>
                </tr>
              </thead>

              <tbody>
                {turnAroundEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-gray-500 italic">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  turnAroundEntries.map((e, index) => (
                    <tr
                      key={e.id}
                      className={`transition hover:bg-gray-50 ${
                        index % 2 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="p-4 text-sm text-gray-700">
                        {e.entryDate.slice(0, 10)}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {e.client.clientName}
                      </td>
                      <td className="p-4 text-sm text-gray-700">{e.site.siteName}</td>
                      <td className="p-4 text-sm text-gray-700">{e.job.jobName}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <IconButton icon={editIcon} alt="Edit" onClick={() => handleEditTurnAroundExecution(e.id)} />
                          <IconButton
                            icon={deleteIcon}
                            alt="Delete"
                            onClick={() => {
                              setDeleteTurnAroundExecutionId(e.id);
                              setDeleteModalOpen(true);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <TurnAroundExecutionForm
                setIsOpen={setIsOpen}
                editingEntry={editingEntry}
                onSuccess={fetchAllTurnAroundExecutionEntries}
              />
            </div>
          </div>
        )}

        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          onConfirm={handleDeleteTurnAroundExecution}
        />
      </div>

      <div className="bg-white flex justify-end p-3 rounded-3xl">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => fetchAllTurnAroundExecutionEntries(newPage)}
        />
      </div>
    </div>
  );
};

export default TurnAroundExecutionPage;
