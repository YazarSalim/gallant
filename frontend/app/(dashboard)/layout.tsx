"use client";

import ProfileHeader from "@/components/ProfileHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { navItems } from "@/utils/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="p-3 fixed z-100">
        <Sidebar items={navItems} />
      </div>

      <div className="flex flex-col w-full gap-10 pt-10 pr-5 ml-30">
        <ProfileHeader />
        <div className="flex-1 p-6 bg-[#ededeb] min-h-screen ">
          <ProtectedRoute>{children}</ProtectedRoute>
        </div>
      </div>
    </div>
  );
}
