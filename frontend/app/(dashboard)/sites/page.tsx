"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import siteIcon from "../../../public/siteIcon.svg";
import SiteForm from "@/components/SiteForm";
import ConfirmDeleteModal from "@/components/DeleteModal";
import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";
import Table from "@/components/Table";
import IconButton from "@/components/IconButton";
import { Site } from "@/types/types";
import {
  deleteSite,
  getAllSites,
  getSiteById,
} from "@/services/siteServices/site";
import Pagination from "@/components/Pagination";
import Skeleton from "@/components/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";

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
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchSites = async (currentPage = page, search = searchTerm) => {
    try {
      const response = await getAllSites(currentPage, limit, search);
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
    fetchSites(1, debouncedSearch);
  }, [debouncedSearch]);

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
    <div className="flex flex-col gap-3">
      <div className="p-4 bg-white rounded-3xl h-[600px]">
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
                </div>
              )}
            />
          )}
        </div>

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

      <div className="flex bg-white p-3 rounded-3xl justify-end">
        {sites.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => fetchSites(newPage)}
          />
        )}
      </div>
    </div>
  );
};

export default SitePage;
