"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Lock, Tag } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/services/userService";

interface Category {
  id: string;
  name: string;
  type: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId?: string | null;
}

const PRESET_COLORS = [
  "#1D9E75", "#378ADD", "#639922", "#7F77DD", "#D85A30",
  "#BA7517", "#888780", "#D4537E", "#E67E22", "#9B59B6",
  "#3498DB", "#2ECC71", "#E74C3C", "#F39C12", "#1ABC9C",
];

const PRESET_ICONS = [
  "💼", "💻", "📈", "🍜", "🚌", "🎮", "🛍", "📄", "🏥", "📚",
  "🏠", "✈️", "🎵", "💪", "🍕", "☕", "📱", "🎁", "💡", "🏋️",
];

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"income" | "expense">("expense");
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [formIcon, setFormIcon] = useState("🏷️");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data?.data ?? []);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = categories.filter((c) => c.type === activeTab);
  const defaultCats = filtered.filter((c) => c.isDefault);
  const customCats = filtered.filter((c) => !c.isDefault);

  const openCreate = () => {
    setEditTarget(null);
    setFormName("");
    setFormType(activeTab);
    setFormColor(PRESET_COLORS[0]);
    setFormIcon("🏷️");
    setError("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setFormName(cat.name);
    setFormType(cat.type as "income" | "expense");
    setFormColor(cat.color ?? PRESET_COLORS[0]);
    setFormIcon(cat.icon ?? "🏷️");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!formName.trim()) { setError("Nama kategori wajib diisi"); return; }
    if (formName.trim().length < 2) { setError("Nama minimal 2 karakter"); return; }
    setSubmitting(true);
    setError("");
    try {
      if (editTarget) {
        await updateCategory(editTarget.id, {
          name: formName.trim(),
          color: formColor,
          icon: formIcon,
        });
      } else {
        await createCategory({
          name: formName.trim(),
          type: formType,
          color: formColor,
          icon: formIcon,
        });
      }
      await load();
      closeModal();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      await load();
      setDeleteTarget(null);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg ?? "Gagal menghapus kategori");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kategori</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola kategori pemasukan dan pengeluaran kamu
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t === "expense" ? "Pengeluaran" : "Pemasukan"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Default categories */}
          {defaultCats.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Kategori Bawaan
                </span>
              </div>
              <div className="space-y-2">
                {defaultCats.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: cat.color ? `${cat.color}20` : "#f3f4f6" }}
                    >
                      {cat.icon ?? "🏷️"}
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cat.name}
                    </span>
                    <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom categories */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Kategori Kustom
              </span>
            </div>
            {customCats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Tag className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Belum ada kategori kustom
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">
                  Buat kategori sesuai kebutuhanmu
                </p>
                <button
                  onClick={openCreate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {customCats.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: cat.color ? `${cat.color}20` : "#f3f4f6" }}
                    >
                      {cat.icon ?? "🏷️"}
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Edit kategori"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Hapus kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {editTarget ? "Edit Kategori" : "Kategori Baru"}
              </h3>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="contoh: Langganan Netflix"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type — only for create */}
              {!editTarget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipe
                  </label>
                  <div className="flex gap-2">
                    {(["expense", "income"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormType(t)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                          formType === t
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {t === "expense" ? "Pengeluaran" : "Pemasukan"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Warna
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFormColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        formColor === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ikon (emoji)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormIcon(icon)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        formIcon === icon
                          ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  placeholder="atau ketik emoji kustom"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={4}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {submitting ? "Menyimpan..." : editTarget ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-center text-gray-900 dark:text-white mb-2">
              Hapus Kategori?
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Kategori <span className="font-medium text-gray-700 dark:text-gray-300">&quot;{deleteTarget.name}&quot;</span> akan dihapus.
              Transaksi yang menggunakan kategori ini tetap ada.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
