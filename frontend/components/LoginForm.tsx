"use client";
import { login } from "@/services/LoginServices/login";
import { LoginFormData, loginSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      reset();
      router.push("/dashboard");
      toast.success("Login Successfull");
    } catch (err: unknown) {
    let message = "Something went wrong";
    if (err instanceof AxiosError && err.response) {
      message = err.response.data?.message || message;
    }

    toast.error(message);
  }
  };
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 bg-white  rounded-2xl  w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h1>

        {/* Email Field */}
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:cursor-pointer hover:bg-gray-900  transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="flex justify-end w-full ">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-blue-600 text-sm hover:underline hover:cursor-pointer"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
