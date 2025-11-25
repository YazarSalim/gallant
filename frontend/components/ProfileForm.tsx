"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";
import Input from "./Input";

interface ProfileFormValues {
  username: string;
  email: string;
  password?: string;
}

interface ProfileFormProps {
  initialData: ProfileFormValues;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProfileForm = ({ initialData, onClose, onUpdate }: ProfileFormProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

const onSubmit = async (data: ProfileFormValues) => {
  try {
    // Remove password field if empty
    const filteredData = { ...data };
    if (!filteredData.password) {
      delete filteredData.password;
    }

    await api.put("/admin/profile/updateProfile", filteredData);
    toast.success("Profile updated successfully!");
    onUpdate?.();
    onClose();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile");
  }
};

  return (
    <div className="fixed inset-0 bg-black/50  flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Username</label>
            <Input
              {...register("username", { required: "Username is required" })}
              // className="w-full px-3 py-2 border rounded"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
              // className="w-full px-3 py-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Password (optional)</label>
            <Input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-black text-white rounded-full hover:cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
