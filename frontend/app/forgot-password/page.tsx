"use client";
import { useForm } from "react-hook-form";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/forgot-password", data);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
