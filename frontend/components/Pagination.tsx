"use client";

interface PaginationProps {
  page: number;              // current page
  totalPages: number;        // total number of pages
  onPageChange: (page: number) => void;  // callback
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex items-center gap-3 justify-center mt-4">

      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-4 py-2 rounded-full border border-gray-300 disabled:opacity-40"
      >
        {"<"}
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2 flex-wrap max-w-3xl justify-end">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-full ${
              p === page ? "bg-black text-white" : "border border-gray-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-full border border-gray-300 disabled:opacity-40"
      >
        {">"}
      </button>
    </div>
  );
}
