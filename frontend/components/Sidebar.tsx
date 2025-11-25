"use client";

import { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import gallant from "../public/gallant.svg"
import logo from "../public/logo.svg"
import logout from "../public/logout.svg"
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: StaticImageData;
}

interface SidebarProps {
  items: NavItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
const router =useRouter();

  const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div
      className={`h-200 bg-[#0F172A] text-white flex flex-col transition-all duration-300 shadow-xl ${
        expanded ? "w-64 rounded" : "w-20 rounded"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-white/20">
        {/* <div className="w-10 h-10 bgrounded-lg" /> */}
        {expanded ? <Image src={gallant} alt={gallant}  />:<Image src={logo} alt={logo}  />}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-5 py-3 hover:bg-white/10 rounded-lg transition-all"
          >
            {expanded ? (
              <span className="text-sm font-medium">{item.label}</span>
            ) : (
              <Image src={item.icon} alt={item.label} className="w-6 h-6" />
            )}
          </Link>
        ))}
      </nav>

      <div className="flex justify-center p-3">
        {expanded? <button onClick={handleLogout}>Logout</button> :<button onClick={handleLogout}>
          <Image src={logout} alt={logout}/>
        </button>}
      </div>
    </div>
  );
}
