"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import profileIcon from "../public/profileIcon.svg";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/sites": "Sites",
  "/jobs": "Jobs",
  "/fixedequipmentsummary": "Fixed Equipment Summary",
  "/profile": "Profile",
};

const ProfileHeader = () => {
  const pathname = usePathname();

  // Get title dynamically based on route
  const title = pageTitles[pathname] || "Page";

  return (
    <div className="flex items-center justify-between p-4 ">
      <h1 className="text-xl font-semibold">{title}</h1>

      <Link
        href="/profile"
        className="w-10 h-10 rounded-full overflow-hidden border"
      >
        <Image
          src={profileIcon}
          alt="Profile"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>
    </div>
  );
};

export default ProfileHeader;
