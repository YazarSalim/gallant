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
    fetchClients();
  }, []);

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
    <div className="p-4 bg-white rounded-3xl">
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
          <Skeleton className="h-10 w-full" count={limit}/>
        ) : (
          <>
            {/* <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left text-gray-700 font-medium uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clients.map((client, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-2">{client.clientName}</td>
                      <td className="px-4 py-2">{client.clientCode}</td>
                      <td className="px-4 py-2">{client.contact}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="p-3 rounded-full border border-gray-300 hover:cursor-pointer"
                          onClick={() => handleEditClient(client.id)}
                        >
                          <Image
                            src={editIcon}
                            alt="Edit Icon"
                            className="w-3 h-3"
                          />
                        </button>
                        <button
                          className="p-3 rounded-full border border-gray-300 hover:cursor-pointer"
                          onClick={() => {
                            setDeleteClientId(client.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Image
                            src={deleteIcon}
                            alt="Delete Icon"
                            className="w-3 h-3"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table> */}

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

                  {/* <button
                    className="p-3 rounded-full border border-gray-300 hover:cursor-pointer"
                    onClick={() => handleEditClient(client.id)}
                  >
                    <Image src={editIcon} alt="Edit" className="w-3 h-3" />
                  </button>
                  <button
                    className="p-3 rounded-full border border-gray-300 hover:cursor-pointer"
                    onClick={() => {
                      setDeleteClientId(client.id);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Image src={deleteIcon} alt="Delete" className="w-3 h-3" />
                  </button> */}
                </div>
              )}
            />

            {/* Pagination */}
            {/* <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchClients(p)}
                  className={`px-3 py-1  rounded-full ${
                    page === p ? "bg-black text-white" : ""
                  }`}
                >
                  {p}
                </button>
              ))}
            </div> */}

            {clients.length>0 ? <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => fetchClients(newPage)}
            />:""}

            
          </>
        )}
      </div>

      {/* Client Form Modal */}
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


      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
};

export default ClientPage;
