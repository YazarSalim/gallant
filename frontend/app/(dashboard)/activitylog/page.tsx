"use client";

import Header from "@/components/Header";
import Table from "@/components/Table";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllActivityLogs } from "@/services/activityLogsServices/logs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import log from "../../../public/log.svg";
import Pagination from "@/components/Pagination";
import Skeleton from "@/components/Skeleton";

const ActivityLogPage = () => {
  const [logs, setLogs] = useState();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const fetchAllActivityLogs = async (
    currentPage = page,
    search = searchTerm
  ) => {
    try {
      const response = await getAllActivityLogs(currentPage, limit, search);
      setLogs(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(currentPage);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllActivityLogs(1, debouncedSearch);
  }, [debouncedSearch]);

  const columns = [
    { key: "username", label: "User Name" },
    { key: "action", label: "Activity" },
    { key: "createdAt", label: "Activity Time" },
    { key: "details", label: "Activity Details" },
  ];

  const formattedLogs = logs?.map((log) => ({
    ...log,
    username: log.user?.username,
  }));
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-2xl p-3">
        <Header
          title="Activity Log"
          icon={log}
          onSearch={(value) => {
            setSearchTerm(value);
            fetchAllActivityLogs(1, value);
          }}
        />

       {loading?<Skeleton  className="w-full h-10" count={limit}/>: <Table columns={columns} data={formattedLogs || []} />}

       
      </div>

      <div className="bg-white rounded-2xl p-3 flex justify-end">
         {logs?.length && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newpages) => fetchAllActivityLogs(newpages)}
          />
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;
