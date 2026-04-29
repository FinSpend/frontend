"use client";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Hapus",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex flex-col items-center px-6 pt-6 pb-2 text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDestructive ? "bg-red-100 dark:bg-red-900/20" : "bg-amber-100 dark:bg-amber-900/20"}`}>
            {isDestructive
              ? <Trash2 className="w-6 h-6 text-red-600" />
              : <AlertTriangle className="w-6 h-6 text-amber-600" />
            }
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex gap-3 p-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ${
              isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
