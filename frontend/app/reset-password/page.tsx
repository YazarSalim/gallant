"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/reset-password", { token, ...data });
      toast.success("Password updated!");
      router.push("/login");
    } catch (err) {
      toast.error("Invalid or expired token");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold">Reset Password</h2>

        <input
          {...register("password")}
          className="border px-3 py-2 rounded w-full"
          placeholder="New Password"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}
