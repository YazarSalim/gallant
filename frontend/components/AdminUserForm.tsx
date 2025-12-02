"use client";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { createUser, updateUser } from "@/services/userServices/user";
import toast from "react-hot-toast";
import { useEffect } from "react";

export interface UserFormValues {
  id: string;
  username: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  onClose: () => void;
  onUpdate: () => void;
  initialData?: UserFormValues;
}
const AdminUserForm = ({ onClose, onUpdate, initialData }: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (initialData) {
        const response = await updateUser(initialData.id, data);
        console.log(response.data);
        toast.success(response.data.message);
        onClose();
        onUpdate();
        return;
      }
      const response = await createUser(data);
      toast.success(response.data.message);
      onUpdate();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg bg-white shadow-md rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-semibold">
        {initialData ? "Edit User" : "Create User"}
      </h2>
      {/* Username */}
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="User Name"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>
      {/* Email */}
      <div className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="User Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>
      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Phone Number"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit phone number",
            },
          })}
        />
        {errors.phone && (
          <p className="text-red-600 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button
          type="button"
          onClick={onClose}
          variant="custom"
          className="bg-black text-white hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default AdminUserForm;
