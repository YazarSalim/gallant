"use client";

import Table from "@/components/Table";
import UserForm from "@/components/AdminUserForm";
import { useEffect, useState } from "react";
import { deleteUser, getAllUsers, getUserById } from "@/services/userServices/user";
import IconButton from "@/components/IconButton";
import editIcon from "../../../public/editButton.svg";
import deleteIcon from "../../../public/delete.svg";
import Header from "@/components/Header";
import { useDebounce } from "@/hooks/useDebounce";
import userIcon from "../../../public/users.svg";
import Pagination from "@/components/Pagination";
import Skeleton from "@/components/Skeleton";
import { User } from "@/types/types";
import ConfirmDeleteModal from "@/components/DeleteModal";
import toast from "react-hot-toast";

const AdminUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User|null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const columns = [
    { key: "username", label: "User Name" },
    { key: "email", label: "User Email" },
    { key: "phone", label: "Phone Number" },
  ];

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchUsers = async (currentPage = page, search = searchTerm) => {
    try {
      const response = await getAllUsers(currentPage, limit, search);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setPage(currentPage);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (id: string) => {
    const response = await getUserById(id);
    console.log(response.data.data);
    
    setEditUser(response.data.data);
    setIsOpen(true)
  };

  const handleDeleteUser=async()=>{
    const resposne = await deleteUser(deleteUserId);
    console.log(resposne.data);
    toast.success(resposne.data.message)
    await fetchUsers()
    
  }

  useEffect(() => {
    fetchUsers(1, debouncedSearch);
  }, [debouncedSearch]);
  return (
    <div className="flex flex-col gap-3">
      <div className="p-4 bg-white rounded-3xl h-[600px]">
        <Header
          title="User"
          icon={userIcon}
          onSearch={(value) => {
            setSearchTerm(value);
            fetchUsers(1, value);
          }}
          onAdd={() => {
            setEditUser(null);
            setIsOpen(true);
          }}
        />
        {loading ? (
          <Skeleton className="h-10 w-full" count={limit} />
        ) : (
          <Table
            columns={columns}
            data={users}
            actions={(user) => (
              <div className="flex gap-2">
                <IconButton
                  icon={editIcon}
                  alt="Edit"
                  onClick={() => handleEditUser(user.id)}
                />

                <IconButton
                  icon={deleteIcon}
                  alt="Delete"
                  onClick={() => {
                    setDeleteUserId(user.id);
                    setDeleteModalOpen(true);
                  }}
                />
              </div>
            )}
          />
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
              <UserForm
                onClose={() => setIsOpen(false)}
                onUpdate={fetchUsers}
                initialData={
                  editUser
                    ? {
                        id: editUser.id,
                        username: editUser.username,
                        email: editUser.email,
                        phone: editUser.phone,
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
          onConfirm={handleDeleteUser}
        />
      </div>

      <div className="flex bg-white p-3 rounded-3xl justify-end">
        {users.length > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => fetchUsers(newPage)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
