// components/Skeleton.tsx
"use client";

interface SkeletonProps {
  className?: string;
  count?: number; // how many skeleton rows to show
}

const Skeleton = ({ className = "", count = 1 }: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 rounded-md ${className} mb-2`}
        ></div>
      ))}
    </>
  );
};

export default Skeleton;
