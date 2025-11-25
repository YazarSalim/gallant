"use client";

import Image from "next/image";
import { StaticImageData } from "next/image";
import search from '../public/search.svg'

interface HeaderProps {
  title: string;
  icon?: StaticImageData;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  showDateFilter?: boolean;
  onDateChange?: (value: string) => void;
}

const Header = ({ 
  title, 
  icon, 
  onSearch, 
  onAdd, 
  showDateFilter = false, 
  onDateChange 
}: HeaderProps) => {
  return (
    <div className="flex justify-between px-20 py-10 items-center">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {icon && <Image src={icon} alt="icon" className="w-8 h-8" />}
        <p className="text-xl font-semibold">{title}</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* OPTIONAL DATE PICKER */}
        {showDateFilter && (
          <input
            type="date"
            onChange={(e) => onDateChange?.(e.target.value)}
            className="px-4 py-2 border bg-gray-200 rounded-full outline-0"
          />
        )}

        {/* Search */}
        <div className="px-6 py-2 border-0 bg-gray-200 w-[350px] rounded-full outline-0 flex gap-3">

        <Image src={search} alt="search" className="w-3"/>
        <input
          type="text"
          placeholder={`Search ${title}`}
          onChange={(e) => onSearch?.(e.target.value)}
          className="outline-0"
          
        />
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          className="bg-black text-white text-[14px] px-4 py-2 rounded-full font-semibold"
        >
          Add {title}
        </button>

      </div>
    </div>
  );
};

export default Header;
