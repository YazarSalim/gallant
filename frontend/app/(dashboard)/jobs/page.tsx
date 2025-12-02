"use client";
import Header from "@/components/Header";
import jobIcon from "../../../public/JobIconDark.svg";
import { useEffect, useState } from "react";
import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";
import JobForm from "@/components/JobForm";
import ConfirmDeleteModal from "@/components/DeleteModal";
import Table from "@/components/Table";
import IconButton from "@/components/IconButton";
import { deleteJob, getAlljobs } from "@/services/jobServices/jobs";
import Pagination from "@/components/Pagination";
import Skeleton from "@/components/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";

interface Job {
  id: string;
  siteName: string;
  jobCode: string;
  jobName: string;
  clientName: string;
  clientId: string;
  siteId: string;
}

const Jobpage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<Job | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchAllJobs = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const response = await getAlljobs(currentPage, limit, search);
      setTotalPages(response.data.pagination.totalPages);
      setPage(currentPage);
      setJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllJobs(1, debouncedSearch);
  }, [debouncedSearch]);

  const handleEditJob = (job: Job) => {
    setEditData(job);
    setOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setSelectedJobId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!selectedJobId) return;
    await deleteJob(selectedJobId);
    fetchAllJobs();
    setSelectedJobId(null);
  };

  const columns = [
    { key: "jobName", label: "Job Name" },
    { key: "jobCode", label: "Job Code" },
    { key: "clientName", label: "Client Name" },
    { key: "siteName", label: "Site Name" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="p-3 bg-white rounded-3xl h-[600px]">
        <Header
          title="Job"
          icon={jobIcon}
          onSearch={(value) => setSearchTerm(value)}
          onAdd={() => {
            setEditData(null);
            setOpen(true);
          }}
        />
        <div>
          {loading ? (
            <Skeleton className="h-10 w-full" count={limit} />
          ) : (
            <Table
              columns={columns}
              data={jobs}
              actions={(job) => (
                <div className="flex gap-2">
                  <IconButton
                    icon={editIcon}
                    alt="Edit"
                    onClick={() => handleEditJob(job)}
                  />

                  <IconButton
                    icon={deleteIcon}
                    alt="Delete"
                    onClick={() => openDeleteModal(job.id)}
                  />
                </div>
              )}
            />
          )}
        </div>

        {open && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50  bg-black/20"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <JobForm
                initialData={
                  editData
                    ? {
                        id: editData.id,
                        jobName: editData.jobName,
                        jobCode: editData.jobCode,
                        clientId: editData.clientId,
                        siteId: editData.siteId,
                      }
                    : undefined
                }
                onSuccess={() => {
                  setOpen(false);
                  fetchAllJobs();
                }}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        )}

        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onConfirm={handleDeleteJob}
        />
      </div>

      <div className="flex bg-white p-3 rounded-3xl justify-end">
        {jobs.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => fetchAllJobs(newPage)}
          />
        )}
      </div>
    </div>
  );
};

export default Jobpage;
