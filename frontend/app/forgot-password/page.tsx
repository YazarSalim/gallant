"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

interface ForgotFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm<ForgotFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ForgotFormData> = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded flex justify-center items-center"
        >
          {loading ? <Spinner /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
