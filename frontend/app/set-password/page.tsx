"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/hooks/useAxios";
import toast from "react-hot-toast";

interface FormValues {
  password: string;
  confirmPassword: string;
}

const SetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email"); // email is passed in the link
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    console.log(searchParams.get("email"));

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/set-password", {
        email,
        password: data.password,
      });

      toast.success(response.data.message || "Password set successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Set Your Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          {...register("password", {
            required: "Minimum 6 characters is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters is required",
            },
          })}
          className="border p-2 rounded"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm your password",
          })}
          className="border p-2 rounded"
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default SetPasswordPage;
