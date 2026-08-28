import { useEffect, useMemo, useRef, useState } from "react";
import { useAdmin } from "./AdminContext";

const PAGE_SIZE = 5;
const API_ORIGIN = "http://localhost:5000";
const API_BASE = `${API_ORIGIN}/api/gallery`;

function resolveImage(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
}

const emptyForm = { id: null, caption: "" };

export default function GalleryAdmin() {
  const { logActivity } = useAdmin();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const activeBlobUrl = useRef(null);

  const cleanupBlobUrl = () => {
    if (activeBlobUrl.current) {
      URL.revokeObjectURL(activeBlobUrl.current);
      activeBlobUrl.current = null;
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchItems();
    return () => cleanupBlobUrl();
  }, []);

  async function fetchItems() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE, {
        headers: { ...getAuthHeaders() },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load gallery items");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const isEditing = form.id !== null;

  function resetForm() {
    cleanupBlobUrl();
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    cleanupBlobUrl();

    const previewUrl = URL.createObjectURL(file);
    activeBlobUrl.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
  }

  function handleEdit(item) {
    cleanupBlobUrl();
    setForm({ id: item._id ?? item.id, caption: item.caption });
    setImageFile(null);
    setImagePreview(resolveImage(item.image));
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this image? This can't be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete item");

      setItems((prev) => {
        const updated = prev.filter((item) => (item._id ?? item.id) !== id);
        const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
        if (page > newTotalPages) setPage(newTotalPages);
        return updated;
      });

      // Log activity to Recent Updates
      logActivity("Gallery", "1 image deleted", "bg-rose-50 text-rose-700");
      window.dispatchEvent(new Event("admin_data_changed"));

      if (form.id === id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.caption.trim()) return;
    if (!isEditing && !imageFile) return;

    setSubmitting(true);
    setError("");
    try {
      const body = new FormData();
      body.append("caption", form.caption);
      if (imageFile) body.append("image", imageFile);

      const url = isEditing ? `${API_BASE}/${form.id}` : API_BASE;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { ...getAuthHeaders() },
        credentials: "include",
        body,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save item");
      }
      const saved = json.data;

      if (isEditing) {
        setItems((prev) => prev.map((item) => ((item._id ?? item.id) === form.id ? saved : item)));
        logActivity("Gallery", "Image updated", "bg-purple-50 text-purple-700");
      } else {
        setItems((prev) => [saved, ...prev]);
        setPage(1);
        logActivity("Gallery", "1 image added", "bg-purple-50 text-purple-700");
      }

      window.dispatchEvent(new Event("admin_data_changed"));
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/60 ring-1 ring-black/[0.03]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F2A52]">Manage Gallery</h1>
            <p className="mt-1 text-sm text-slate-500">View, edit, delete and manage all gallery images.</p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#0F2A52] transition-colors hover:bg-gray-100"
            >
              Cancel edit
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3 pr-3 font-medium">#</th>
                <th className="py-3 pr-3 font-medium">Preview</th>
                <th className="py-3 pr-3 font-medium">Caption</th>
                <th className="py-3 pr-3 font-medium">Date</th>
                <th className="py-3 pr-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">Loading…</td>
                </tr>
              )}
              {!loading &&
                pageItems.map((item, i) => {
                  const id = item._id ?? item.id;
                  return (
                    <tr key={id} className="group transition-colors hover:bg-gray-50/80">
                      <td className="py-3.5 pr-3 text-slate-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="py-3.5 pr-3">
                        <img src={resolveImage(item.image)} alt="" className="h-11 w-16 rounded-lg object-cover ring-1 ring-black/5" />
                      </td>
                      <td className="max-w-xs py-3.5 pr-3 text-[#0F2A52]">
                        <p className="line-clamp-2">{item.caption}</p>
                      </td>
                      <td className="py-3.5 pr-3 whitespace-nowrap text-slate-500">
                        {item.date
                          ? new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="flex justify-end gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
                              <path d="M12 20h9" strokeLinecap="round" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            aria-label="Delete"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
                              <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {!loading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No images yet — upload one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing {items.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, items.length)} of {items.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F2A52] transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  n === page ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : "text-[#0F2A52] hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F2A52] transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="w-full shrink-0 rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/60 ring-1 ring-black/[0.03] lg:w-96">
        <h2 className="text-lg font-semibold text-[#0F2A52]">{isEditing ? "Edit Image" : "Upload New Image"}</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#0F2A52]">
              Image {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors ${
                isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/40"
              }`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="" className="h-full w-full rounded-xl object-cover" />
              ) : (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-2.5 text-xs font-medium text-[#0F2A52]">Drag & drop image here</p>
                  <p className="text-xs text-slate-500">or click to browse</p>
                </>
              )}
            </div>
            {isEditing && (
              <p className="mt-1.5 text-xs text-slate-500">Leave as-is to keep current image, or choose new one.</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div>
            <label htmlFor="caption" className="mb-1.5 block text-sm font-medium text-[#0F2A52]">
              Caption <span className="text-red-500">*</span>
            </label>
            <textarea
              id="caption"
              required
              rows={3}
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              placeholder="Say what's happening in this photo…"
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:bg-[#FFF] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium text-[#0F2A52] transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving…" : isEditing ? "Save changes" : "Upload Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}