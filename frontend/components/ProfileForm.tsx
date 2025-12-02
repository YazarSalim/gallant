"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";
import Input from "./Input";
import Image from "next/image";

interface ProfileFormValues {
  username: string;
  email: string;
  password?: string;
  profilePhoto?: string; // existing saved URL
}

interface ProfileFormProps {
  initialData: ProfileFormValues;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProfileForm = ({ initialData, onClose, onUpdate }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: initialData,
  });

  // For preview + selected file
  const [preview, setPreview] = useState<string | null>(
    initialData.profilePhoto || null
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    reset(initialData);
    setPreview(initialData.profilePhoto || null);
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();

      formData.append("username", data.username);
      formData.append("email", data.email);

      if (data.password) {
        formData.append("password", data.password);
      }

      if (file) {
        formData.append("profilePhoto", file);
      }

      await api.put("/admin/profile/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ---------- USERNAME ---------- */}
          <div>
            <label className="block mb-1">Username</label>
            <Input
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* ---------- EMAIL ---------- */}
          <div>
            <label className="block mb-1">Email</label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* ---------- PASSWORD ---------- */}
          <div>
            <label className="block mb-1">Password (optional)</label>
            <Input type="password" {...register("password")} />
          </div>

          {/* ---------- PROFILE PHOTO UPLOAD ---------- */}
          <div>
            <label className="block mb-1">Profile Photo</label>

            {/* Preview */}
            {preview && (
              <Image
                src={preview}
                width={50}
                height={50}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
            )}

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (!selected) return;

                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }}
              className="w-full"
            />
          </div>

          {/* ---------- BUTTONS ---------- */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-full"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-black text-white rounded-full disabled:opacity-50"
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
