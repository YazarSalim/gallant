"use client";

import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex justify-center items-center z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete?
        </h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
