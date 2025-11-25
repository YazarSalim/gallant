"use client";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  disabled?: boolean; // ✅ Add disabled prop
}

export default function Input({
  label,
  error,
  className = "",
  disabled = false, // ✅ default false
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col w-full gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <input
        {...props}
        disabled={disabled} // ✅ Pass disabled
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${className}`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
