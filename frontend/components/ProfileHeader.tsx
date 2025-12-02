"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/hooks/useAxios";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Clients",
  "/sites": "Sites",
  "/jobs": "Jobs",
  "/fixedequipmentsummary": "Fixed Equipment Summary",
  "/profile": "Profile",
  "/users":"Users",
  "/activitylog":"Activity Log",
  "/turnaroundexecution":"Turn Around Execution"
};

interface ProfileData {
  username: string;
  email: string;
  profilePhoto:string
}

const ProfileHeader = () => {
  const pathname = usePathname();

  // Get title dynamically based on route
  const title = pageTitles[pathname] || "Page";
  const [profileIcon ,setProfileIcon]=useState<ProfileData| null>(null)
  const [loading,setLoading]=useState(true)
const fetchProfile = async () => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("No user in localStorage");
      return; 
    }

    const user = JSON.parse(userString);
    const email: string = user.email; 
    const res = await api.get("/admin/profile", { params: { email } });
    console.log(res.data.data);
    
    setProfileIcon(res.data.data);
  } catch (err) {
    console.error("Failed to fetch profile", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
    <div className="flex items-center justify-between p-4 ">
      <h1 className="text-xl font-semibold">{title}</h1>

      {loading? "":<div className="flex gap-4 items-center uppercase">
        <p>{profileIcon?.username}</p>
        <Link
        href="/profile"
        className="w-10 h-10 rounded-full overflow-hidden border"
      >
        <Image
          src={profileIcon?profileIcon.profilePhoto:""}
          alt="Profile"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link></div>}
    </div>
  );
};

export default ProfileHeader;
