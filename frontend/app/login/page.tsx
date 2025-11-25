"use client";

import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import landingIllustration from "../../public/Bg.png";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);
  return (
    <div className="h-screen flex overflow-hidden">
  <div className="flex-1 flex items-center justify-center bg-white">
    <div className="w-full max-w-md p-8">
      <LoginForm />
    </div>
  </div>

  <div className="flex-1 hidden md:flex relative overflow-hidden rounded-l-4xl">
    <Image
      src={landingIllustration}
      alt="Login Illustration"
      fill
      className="object-cover"
      priority
    />
  </div>
</div>

  );
}
