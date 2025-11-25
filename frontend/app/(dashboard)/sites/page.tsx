"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import siteIcon from "../../../public/siteIcon.svg";
import api from "@/hooks/useAxios";
import SiteForm from "@/components/SiteForm";
import ConfirmDeleteModal from "@/components/DeleteModal";
import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";
import Table from "@/components/Table";
import IconButton from "@/components/IconButton";
import { Site } from "@/types/types";
import { deleteSite, getSiteById } from "@/services/siteServices/site";
import Pagination from "@/components/Pagination";
import Skeleton from "@/components/Skeleton";

const SitePage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editSite, setEditSite] = useState<Site | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSiteId, setDeleteSiteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchSites = async (currentPage = page, search = searchTerm) => {
    try {
      const response = await api.get("/admin/site/allSites", {
        params: {
          page: currentPage,
          limit: limit,
          search: search || "",
        },
      });
      setSites(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [searchTerm]);

  const handleEditSite = async (siteId: string) => {
    const response = await getSiteById(siteId);
    setEditSite(response.data.data);
    setOpen(true);
  };

  const handleDeleteSite = async () => {
    if (!deleteSiteId) return;
    try {
      await deleteSite(deleteSiteId);
      fetchSites();
    } catch (error) {
      console.error("Failed to delete site:", error);
    }
  };

  const columns = [
    { key: "siteName", label: "Site Name" },
    { key: "siteCode", label: "Site Code" },
    { key: "clientName", label: "Client Name" },
  ];

  return (
    <div className="p-4 bg-white rounded-3xl">
      <Header
        title="Site"
        icon={siteIcon}
        onSearch={(value) => setSearchTerm(value)}
        onAdd={() => {
          setEditSite(null);
          setOpen(true);
        }}
      />

      <div className="mt-10">
        {loading ? (
          <Skeleton className="h-10 w-full" count={limit} /> 
        ) : (
          // <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          //   <thead className="bg-gray-100">
          //     <tr>
          //       {columns.map((col) => (
          //         <th
          //           key={col.key}
          //           className="px-4 py-2 text-left text-gray-700 font-medium uppercase"
          //         >
          //           {col.label}
          //         </th>
          //       ))}
          //     </tr>
          //   </thead>

          //   <tbody className="divide-y divide-gray-200">
          //     {sites.map((site) => (
          //       <tr
          //         key={site.id}
          //         className="hover:bg-gray-50 transition-colors duration-150"
          //       >
          //         <td className="px-4 py-2">{site.siteName}</td>
          //         <td className="px-4 py-2">{site.siteCode}</td>
          //         <td className="px-4 py-2">{site.clientName}</td>
          //         <td className="px-4 py-2 flex gap-2">
          //           <button
          //             onClick={() => handleEditSite(site.id)}
          //             className="p-3 rounded-full border border-gray-300"
          //           >
          //             <Image src={editIcon} alt="Edit" className="w-3 h-3" />
          //           </button>

          //           <button
          //             onClick={() => {
          //               setDeleteSiteId(site.id);
          //               setDeleteModalOpen(true);
          //             }}
          //             className="p-3 rounded-full border border-gray-300"
          //           >
          //             <Image
          //               src={deleteIcon}
          //               alt="Delete"
          //               className="w-3 h-3"
          //             />
          //           </button>
          //         </td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>

          <Table
            columns={columns}
            data={sites}
            actions={(site) => (
              <div className="flex gap-2">
                <IconButton
                  icon={editIcon}
                  alt="Edit"
                  onClick={() => handleEditSite(site.id)}
                />

                <IconButton
                  icon={deleteIcon}
                  alt="Delete"
                  onClick={() => {
                    setDeleteSiteId(site.id);
                    setDeleteModalOpen(true);
                  }}
                />
                {/* <button
                  onClick={() => handleEditSite(site.id)}
                  className="p-3 rounded-full border border-gray-300"
                >
                  <Image src={editIcon} alt="Edit" className="w-3 h-3" />
                </button>

                <button
                  onClick={() => {
                    setDeleteSiteId(site.id);
                    setDeleteModalOpen(true);
                  }}
                  className="p-3 rounded-full border border-gray-300"
                >
                  <Image src={deleteIcon} alt="Delete" className="w-3 h-3" />
                </button> */}
              </div>
            )}
          />
        )}
      </div>

      {sites.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => fetchSites(newPage)}
        />
      )}

      {open && (
        <div
          className="fixed inset-0  flex justify-center items-center z-50 bg-black/20"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <SiteForm
              initialData={
                editSite
                  ? {
                      id: editSite.id,
                      siteName: editSite.siteName,
                      siteCode: editSite.siteCode,
                      clientId: editSite.clientId,
                    }
                  : undefined
              }
              onSuccess={() => {
                setOpen(false);
                fetchSites();
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onConfirm={handleDeleteSite}
      />
    </div>
  );
};

export default SitePage;
