"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import clientIllustration from "../../../public/clientsIcon.svg";
import ClientForm from "@/components/ClientForm";
import ConfirmDeleteModal from "@/components/DeleteModal";
import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";
import Table from "@/components/Table";
import {
  getAllClients,
  deleteClient,
  getClientById,
} from "@/services/clientServices.ts/client";
import { Client } from "@/types/types";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Skeleton from "@/components/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";

const ClientPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchClients = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const response = await getAllClients(currentPage, limit, search);
      setClients(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.log("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(1, debouncedSearch);
  }, [debouncedSearch]);

  const handleEditClient = async (clientId: string) => {
    try {
      const response = await getClientById(clientId);
      setEditClient(response.data.data);
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to fetch client:", err);
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteClientId) return;
    try {
      await deleteClient(deleteClientId);
      fetchClients(1);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const columns = [
    { key: "clientName", label: "Client Name" },
    { key: "clientCode", label: "Client Code" },
    { key: "contact", label: "Contact Info" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="p-4 bg-white rounded-3xl h-[600px]">
        <Header
          title="Client"
          icon={clientIllustration}
          onSearch={(value) => {
            setSearchTerm(value);
            fetchClients(1, value);
          }}
          onAdd={() => {
            setEditClient(null);
            setIsOpen(true);
          }}
        />

        <div className="mt-10 ">
          {loading ? (
            <Skeleton className="h-10 w-full" count={limit} />
          ) : (
            <>
              <Table
                columns={columns}
                data={clients}
                actions={(client) => (
                  <div className="flex gap-2">
                    <IconButton
                      icon={editIcon}
                      alt="Edit"
                      onClick={() => handleEditClient(client.id)}
                    />

                    <IconButton
                      icon={deleteIcon}
                      alt="Delete"
                      onClick={() => {
                        setDeleteClientId(client.id);
                        setDeleteModalOpen(true);
                      }}
                    />
                  </div>
                )}
              />
            </>
          )}
        </div>

        {isOpen && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <ClientForm
                onClose={() => setIsOpen(false)}
                onUpdate={fetchClients}
                initialData={
                  editClient
                    ? {
                        id: editClient.id,
                        clientName: editClient.clientName,
                        clientCode: editClient.clientCode,
                        contact: editClient.contact,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        )}

        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          onConfirm={handleDeleteClient}
        />
      </div>

      <div className="flex bg-white p-3 rounded-3xl justify-end">
        {clients.length > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => fetchClients(newPage)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ClientPage;
