"use client";

import Image from "next/image";
import { StaticImageData } from "next/image";
import search from "../public/search.svg";
import { useState } from "react";
import FilterForm from "./FilterForm";

interface HeaderProps {
  title: string;
  icon?: StaticImageData;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  onFilter?: (filters: any) => void;
  onExport?: (filters: any) => void; 
}

const Header = ({
  title,
  icon,
  onSearch,
  onAdd,
  onFilter,
  onExport, 
}: HeaderProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false); 

  return (
    <div className="relative">
      <div className="flex justify-between px-20 py-10 items-center">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          {icon && <Image src={icon} alt="icon" className="w-8 h-8" />}
          <p className="text-xl font-semibold">{title}</p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">
          {/* FILTER BUTTON */}
          {onFilter && (
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="px-4 py-2 bg-gray-200 rounded-full text-sm font-semibold"
            >
              Filter
            </button>
          )}

          {/* EXCEL EXPORT BUTTON */}
          {onExport && (
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-semibold"
            >
              Export Excel
            </button>
          )}

          {/* SEARCH INPUT */}
          <div className="px-6 py-2 bg-gray-200 w-[350px] rounded-full flex gap-3">
            <Image src={search} alt="search" className="w-3" />
            <input
              type="text"
              placeholder={`Search ${title}`}
              onChange={(e) => onSearch?.(e.target.value)}
              className="outline-0 bg-gray-200"
            />
          </div>

          {/* ADD BUTTON */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-black text-white text-[14px] px-4 py-2 rounded-full font-semibold"
            >
              Add {title === "Turn Around Execution" ? "Data" : title}
            </button>
          )}
        </div>
      </div>

      {/* FILTER DROPDOWN */}
      {showFilter && (
        <div className="absolute right-20 top-[85px] bg-white shadow-xl p-5 rounded-lg z-50 border">
          <FilterForm
            onFilter={(filters) => {
              onFilter?.(filters);
              setShowFilter(false);
            }}
            mode="single"
          />

          <button
              onClick={() => setShowFilter(false)}
              className="mt-3 w-full border py-2 rounded-full"
            >
              Close
            </button>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[450px] p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Export Excel – Select Filters
            </h2>

            <FilterForm
              mode="range" 
              onFilter={(filters) => {
                onExport?.(filters);
                setShowExportModal(false);
              }}
            />

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowExportModal(false)}
              className="mt-3 w-full border py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
